import { Injectable, UnauthorizedException } from '@nestjs/common';  // Importa os decorators e exceções
import { JwtService } from '@nestjs/jwt';  // Importa o serviço para manipulação de JWT
import { AuthDto } from './dto/user.authenticacao.dto';  // Importa o DTO de autenticação
import * as dotenv from 'dotenv';  // Carregar variáveis de ambiente
import * as bcrypt from 'bcrypt';  // Importa bcrypt para comparar senhas hash
import { PrismaService } from 'src/prisma/prisma.service';  // PrismaService para interação com o banco de dados

// Carregar as variáveis de ambiente
dotenv.config();

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,  // Injeta o JwtService para gerar tokens
    private prisma: PrismaService,  // Injeta o PrismaService para interação com o banco
  ) {}

  private refreshTokens: string[] = [];  // Armazena os refresh tokens válidos

  // Método de login
  async login(authDto: AuthDto) {
    const { email, senha } = authDto;

    // Busca o aluno no banco de dados
    const aluno = await this.prisma.aluno.findUnique({ where: { email } });

    if (!aluno) {
      throw new UnauthorizedException('Credenciais inválidas');  // Se o aluno não existir
    }

    // Compara a senha fornecida com a senha hash armazenada
    const senhaValida = await bcrypt.compare(senha, aluno.senhaHash);
    if (!senhaValida) {
      throw new UnauthorizedException('Credenciais inválidas');  // Se as senhas não coincidirem
    }

    const payload = { email, sub: aluno.id };  // Payload do JWT com o ID do aluno

    // Gera o access token
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '15m',  // Expira em 15 minutos
    });

    // Gera o refresh token
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',  // Expira em 7 dias
    });

    // Armazena o refresh token para validação posterior
    this.refreshTokens.push(refreshToken);

    return {
      access_token: accessToken,  // Retorna o access token gerado
      refresh_token: refreshToken,  // Retorna o refresh token gerado
    };
  }

  // Método para renovar o access token com o refresh token
  async refresh(refreshToken: string) {
    // Verifica se o refresh token está na lista de tokens válidos
    if (!this.refreshTokens.includes(refreshToken)) {
      throw new UnauthorizedException('Refresh token inválido');  // Se o refresh token não for válido
    }

    try {
      // Decodifica e valida o refresh token
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      // Gera um novo access token
      const accessToken = this.jwtService.sign(
        { email: payload.email, sub: payload.sub },  // Usando o email e ID do aluno no payload
        {
          secret: process.env.JWT_SECRET,  // Chave secreta do JWT de acesso
          expiresIn: '15m',  // O novo access token expira em 15 minutos
        },
      );

      return { access_token: accessToken };  // Retorna o novo access token
    } catch (error) {
      // Se o refresh token for inválido ou expirado, lança uma exceção
      throw new UnauthorizedException('Refresh token expirado ou inválido');
    }
  }
}
