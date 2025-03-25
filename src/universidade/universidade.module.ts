import { Module } from '@nestjs/common';
import { UniversidadeService } from './universidade.service';
import { UniversidadeController } from './universidade.controller';

@Module({
  controllers: [UniversidadeController],
  providers: [UniversidadeService],
})
export class UniversidadeModule {}
