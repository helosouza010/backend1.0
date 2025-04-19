import { Controller, Post } from '@nestjs/common';
import { DevService } from './dev.service';

@Controller('dev')
export class DevController {
  constructor(private readonly devService: DevService) {}

  @Post('importar')
  async importarDados() {
    return this.devService.importarDados();
  }
}
