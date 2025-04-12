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

  // Criar um novo aluno com endereço
  async create(createAlunoDto: CreateAlunoDto) {
    const { nome, email, senha, cursoId, endereco } = createAlunoDto;

    // Verifica se o e-mail já está cadastrado
    const emailExistente = await this.prisma.aluno.findUnique({
      where: { email },
    });
    if (emailExistente) {
      throw new BadRequestException('Já existe um aluno com este e-mail');
    }

    // Verifica se o curso com o ID informado existe
    const curso = await this.prisma.curso.findUnique({
      where: { id: cursoId },
    });
    if (!curso) {
      throw new NotFoundException('Curso não encontrado');
    }

    // Gera o hash da senha
    const senhaHash = await bcrypt.hash(senha, 10);

    try {
      // Cria o aluno no banco de dados, incluindo o endereço se fornecido
      return await this.prisma.aluno.create({
        data: {
          nome,
          email,
          senhaHash,
          cursoId,
          endereco: endereco
            ? {
                create: endereco, // Cria o endereço relacionado ao aluno
              }
            : undefined,
        },
        include: {
          endereco: true, // Inclui o endereço na resposta
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Erro ao criar aluno: ' + error.message);
    }
  }

  // Listar todos os alunos
  async findAll() {
    return this.prisma.aluno.findMany({
      include: {
        curso: {
          include: {
            universidade: true,
          },
        },
        endereco: true, // Inclui o endereço do aluno
      },
    });
  }

  // Buscar um aluno pelo ID
  async findOne(id: number) {
    const aluno = await this.prisma.aluno.findUnique({
      where: { id },
      include: {
        curso: {
          include: {
            universidade: true,
          },
        },
        endereco: true, // Inclui o endereço do aluno
      },
    });

    if (!aluno) {
      throw new NotFoundException(`Aluno com ID ${id} não encontrado`);
    }

    return aluno;
  }

  // Atualizar um aluno com endereço
  async update(id: number, updateAlunoDto: UpdateAlunoDto) {
    const aluno = await this.findOne(id); // Garante que o aluno existe

    const { senha, endereco, ...rest } = updateAlunoDto;

    let senhaHash;
    if (senha) {
      senhaHash = await bcrypt.hash(senha, 10); // Gera o novo hash de senha
    }

    try {
      return await this.prisma.aluno.update({
        where: { id },
        data: {
          ...rest,
          senhaHash: senhaHash ? senhaHash : undefined,
          endereco: endereco
            ? {
                update: endereco, // Atualiza o endereço se fornecido
              }
            : undefined,
        },
        include: {
          endereco: true, // Inclui o endereço atualizado na resposta
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Erro ao atualizar aluno: ' + error.message);
    }
  }

  // Remover um aluno
  async remove(id: number) {
    const aluno = await this.findOne(id); // Garante que o aluno existe

    try {
      await this.prisma.aluno.delete({
        where: { id },
      });
      return { message: 'Aluno removido com sucesso' };
    } catch (error) {
      throw new InternalServerErrorException('Erro ao remover aluno: ' + error.message);
    }
  }
}
