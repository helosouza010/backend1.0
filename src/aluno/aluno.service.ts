import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAlunoDto } from './dto/create-aluno.dto';
import { UpdateAlunoDto } from './dto/update-aluno.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AlunoService {
  constructor(private readonly prisma: PrismaService) {}

  // Criar um novo aluno com endereço e vincular a uma turma (se fornecida)
  async create(createAlunoDto: CreateAlunoDto) {
    const { nome, email, senha, cursoId, endereco, turmaId } = createAlunoDto;

    const emailExistente = await this.prisma.aluno.findUnique({
      where: { email },
    });
    if (emailExistente) {
      throw new BadRequestException('Já existe um aluno com este e-mail');
    }

    const curso = await this.prisma.curso.findUnique({
      where: { id: cursoId },
    });
    if (!curso) {
      throw new NotFoundException('Curso não encontrado');
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    try {
      const aluno = await this.prisma.aluno.create({
        data: {
          nome,
          email,
          senhaHash,
          cursoId,
          endereco: endereco ? { create: endereco } : undefined,
        },
        include: {
          endereco: true,
        },
      });

      if (turmaId) {
        await this.vincularTurma(aluno.id, turmaId);
      }

      return aluno;
    } catch (error) {
      throw new InternalServerErrorException('Erro ao criar aluno: ' + error.message);
    }
  }

  // Listar todos os alunos com detalhes
  async findAll() {
    return this.prisma.aluno.findMany({
      include: {
        curso: {
          include: {
            universidade: true,
          },
        },
        endereco: true,
        turmas: {
          include: {
            turma: true,
          },
        },
      },
    });
  }

  // Buscar um aluno pelo ID, incluindo detalhes de curso, universidade, endereço e turmas
  async findOne(id: number) {
    const aluno = await this.prisma.aluno.findUnique({
      where: { id }, // Passando corretamente o valor de id
      include: {
        curso: {
          include: {
            universidade: true,
          },
        },
        endereco: true,
        turmas: {
          include: {
            turma: true,
          },
        },
      },
    });

    if (!aluno) {
      throw new NotFoundException(`Aluno com ID ${id} não encontrado`);
    }

    return aluno;
  }

  // Buscar as turmas de um aluno
  async findAllTurmas() {
    return this.prisma.aluno.findMany({
      include: {
        turmas: {
          include: {
            turma: true,  // Inclui as turmas relacionadas ao aluno
          },
        },
      },
    });
  }

  // Atualizar um aluno
  async update(id: number, updateAlunoDto: UpdateAlunoDto) {
    await this.findOne(id);

    const { senha, endereco, ...rest } = updateAlunoDto;

    let senhaHash;
    if (senha) {
      senhaHash = await bcrypt.hash(senha, 10);
    }

    try {
      return await this.prisma.aluno.update({
        where: { id },
        data: {
          ...rest,
          senhaHash: senhaHash ? senhaHash : undefined,
          endereco: endereco ? { update: endereco } : undefined,
        },
        include: {
          endereco: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Erro ao atualizar aluno: ' + error.message);
    }
  }

  // Remover um aluno
  async remove(id: number) {
    await this.findOne(id);

    try {
      await this.prisma.aluno.delete({
        where: { id },
      });
      return { message: 'Aluno removido com sucesso' };
    } catch (error) {
      throw new InternalServerErrorException('Erro ao remover aluno: ' + error.message);
    }
  }

  // Vincular um aluno a uma turma
  async vincularTurma(alunoId: number, turmaId: number) {
    const aluno = await this.prisma.aluno.findUnique({ where: { id: alunoId } });
    if (!aluno) {
      throw new NotFoundException('Aluno não encontrado');
    }

    const turma = await this.prisma.turma.findUnique({ where: { id: turmaId } });
    if (!turma) {
      throw new NotFoundException('Turma não encontrada');
    }

    const vinculoExistente = await this.prisma.alunoTurma.findUnique({
      where: {
        alunoId_turmaId: {
          alunoId,
          turmaId,
        },
      },
    });

    if (vinculoExistente) {
      throw new BadRequestException('Aluno já está vinculado a esta turma');
    }

    try {
      await this.prisma.alunoTurma.create({
        data: {
          alunoId,
          turmaId,
        },
      });
      return { message: 'Aluno vinculado à turma com sucesso' };
    } catch (error) {
      throw new InternalServerErrorException('Erro ao vincular aluno à turma: ' + error.message);
    }
  }

  // Desvincular um aluno de uma turma
  async desvincularTurma(alunoId: number, turmaId: number) {
    const vinculoExistente = await this.prisma.alunoTurma.findUnique({
      where: {
        alunoId_turmaId: {
          alunoId,
          turmaId,
        },
      },
    });

    if (!vinculoExistente) {
      throw new NotFoundException('Vínculo entre aluno e turma não encontrado');
    }

    try {
      await this.prisma.alunoTurma.delete({
        where: {
          alunoId_turmaId: {
            alunoId,
            turmaId,
          },
        },
      });
      return { message: 'Aluno desvinculado da turma com sucesso' };
    } catch (error) {
      throw new InternalServerErrorException('Erro ao desvincular aluno da turma: ' + error.message);
    }
  }
}
