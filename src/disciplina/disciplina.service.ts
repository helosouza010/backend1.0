import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDisciplinaDto } from './dto/create-disciplina.dto';
import { UpdateDisciplinaDto } from './dto/update-disciplina.dto';

@Injectable()
export class DisciplinaService {
  constructor(private readonly prisma: PrismaService) {}

  // Buscar todas as disciplinas
  async findAll() {
    try {
      return await this.prisma.disciplina.findMany({
        include: { curso: true }, // Inclui o curso associado à disciplina
      });
    } catch (error) {
      throw new InternalServerErrorException('Erro ao buscar disciplinas: ' + error.message);
    }
  }

  // Buscar uma disciplina por ID
  async findOne(id: number) {
    const disciplina = await this.prisma.disciplina.findUnique({
      where: { id },
      include: { curso: true }, // Inclui o curso associado à disciplina
    });

    if (!disciplina) {
      throw new NotFoundException(`Disciplina com ID ${id} não encontrada`);
    }

    return disciplina;
  }

  // Criar uma nova disciplina
  async create(createDisciplinaDto: CreateDisciplinaDto) {
    // Verificar se a disciplina já existe no curso
    const disciplinaExists = await this.prisma.disciplina.findFirst({
      where: {
        nome: createDisciplinaDto.nome,
        cursoId: createDisciplinaDto.cursoId, // Garantir que a disciplina seja única dentro do curso
      },
    });

    if (disciplinaExists) {
      throw new BadRequestException('Já existe uma disciplina com esse nome no curso especificado');
    }

    try {
      return await this.prisma.disciplina.create({
        data: {
          nome: createDisciplinaDto.nome,
          curso: {
            connect: { id: createDisciplinaDto.cursoId },
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Erro ao criar disciplina: ' + error.message);
    }
  }

  // Atualizar uma disciplina existente
  async update(id: number, updateDisciplinaDto: UpdateDisciplinaDto) {
    await this.findOne(id); // Verifica se a disciplina existe

    try {
      return await this.prisma.disciplina.update({
        where: { id },
        data: updateDisciplinaDto,
      });
    } catch (error) {
      throw new InternalServerErrorException('Erro ao atualizar disciplina: ' + error.message);
    }
  }

  // Remover uma disciplina
  async remove(id: number) {
    try {
      await this.findOne(id); // Verifica se a disciplina existe
      await this.prisma.disciplina.delete({
        where: { id },
      });
      return { message: 'Disciplina removida com sucesso' };
    } catch (error) {
      throw new InternalServerErrorException('Erro ao remover disciplina: ' + error.message);
    }
  }
}
