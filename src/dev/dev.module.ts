// dev.module.ts
import { Module } from '@nestjs/common';
import { DevService } from './dev.service';
import { DevController } from './dev.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [DevController],
  providers: [DevService, PrismaService], // PrismaService vai aqui
})
export class DevModule {}
