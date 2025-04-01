import { userauthDto } from './dto/userauth.dto';
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: userauthDto) {
    return this.authService.login(loginDto); // Chama o método login do serviço
  }
}
