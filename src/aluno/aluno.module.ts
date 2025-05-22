import { Module } from '@nestjs/common';
import { AlunoService } from './aluno.service';
import { AlunoController } from './aluno.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EmailModule } from '../email/email.module'; //importacao para email

@Module({
  imports: [PrismaModule,EmailModule],
  controllers: [AlunoController],
  providers: [AlunoService],
  exports: []
})
export class AlunoModule {}