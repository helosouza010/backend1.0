import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AlunoModule } from './aluno/aluno.module'; // Add the correct import statement here
import { CursoModule } from './curso/curso.module';
import { UniversidadeModule } from './universidade/universidade.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [AlunoModule, CursoModule, UniversidadeModule],
})
export class AppModule {}
