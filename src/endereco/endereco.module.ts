import { Module } from '@nestjs/common';
import { EnderecoService } from './endereco.service';
import { EnderecoController } from './endereco.controller';
import { PrismaService } from 'src/prisma/prisma.service'; // Certifique-se de que o PrismaService está corretamente importado

@Module({
  imports: [],
  controllers: [EnderecoController],
  providers: [EnderecoService, PrismaService],
})
export class EnderecoModule {}
