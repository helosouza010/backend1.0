import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AlunoService } from './aluno.service';
import { CreateAlunoDto } from './dto/create-aluno.dto';
import { UpdateAlunoDto } from './dto/update-aluno.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Permissoes } from '../auth/permissoes.decorator';
import { PermissaoGuard } from '../auth/permissao.guard';

@Controller('aluno')
export class AlunoController {
  constructor(private readonly alunoService: AlunoService) {}

  // Criar um novo aluno
  @Post()
  create(@Body() createAlunoDto: CreateAlunoDto) {
    return this.alunoService.create(createAlunoDto);
  }

  // Vincular um aluno a uma turma
  @Post('aluno-turma')
  async vincularAlunoTurma(@Body() body: { alunoId: number; turmaId: number }) {
    return this.alunoService.vincularTurma(body.alunoId, body.turmaId);
  }

  // Listar todos os alunos
  @Get()
  findAll() {
    return this.alunoService.findAll();
  }

  @Get('aluno-turma')
  async findAllTurmas() {
    return this.alunoService.findAllTurmas();
  }

  // Buscar um aluno pelo ID
  @Get(':id')
  @UseGuards(JwtAuthGuard, PermissaoGuard)
  @Permissoes('R_ALN')
  findOne(@Param('id') id: string) {
    return this.alunoService.findOne(+id);
}

  // Atualizar um aluno
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAlunoDto: UpdateAlunoDto) {
    return this.alunoService.update(+id, updateAlunoDto);
  }

  // Remover um aluno
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.alunoService.remove(+id);
  }

  // Buscar todos os alunos com suas turmas associadas
  

  // Desvincular aluno de uma turma
  @Delete('aluno-turma/:alunoId/:turmaId')
  async desvincularAlunoTurma(@Param('alunoId') alunoId: number, @Param('turmaId') turmaId: number) {
    return this.alunoService.desvincularTurma(alunoId, turmaId);
  }
}
