import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // Importação do ConfigModule
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AlunoModule } from './aluno/aluno.module';
import { CursoModule } from './curso/curso.module';
import { UniversidadeModule } from './universidade/universidade.module';
import { AuthModule } from './auth/auth.module';
import { EnderecoModule } from './endereco/endereco.module';



@Module({
  imports: [
    ConfigModule.forRoot(), // Certifique-se de que o ConfigModule está sendo carregado primeiro
    AlunoModule,
    CursoModule,
    UniversidadeModule,
    AuthModule,
    EnderecoModule,
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
