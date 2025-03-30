import { Injectable } from '@nestjs/common';  // Importa o decorator para tornar o serviço utilizável no NestJS
import { JwtService } from '@nestjs/jwt';  // Importa o serviço para manipulação de JWT
import { AuthDto } from './dto/user.authenticacao.dto';  // Importa o DTO para autenticação
import * as dotenv from 'dotenv';  // Importa o pacote dotenv para carregar variáveis de ambiente
import { PrismaService } from 'src/prisma/prisma.service';  // Importe o PrismaService para interagir com o banco de dados

// Carregar as variáveis de ambiente
dotenv.config();  // Carrega o conteúdo do arquivo .env

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,  // Injeta o JwtService para geração e verificação de tokens
    private prisma: PrismaService,  // Injeta o PrismaService para interagir com o banco de dados
  ) {}

  private refreshTokens: string[] = [];  // Armazena os refresh tokens gerados para validação posterior

  // Método de login
  async login(authDto: AuthDto) {
    const { email, senha } = authDto;  // Extrai as credenciais do DTO de autenticação
    
    // Buscando o aluno no banco de dados
    const aluno = await this.prisma.aluno.findUnique({ where: { email } });

    if (!aluno || aluno.senha !== senha) {  // Valida as credenciais
      throw new Error('Credenciais inválidas');  // Lança erro se as credenciais forem inválidas
    }

    const payload = { email, sub: aluno.id };  // Cria o payload do JWT (id do aluno do banco de dados)

    // Gerar o access token (token de acesso)
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,  // Usando a chave secreta configurada nas variáveis de ambiente
      expiresIn: '15m',  // O access token vai expirar em 15 minutos
    });

    // Gerar o refresh token (token de renovação)
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,  // Usando a chave secreta do refresh token
      expiresIn: '7d',  // O refresh token vai expirar em 7 dias
    });

    // Armazenar o refresh token para posterior validação
    this.refreshTokens.push(refreshToken);

    // Retorna ambos os tokens para o usuário
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  // Método para renovar o access token usando o refresh token
  async refresh(refreshToken: string) {
    if (!this.refreshTokens.includes(refreshToken)) {  // Verifica se o refresh token está na lista de tokens válidos
      throw new Error('Refresh token inválido');  // Lança erro caso o refresh token não seja encontrado
    }

    try {
      // Verifica e decodifica o refresh token para obter os dados do payload
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,  // Usando a chave secreta do refresh token
      });

      // Gera um novo access token baseado nos dados do refresh token
      const accessToken = this.jwtService.sign(
        { email: payload.email, sub: payload.sub },  // Payload contendo o email e ID do aluno
        {
          secret: process.env.JWT_SECRET,  // Usando a chave secreta do access token
          expiresIn: '15m',  // O novo access token expira em 15 minutos
        },
      );

      return { access_token: accessToken };  // Retorna o novo access token
    } catch (error) {
      throw new Error('Refresh token expirado ou inválido');  // Lança erro caso o refresh token seja inválido ou expirado
    }
  }
}
