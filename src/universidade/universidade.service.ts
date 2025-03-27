import { Injectable, NotFoundException, InternalServerErrorException, BadGatewayException } from '@nestjs/common';
import { CreateUniversidadeDto } from './dto/create-universidade.dto';
import { UpdateUniversidadeDto } from './dto/update-universidade.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UniversidadeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUniversidadeDto: CreateUniversidadeDto) {
    const universidadeExists = await this.findByNome(createUniversidadeDto.nome);

    if (universidadeExists) {
      throw new BadGatewayException('Já existe uma universidade com este nome');
    }

    try {
      return await this.prisma.universidade.create({
        data: createUniversidadeDto,
      });
    } catch (error) {
      throw new InternalServerErrorException('Erro ao criar universidade: ' + error.message);
    }
  }

  async findAll() {
    return this.prisma.universidade.findMany();
  }

  async findOne(id: number) {
    const universidade = await this.prisma.universidade.findUnique({
      where: { id },
    });

    if (!universidade) {
      throw new NotFoundException(`Universidade com ID ${id} não encontrada`);
    }

    return universidade;
  }

  async update(id: number, updateUniversidadeDto: UpdateUniversidadeDto) {
    await this.findOne(id);

    try {
      return await this.prisma.universidade.update({
        where: { id },
        data: updateUniversidadeDto,
      });
    } catch (error) {
      throw new InternalServerErrorException('Erro ao atualizar universidade: ' + error.message);
    }
  }

  async remove(id: number) {
    try {
      await this.findOne(id);
      await this.prisma.universidade.delete({
        where: { id },
      });
      return { message: 'Universidade removida com sucesso' };
    } catch (error) {
      throw new InternalServerErrorException('Erro ao remover universidade: ' + error.message);
    }
  }

  async findByNome(nome: string) {
    try {
      return await this.prisma.universidade.findFirst({
        where: { nome },
      });
    } catch (error) {
      throw new InternalServerErrorException('Erro ao buscar universidade por nome: ' + error.message);
    }
  }
}