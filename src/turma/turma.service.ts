import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTurmaDto } from './dto/create-turma.dto';
import { UpdateTurmaDto } from './dto/update-turma.dto';

@Injectable()
export class TurmaService {
  constructor(private readonly prisma: PrismaService) {}

  // Buscar todas as turmas
  async findAll() {
    try {
      return await this.prisma.turma.findMany({
        include: {
          curso: true,         // Inclui o curso associado à turma
          professor: true,     // Inclui o professor associado à turma
          disciplina: true,    // Inclui a disciplina associada à turma
          alunos: {            // Inclui os alunos associados à turma
            include: {
              aluno: true,     // Inclui os detalhes do aluno
            },
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao buscar turmas: ' + error.message,
      );
    }
  }
  

  // Buscar turma por ID
  async findOne(id: number) {
    try {
      const turma = await this.prisma.turma.findUnique({
        where: { id },
        include: {
          curso: true,
          professor: true,
          disciplina: true,
          alunos: true,
        },
      });

      if (!turma) {
        throw new NotFoundException(`Turma com ID ${id} não encontrada`);
      }

      return turma;
    } catch (error) {
      throw new InternalServerErrorException('Erro ao buscar turma: ' + error.message);
    }
  }

  // Criar uma nova turma
  async create(createTurmaDto: CreateTurmaDto) {
    try {
      return await this.prisma.turma.create({
        data: {
          nome: createTurmaDto.nome,
          cursoId: createTurmaDto.cursoId,
          professorId: createTurmaDto.professorId,
          disciplinaId: createTurmaDto.disciplinaId,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Erro ao criar turma: ' + error.message);
    }
  }

  // Atualizar uma turma
  async update(id: number, updateTurmaDto: UpdateTurmaDto) {
    try {
      return await this.prisma.turma.update({
        where: { id },
        data: updateTurmaDto,
      });
    } catch (error) {
      throw new InternalServerErrorException('Erro ao atualizar turma: ' + error.message);
    }
  }

  // Remover uma turma
  async remove(id: number) {
    try {
      const turma = await this.findOne(id);
      if (!turma) {
        throw new BadRequestException('Turma não encontrada');
      }

      await this.prisma.turma.delete({
        where: { id },
      });

      return { message: 'Turma removida com sucesso' };
    } catch (error) {
      throw new InternalServerErrorException('Erro ao remover turma: ' + error.message);
    }
  }
}
