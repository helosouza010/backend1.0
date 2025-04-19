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

  // Buscar todos os cursos
  async findAll() {
    try {
      return await this.prisma.curso.findMany({
        include: { universidade: true }, // Inclui dados da universidade
      });
    } catch (error) {
      throw new InternalServerErrorException('Erro ao buscar cursos: ' + error.message);
    }
  }

  // Buscar um curso por ID
  async findOne(id: number) {
    const curso = await this.prisma.curso.findUnique({
      where: { id },
      include: { universidade: true }, // Inclui dados da universidade
    });

    if (!curso) {
      throw new NotFoundException(`Curso com ID ${id} não encontrado`);
    }

    return curso;
  }

  // Criar um novo curso
  async create(createCursoDto: CreateCursoDto) {
    const cursoExists = await this.prisma.curso.findFirst({
      where: { nome: createCursoDto.nome }, // Usando findFirst para checar curso com nome duplicado
    });

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

  // Atualizar um curso existente
  async update(id: number, updateCursoDto: UpdateCursoDto) {
    await this.findOne(id); // Garante que o curso existe

    try {
      return await this.prisma.curso.update({
        where: { id },
        data: updateCursoDto,
      });
    } catch (error) {
      throw new InternalServerErrorException('Erro ao atualizar curso: ' + error.message);
    }
  }

  // Remover um curso
  async remove(id: number) {
    try {
      await this.findOne(id); // Garante que o curso existe
      await this.prisma.curso.delete({
        where: { id },
      });
      return { message: 'Curso removido com sucesso' };
    } catch (error) {
      throw new InternalServerErrorException('Erro ao remover curso: ' + error.message);
    }
  }
}
