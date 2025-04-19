// professor/professor.module.ts
import { Module } from '@nestjs/common';
import { ProfessorService } from './professor.service';
import { ProfessorController } from './professor.controller';
import { PrismaModule } from 'src/prisma/prisma.module';  // Importe o PrismaModule

@Module({
  imports: [PrismaModule],  // Adicione o PrismaModule aqui
  controllers: [ProfessorController],
  providers: [ProfessorService],
})
export class ProfessorModule {}
