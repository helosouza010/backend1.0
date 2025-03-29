import { Injectable } from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable() // Indica que esta classe pode ser injetada como dependência
export class ProfileService {
  
  getProfile(userId: number) {
    return { userId, username: 'user', email: 'user@example.com' }; 
    // Simula o retorno das informações do usuário
  }

  updateProfile(userId: number, updateProfileDto: UpdateProfileDto) {
    return { message: 'Perfil atualizado com sucesso' }; 
    // Simula a atualização do perfil (a lógica real envolveria salvar no banco de dados)
  }
}
