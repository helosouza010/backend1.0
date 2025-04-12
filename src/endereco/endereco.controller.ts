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
    return this.enderecoService.create(createEnderecoDto);
  }

  // Atualizar um endereço existente
  @Put(':id')
  async update(
    @Param('id') id: string,  // Aqui o 'id' chega como string
    @Body() updateEnderecoDto: UpdateEnderecoDto,
  ) {
    return this.enderecoService.update(Number(id), updateEnderecoDto); // Convertendo id para number
  }

  // Buscar um endereço pelo ID
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.enderecoService.findOne(id);  // ID já como number
  }

  // Listar todos os endereços
  @Get()
  async findAll() {
    return this.enderecoService.findAll();
  }

  // Rota para buscar todos os endereços comerciais
  @Get('comerciais')
  findAllComerciais() {
    return this.enderecoService.findAllComerciais();
  }

  // Rota para buscar todos os endereços residenciais
  @Get('residenciais')
  findAllResidenciais() {
    return this.enderecoService.findAllResidenciais();
  }

  // Remover um endereço
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.enderecoService.remove(id);
  }
}
