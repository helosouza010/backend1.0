import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { DisciplinaService } from './disciplina.service';
import { CreateDisciplinaDto } from './dto/create-disciplina.dto';
import { UpdateDisciplinaDto } from './dto/update-disciplina.dto';

@Controller('disciplinas')
export class DisciplinaController {
  constructor(private readonly disciplinaService: DisciplinaService) {}

  // Criar nova disciplina
  @Post()
  async create(@Body() createDisciplinaDto: CreateDisciplinaDto) {
    return await this.disciplinaService.create(createDisciplinaDto);
  }

  // Buscar todas as disciplinas
  @Get()
  async findAll() {
    return await this.disciplinaService.findAll();
  }

  // Buscar disciplina por ID
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.disciplinaService.findOne(id);
  }

  // Atualizar disciplina
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateDisciplinaDto: UpdateDisciplinaDto,
  ) {
    return await this.disciplinaService.update(id, updateDisciplinaDto);
  }

  // Remover disciplina
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.disciplinaService.remove(id);
  }
}
