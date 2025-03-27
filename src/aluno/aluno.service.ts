import { Injectable } from '@nestjs/common';
import { CreateAlunoDto } from './dto/create-aluno.dto';
import { UpdateAlunoDto } from './dto/update-aluno.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AlunoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAlunoDto: CreateAlunoDto) {
    return await this.prisma.aluno.create({
      data: createAlunoDto, // Corrigido: os dados devem estar dentro de um objeto `data`
    });
  }

  async findAll() {
    return this.prisma.aluno.findMany(); // Removido `await` desnecessário
  }

  async findOne(id: number) {
    return this.prisma.aluno.findUnique({
      where: { id }, // Busca pelo ID
    });
  }

  async update(id: number, updateAlunoDto: UpdateAlunoDto) {
    return this.prisma.aluno.update({
      where: { id }, // Encontra o aluno pelo ID
      data: updateAlunoDto, // Atualiza com os novos dados
    });
  }

  async remove(id: number) {
    return this.prisma.aluno.delete({
      where: { id }, // Remove pelo ID
    });
  }
}