import { Module } from '@nestjs/common';
import { UniversidadeService } from './universidade.service';
import { UniversidadeController } from './universidade.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UniqueNomeValidator } from 'src/validation/v-universidade/nome-validation';

@Module({
  imports: [PrismaModule],
  controllers: [UniversidadeController],
  providers: [UniversidadeService, UniqueNomeValidator],
})
export class UniversidadeModule {}