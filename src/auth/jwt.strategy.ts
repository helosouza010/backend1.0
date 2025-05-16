import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from './auth-payload.interface';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    // Verifica se o segredo JWT_SECRET está presente nas variáveis de ambiente
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET não está definido no arquivo .env');
    }

    // Configura a estratégia JWT para extrair o token do cabeçalho Authorization
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
    });
  }

  // Método validate é chamado quando o JWT é validado com sucesso
  async validate(payload: JwtPayload) {
    const user = await this.prisma.aluno.findUnique({
      where: { id: payload.sub },
      include: {
        permissoes: {
          include: {
            permissao: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado ou token inválido');
    }

    const permissoes = user.permissoes.map(p => p.permissao.nome);

    return {
      id: user.id,
      nome: user.nome,
      email: user.email,
      permissoes,
    };
  }
}
