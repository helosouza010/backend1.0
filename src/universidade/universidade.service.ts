import { Injectable, NotFoundException, InternalServerErrorException, BadGatewayException } from '@nestjs/common';
import { CreateUniversidadeDto } from './dto/create-universidade.dto';
import { UpdateUniversidadeDto } from './dto/update-universidade.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UniversidadeService {
  constructor(private readonly prisma: PrismaService) {}

  // Criar uma nova universidade com endereço
  async create(createUniversidadeDto: CreateUniversidadeDto) {
    const universidadeExists = await this.findByNome(createUniversidadeDto.nome);

    if (universidadeExists) {
      throw new BadGatewayException('Já existe uma universidade com este nome');
    }

    try {
      const universidade = await this.prisma.universidade.create({
        data: {
          nome: createUniversidadeDto.nome,
          cnpj: createUniversidadeDto.cnpj,
          enderecos: createUniversidadeDto.enderecos
            ? {
                create: createUniversidadeDto.enderecos, // Cria o endereço relacionado à universidade
              }
            : undefined,
        },
      });

      return universidade;
    } catch (error) {
      throw new InternalServerErrorException('Erro ao criar universidade: ' + error.message);
    }
  }

  // Listar todas as universidades
  async findAll() {
    return this.prisma.universidade.findMany();
  }

  // Buscar uma universidade pelo ID, incluindo os endereços
  async findOne(id: number) {
    const universidade = await this.prisma.universidade.findUnique({
      where: { id },
      include: { enderecos: true }, // Inclui os endereços da universidade
    });

    if (!universidade) {
      throw new NotFoundException(`Universidade com ID ${id} não encontrada`);
    }

    return universidade;
  }

  // Atualizar uma universidade, incluindo o endereço
  async update(id: number, updateUniversidadeDto: UpdateUniversidadeDto) {
    await this.findOne(id); // Verifica se a universidade existe antes de tentar atualizá-la

    try {
      return await this.prisma.universidade.update({
        where: { id },
        data: {
          nome: updateUniversidadeDto.nome,
          cnpj: updateUniversidadeDto.cnpj,
          enderecos: updateUniversidadeDto.enderecos
            ? {
                create: updateUniversidadeDto.enderecos, // Cria um novo endereço relacionado
              }
            : undefined,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Erro ao atualizar universidade: ' + error.message);
    }
  }

  // Remover uma universidade
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

  // Buscar universidade por nome
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
