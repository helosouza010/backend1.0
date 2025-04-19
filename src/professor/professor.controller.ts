import { Controller, Get, Param, Post, Body, Delete } from '@nestjs/common';
import { ProfessorService } from './professor.service';
import { CreateProfessorDto } from './dto/create-professor.dto';
import { UpdateProfessorDto } from './dto/update-professor.dto';
import { CreateProfessorDisciplinaDto } from './dto/create-professor-disciplina.dto';

@Controller('professores')
export class ProfessorController {
  constructor(private readonly professorService: ProfessorService) {}

  // Criar um novo professor
  @Post()
  create(@Body() createProfessorDto: CreateProfessorDto) {
    return this.professorService.create(createProfessorDto);
  }

  // Vincular um professor a uma disciplina
  @Post('vincular-disciplina')
  async vincularProfessorDisciplina(
    @Body() createProfessorDisciplinaDto: CreateProfessorDisciplinaDto
  ) {
    return this.professorService.vincularProfessorDisciplina(createProfessorDisciplinaDto);
  }


  // Listar todos os professores
  @Get()
  findAll() {
    return this.professorService.findAll();
  }

  @Get('vincular-disciplina')
  async findAllTurmas() {
    return this.professorService.findAllDisciplinas();
  }

  // Buscar um professor pelo ID
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.professorService.findOne(id);
  }

  // Atualizar um professor
  @Post(':id')
  update(@Param('id') id: number, @Body() updateProfessorDto: UpdateProfessorDto) {
    return this.professorService.update(id, updateProfessorDto);
  }

  // Remover um professor
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.professorService.remove(id);
  }

  // Desvincular um professor de uma disciplina
  @Delete(':id/desvincular-disciplina/:disciplinaId')
  async desvincularProfessorDisciplina(
    @Param('id') professorId: number,
    @Param('disciplinaId') disciplinaId: number
  ) {
    return this.professorService.desvincularProfessorDisciplina(professorId, disciplinaId);
  }
}
