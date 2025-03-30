import { Module } from '@nestjs/common';  // Importa o decorator para definir o módulo
import { JwtModule } from '@nestjs/jwt';  // Importa o módulo para trabalhar com JWT
import { AuthService } from './auth.service';  // Serviço de autenticação
import { AuthController } from './auth.controller';  // Controlador de autenticação
import { JwtStrategy } from './jwt.strategy';  // Estratégia de JWT para validação
import { JwtAuthGuard } from './jwt-auth.guard';  // Guarda para autenticação com JWT
import { Prismamodule } from '../prisma/prisma.module';  // Importa o PrismaModule para o PrismaService

@Module({
  imports: [
    Prismamodule,  // Importa o PrismaModule para garantir que o PrismaService esteja disponível
    JwtModule.register({
      secret: process.env.JWT_SECRET,  // Usando o segredo de um arquivo .env (não use 'your-secret-key' em produção)
      signOptions: { expiresIn: '15m' },  // Tempo de expiração do access token. Neste caso, 15 minutos
    }),
  ],
  providers: [
    AuthService,   // Registra o AuthService como um provider para injeção de dependência
    JwtStrategy,   // Registra a estratégia JwtStrategy para autenticação e validação de JWT
    JwtAuthGuard,  // Registra o guarda JwtAuthGuard que protege as rotas que exigem JWT válido
  ],
  controllers: [AuthController],  // Registra o AuthController para lidar com as requisições de autenticação
})
export class AuthModule {}
