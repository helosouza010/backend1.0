import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuarioModule } from './usuario/usuario.module';
import { CursoModule } from './curso/curso.module';
import { UniversidadeModule } from './universidade/universidade.module';

@Module({
  imports: [UsuarioModule, CursoModule, UniversidadeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
