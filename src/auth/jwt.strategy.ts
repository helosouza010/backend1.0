//    Define como o JWT será validado. Ele explica o processo 
//de como verificar se o token é válido quando o usuário faz uma requisição autenticada.


import { Injectable } from '@nestjs/common';  // Importa o decorator Injectable para permitir que a classe seja injetada como dependência
import { PassportStrategy } from '@nestjs/passport';  // Importa o PassportStrategy, que é usado para integrar o Passport no NestJS
import { ExtractJwt, Strategy } from 'passport-jwt';  // Importa os métodos do Passport para manipulação de JWT
import { AuthService } from './auth.service';  // Importa o AuthService, utilizado no código para validação
import { JwtPayload } from './auth-payload.interface';  // Importa a interface do payload do JWT
import * as dotenv from 'dotenv';  // Importa a biblioteca dotenv para carregar as variáveis de ambiente

dotenv.config();  // Carrega as variáveis de ambiente do arquivo .env

@Injectable()  // Torna o JwtStrategy disponível para injeção de dependência no NestJS
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    // Verifica se o segredo JWT_SECRET está presente nas variáveis de ambiente
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET não está definido no arquivo .env');  // Lança erro caso o segredo não exista
    }

    // Chama o construtor da classe pai (PassportStrategy) passando as configurações para a estratégia JWT
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),  // Extraí o token JWT do cabeçalho Authorization
      secretOrKey: secret,  // Usa o segredo carregado do arquivo .env para validar o JWT
    });
  }

  // Método validate é chamado quando o JWT é validado com sucesso
  async validate(payload: JwtPayload) {
    // O payload contém informações do usuário que estavam no JWT. Geralmente, verifica-se se o usuário existe no banco de dados.
    return { userId: payload.sub, username: payload.username };  // Retorna as informações extraídas do payload
  }
}
