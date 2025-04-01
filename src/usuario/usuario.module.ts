import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import {PrismaModule} from 'src/prisma/prisma.module';

@Module({
  imports:
  [PrismaModule],
  controllers: [UsuarioController],
  providers: [UsuarioService],
  exports: [UsuarioService], // Exporta o serviço para que possa ser usado em outros módulos
  // Isso é útil se você quiser usar o UsuarioService em outros módulos, como o AuthModule.
})
export class UsuarioModule {}
