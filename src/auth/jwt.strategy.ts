import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Pega o token do header
      ignoreExpiration: false, // Não permite token expirado
      secretOrKey: 'minhaChaveSecreta', // Substitua por uma variável de ambiente no futuro
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}

//criado arquivo jwt.strategy.ts e editado, ele será usado pelo *Passport*
//A estratégia JWT verifica o token enviado no header.
//Se o token for válido, ele extrai os dados do usuário e os adiciona na requisição.