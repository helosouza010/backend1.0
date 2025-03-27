import { Module } from '@nestjs/common';
import { UniversidadeService } from './universidade.service';
import { UniversidadeController } from './universidade.controller';
import { Prismamodule } from 'src/prisma/prisma.module';
import { UniqueNomeValidator } from 'src/validation/v-universidade/nome-validation';

@Module({
  imports: [Prismamodule],
  controllers: [UniversidadeController],
  providers: [UniversidadeService, UniqueNomeValidator],
})
export class UniversidadeModule {}