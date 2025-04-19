import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProfessorDto } from './dto/create-professor.dto';
import { UpdateProfessorDto } from './dto/update-professor.dto';
import { CreateProfessorDisciplinaDto } from './dto/create-professor-disciplina.dto';

@Injectable()
export class ProfessorService {
  constructor(private readonly prisma: PrismaService) {}

  // Buscar todos os professores com suas disciplinas associadas
  async findAll() {
    try {
      return await this.prisma.professor.findMany({
        include: {
          disciplinas: {
            include: {
              disciplina: true, // Inclui os dados completos da disciplina associada
            },
          },
          endereco: true,    // Inclui o endereço (se houver)
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao buscar professores: ' + error.message,
      );
    }
  }
  

  // Buscar um professor pelo ID com suas disciplinas associadas
  async findOne(id: number) {
    const professor = await this.prisma.professor.findUnique({
      where: { id },
      include: {
        disciplinas: true, // Inclui disciplinas associadas ao professor
        endereco: true,    // Inclui endereço (se houver)
      },
    });

    if (!professor) {
      throw new NotFoundException(`Professor com ID ${id} não encontrado`);
    }

    return professor;
  }

  // Criar um novo professor, com ou sem endereço associado
  async create(createProfessorDto: CreateProfessorDto) {
    const { nome, email, endereco } = createProfessorDto;

    try {
      return await this.prisma.professor.create({
        data: {
          nome,
          email,
          // Cria o endereço associado, se enviado no DTO
          ...(endereco && {
            endereco: {
              create: endereco,
            },
          }),
        },
        include: {
          endereco: true, // Retorna o professor já com o endereço criado
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao criar professor: ' + error.message,
      );
    }
  }

// Atualizar um professor existente
async update(id: number, updateProfessorDto: UpdateProfessorDto) {
  await this.findOne(id); // Verifica se o professor existe antes de atualizar

  const { endereco, ...dadosProfessor } = updateProfessorDto;

  try {
    return await this.prisma.professor.update({
      where: { id },
      data: {
        ...dadosProfessor,
        endereco: endereco
          ? {
              upsert: {
                update: { ...endereco },
                create: { ...endereco },
              },
            }
          : undefined,
      },
      include: {
        endereco: true,
      },
    });
  } catch (error) {
    throw new InternalServerErrorException(
      'Erro ao atualizar professor: ' + error.message,
    );
  }
}

// Encontra todos os professores e inclui as disciplinas associadas
async findAllDisciplinas() {
  try {
    return await this.prisma.professor.findMany({
      include: {
        disciplinas: {
          include: {
            disciplina: true, // Inclui os dados completos da disciplina associada
          },
        },
      },
    });
  } catch (error) {
    throw new InternalServerErrorException(
      'Erro ao buscar professores com disciplinas: ' + error.message,
    );
  }
}

  // Remover um professor do sistema
  async remove(id: number) {
    try {
      await this.findOne(id); // Verifica se o professor existe antes de remover
      await this.prisma.professor.delete({
        where: { id },
      });
      return { message: 'Professor removido com sucesso' };
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao remover professor: ' + error.message,
      );
    }
  }

  // Vincular um professor a uma disciplina
  async vincularProfessorDisciplina(
    createProfessorDisciplinaDto: CreateProfessorDisciplinaDto,
  ) {
    const { professorId, disciplinaId } = createProfessorDisciplinaDto;

    try {
      // Cria a associação entre o professor e a disciplina
      return await this.prisma.professorDisciplina.create({
        data: {
          professorId,
          disciplinaId,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao vincular professor à disciplina: ' + error.message,
      );
    }
  }

  // Desvincular um professor de uma disciplina
  async desvincularProfessorDisciplina(
    professorId: number,
    disciplinaId: number,
  ) {
    try {
      // Remove a associação entre o professor e a disciplina
      await this.prisma.professorDisciplina.delete({
        where: {
          professorId_disciplinaId: {
            professorId,
            disciplinaId,
          },
        },
      });
      return {
        message: 'Professor desvinculado da disciplina com sucesso',
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao desvincular professor da disciplina: ' + error.message,
      );
    }
  }
}
