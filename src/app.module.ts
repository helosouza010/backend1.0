import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuarioModule } from './usuario/usuario.module';
import { CursoModule } from './curso/curso.module';
import { UniversidadeModule } from './universidade/universidade.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UsuarioModule, CursoModule, UniversidadeModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
