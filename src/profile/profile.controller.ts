import { Controller, Get, Put, Param, Body, UseGuards } from '@nestjs/common';
import { ProfileService } from 'src/profile/profile.service';
import { UpdateProfileDto } from 'src/profile/dto/update-profile.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('profile')  // Define um controlador para a rota '/profile'
export class ProfileController {
  constructor(private profileService: ProfileService) {} // Injeta o serviço de perfil

  @Get(':id')  
  @UseGuards(JwtAuthGuard)  // Aplica o guard JWT para proteger a rota
  getProfile(@Param('id') id: string) {
    return this.profileService.getProfile(+id);  // Converte o ID para número e retorna o perfil do usuário
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)  // Aplica o guard JWT para proteger a rota
  updateProfile(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.updateProfile(+id, updateProfileDto);  // Converte o ID para número e atualiza o perfil
  }
}
