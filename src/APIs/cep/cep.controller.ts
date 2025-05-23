import { Controller, Get, Param, BadRequestException, UseGuards } from '@nestjs/common';
import { CepService } from './cep.service';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // descomente se for proteger

// @UseGuards(JwtAuthGuard) // opcional
@Controller('cep')
export class CepController {
  constructor(private readonly cepService: CepService) {}

  @Get(':cep')
  async buscarCep(@Param('cep') cep: string) {
    if (!/^\d{8}$/.test(cep)) {
      throw new BadRequestException('CEP inválido. Use apenas 8 dígitos numéricos.');
    }

    return this.cepService.buscarCep(cep);
  }
}
