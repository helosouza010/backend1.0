import { UsuarioService } from './../usuario/usuario.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common'; // Exceção específica
import { userauthDto } from './dto/userauth.dto'; // DTO que recebe dados de login

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarioService: UsuarioService, // Serviço de usuários
    private readonly jwtService: JwtService, // Para gerar o JWT
  ) {}

  async login(userauthDto) {
    const usuario = await this.usuarioService.findByNome(userauthDto.nome);

    if (!usuario) {
      throw new UnauthorizedException('Credenciais inválidas'); // Usando a exceção específica
    }

    // Comparando as senhas em texto simples (não recomendado)
    if (usuario.senha !== userauthDto.password) {
      throw new UnauthorizedException('Credenciais inválidas'); // Usando a exceção específica
    }

    // Gerando o token JWT
    const payload = { nome: usuario.nome, sub: usuario.id };
    return {
      access_token: this.jwtService.sign(payload), // Gera e retorna o token
    };
  }
}