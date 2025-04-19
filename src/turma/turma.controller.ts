import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { TurmaService } from './turma.service';
import { CreateTurmaDto } from './dto/create-turma.dto';
import { UpdateTurmaDto } from './dto/update-turma.dto';

@Controller('turmas')
export class TurmaController {
  constructor(private readonly turmaService: TurmaService) {}

  // Criar uma nova turma
  @Post()
  async create(@Body() createTurmaDto: CreateTurmaDto) {
    return await this.turmaService.create(createTurmaDto);
  }

  // Buscar todas as turmas
  @Get()
  async findAll() {
    return await this.turmaService.findAll();
  }

  // Buscar turma por ID
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.turmaService.findOne(id);
  }

  // Atualizar uma turma
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateTurmaDto: UpdateTurmaDto,
  ) {
    return await this.turmaService.update(id, updateTurmaDto);
  }

  // Remover uma turma
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.turmaService.remove(id);
  }
}
