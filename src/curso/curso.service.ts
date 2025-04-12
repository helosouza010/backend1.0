import {
  BadGatewayException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateCursoDto } from './dto/create-curso.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateCursoDto } from './dto/update-curso.dto';

@Injectable()
export class CursoService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    try {
      return await this.prisma.curso.findMany({
        include: { universidade: true }, // opcional: traz os dados da universidade
      });
    } catch (error) {
      throw new InternalServerErrorException('Erro ao buscar cursos: ' + error.message);
    }
  }

  async findOne(id: number) {
    const curso = await this.prisma.curso.findUnique({
      where: { id },
      include: { universidade: true }, // opcional
    });

    if (!curso) {
      throw new NotFoundException(`Curso com ID ${id} não encontrado`);
    }

    return curso;
  }

  async create(createCursoDto: CreateCursoDto) {
    const cursoExists = await this.findByNome(createCursoDto.nome);

    if (cursoExists) {
      throw new BadGatewayException('Já existe um curso com este nome');
    }

    try {
      return await this.prisma.curso.create({
        data: {
          nome: createCursoDto.nome,
          universidade: {
            connect: { id: createCursoDto.universidadeId },
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Erro ao criar curso: ' + error.message);
    }
  }

  async update(id: number, updateCursoDto: UpdateCursoDto) {
    await this.findOne(id);

    try {
      return await this.prisma.curso.update({
        where: { id },
        data: updateCursoDto,
      });
    } catch (error) {
      throw new InternalServerErrorException('Erro ao atualizar curso: ' + error.message);
    }
  }

  async remove(id: number) {
    try {
      await this.findOne(id);
      await this.prisma.curso.delete({
        where: { id },
      });
      return { message: 'Curso removido com sucesso' };
    } catch (error) {
      throw new InternalServerErrorException('Erro ao remover curso: ' + error.message);
    }
  }

  async findByNome(nome: string) {
    try {
      return await this.prisma.curso.findUnique({
        where: { nome },
      });
    } catch (error) {
      throw new InternalServerErrorException('Erro ao buscar curso por nome: ' + error.message);
    }
  }
}
