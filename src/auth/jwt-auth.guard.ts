import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') { }
//Agora, podemos proteger rotas simplesmente adicionando @UseGuards(JwtAuthGuard).