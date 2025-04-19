// disciplina/disciplina.module.ts
import { Module } from '@nestjs/common';
import { DisciplinaService } from './disciplina.service';
import { DisciplinaController } from './disciplina.controller';
import { PrismaModule } from 'src/prisma/prisma.module';  // Importe o PrismaModule

@Module({
  imports: [PrismaModule],  // Adicione o PrismaModule aqui
  controllers: [DisciplinaController],
  providers: [DisciplinaService],
})
export class DisciplinaModule {}
