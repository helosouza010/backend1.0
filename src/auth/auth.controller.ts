import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/user.authenticacao.dto';

// Define o controlador com o caminho 'auth' para as rotas relacionadas à autenticação
@Controller('auth')
export class AuthController {
  
  // Injeta o AuthService no controlador
  constructor(private authService: AuthService) {}

  // Rota de login
  @Post('login')
  async login(@Body() authDto: AuthDto) {

    // Chama a função de login do AuthService, passando os dados de login (authDto)
    return this.authService.login(authDto);
  }

  // Rota para renovar o token de acesso utilizando o refresh token
  @Post('refresh')
  async refresh(@Body('refresh_token') refreshToken: string) {

     // Chama a função de refresh do AuthService, passando o refresh token
    return this.authService.refresh(refreshToken);
  }
}
