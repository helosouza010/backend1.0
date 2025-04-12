import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEnderecoDto } from './dto/create-endereco.dto';
import { UpdateEnderecoDto } from './dto/update-endereco.dto';
import { TipoEndereco } from '@prisma/client';

@Injectable()
export class EnderecoService {
  constructor(private readonly prisma: PrismaService) {}

  // Criar um novo endereço
  async create(createEnderecoDto: CreateEnderecoDto) {
    try {
      return await this.prisma.endereco.create({
        data: createEnderecoDto,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao criar endereço: ' + error.message,
      );
    }
  }

  // Atualizar um endereço
  async update(id: number, updateEnderecoDto: UpdateEnderecoDto) {
    const enderecoExistente = await this.prisma.endereco.findUnique({
      where: { id },
    });

    if (!enderecoExistente) {
      throw new NotFoundException(`Endereço com ID ${id} não encontrado`);
    }

    try {
      return await this.prisma.endereco.update({
        where: { id },
        data: updateEnderecoDto,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao atualizar endereço: ' + error.message,
      );
    }
  }

  // Buscar um endereço pelo ID
  async findOne(id: number) {
    const endereco = await this.prisma.endereco.findUnique({
      where: { id },
      include: {
        aluno: true,
        universidade: true,
      },
    });

    if (!endereco) {
      throw new NotFoundException(`Endereço com ID ${id} não encontrado`);
    }

    return endereco;
  }

  // Listar todos os endereços
  async findAll() {
    try {
      return await this.prisma.endereco.findMany({
        include: {
          aluno: true,
          universidade: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao buscar endereços: ' + error.message,
      );
    }
  }

  // Listar todos os endereços comerciais
  async findAllComerciais() {
    try {
      return await this.prisma.endereco.findMany({
        where: { tipo: TipoEndereco.COMERCIAL },
        include: {
          aluno: true,
          universidade: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao buscar endereços comerciais: ' + error.message,
      );
    }
  }

  // Listar todos os endereços residenciais
  async findAllResidenciais() {
    try {
      return await this.prisma.endereco.findMany({
        where: { tipo: TipoEndereco.RESIDENCIAL },
        include: {
          aluno: true,
          universidade: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao buscar endereços residenciais: ' + error.message,
      );
    }
  }

  // Remover um endereço
  async remove(id: number) {
    await this.findOne(id);

    try {
      await this.prisma.endereco.delete({
        where: { id },
      });
      return { message: 'Endereço removido com sucesso' };
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao remover endereço: ' + error.message,
      );
    }
  }
}
