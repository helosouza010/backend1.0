import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsuarioModule } from '../usuario/usuario.module'; // Importe o módulo correto

@Module({
  imports: [
    UsuarioModule, // Certifique-se de incluir o UsuarioModule aqui
    JwtModule.register({
      secret: 'sua-chave-secreta', // Chave para assinar o JWT
      signOptions: { expiresIn: '1h' }, // Expiração do JWT
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}