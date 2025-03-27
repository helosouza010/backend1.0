import { Module } from '@nestjs/common';
import { AlunoService } from './aluno.service';
import { AlunoController } from './aluno.controller';
import { Prismamodule } from 'src/prisma/prisma.module';

@Module({
  imports: [Prismamodule],
  controllers: [AlunoController],
  providers: [AlunoService],
  exports: []
})
export class AlunoModule {}