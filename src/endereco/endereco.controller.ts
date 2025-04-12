import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { EnderecoService } from './endereco.service';
import { CreateEnderecoDto } from './dto/create-endereco.dto';
import { UpdateEnderecoDto } from './dto/update-endereco.dto';

@Controller('enderecos')
export class EnderecoController {
  constructor(private readonly enderecoService: EnderecoService) {}

  // Criar um novo endereço
  @Post()
  async create(@Body() createEnderecoDto: CreateEnderecoDto) {
    return await this.enderecoService.create(createEnderecoDto);
  }

  // Listar todos os endereços comerciais
  @Get('comerciais')
  async findAllComerciais() {
    return await this.enderecoService.findAllComerciais();
  }

  // Listar todos os endereços residenciais
  @Get('residenciais')
  async findAllResidenciais() {
    return await this.enderecoService.findAllResidenciais();
  }

  // Listar todos os endereços
  @Get()
  async findAll() {
    return await this.enderecoService.findAll();
  }

  // Buscar um endereço pelo ID
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.enderecoService.findOne(Number(id));
  }

  // Atualizar um endereço existente
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEnderecoDto: UpdateEnderecoDto,
  ) {
    return await this.enderecoService.update(Number(id), updateEnderecoDto);
  }

  // Remover um endereço
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.enderecoService.remove(Number(id));
  }
}
