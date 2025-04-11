import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEnderecoDto } from './dto/create-endereco.dto';
import { UpdateEnderecoDto } from './dto/update-endereco.dto';

@Injectable()
export class EnderecoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createEnderecoDto: CreateEnderecoDto) {
    return await this.prisma.endereco.create({
      data: createEnderecoDto,
    });
  }

  async findAll() {
    return this.prisma.endereco.findMany();
  }

  async findOne(id: number) {
    return this.prisma.endereco.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateEnderecoDto: UpdateEnderecoDto) {
    return this.prisma.endereco.update({
      where: { id },
      data: updateEnderecoDto,
    });
  }

  async remove(id: number) {
    return this.prisma.endereco.delete({
      where: { id },
    });
  }
}
