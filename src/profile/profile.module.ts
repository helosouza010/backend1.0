import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
  controllers: [ProfileController], // Registra o controlador responsável pelas rotas de perfil
  providers: [ProfileService], // Registra o serviço que contém a lógica de negócios do perfil
})
export class ProfileModule {} // Define o módulo ProfileModule
