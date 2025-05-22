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
import { EmailService } from '../email/email.service'; //importacao de emails

@Injectable()
export class AlunoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService, // INJETANDO o serviço de email
  ) {}

  // Criar um novo aluno com endereço e vincular a uma turma (se fornecida)
  async create(createAlunoDto: CreateAlunoDto) {
    const { nome, email, senha, cursoId, endereco, turmaId } = createAlunoDto;

    // Verifica se já existe aluno com o mesmo email
    const emailExistente = await this.prisma.aluno.findUnique({
      where: { email },
    });
    if (emailExistente) {
      throw new BadRequestException('Já existe um aluno com este e-mail');
    }

    //Envia o msgEmail para email valido
    await this.emailService.enviarEmail(
      email,
      'Bem-vindo!',
      'Olá, seja bem-vindo à nossa plataforma.',
      '<b>Olá, seja bem-vindo à nossa plataforma.</b>',
    );

    // Verifica se o curso existe
    const curso = await this.prisma.curso.findUnique({
      where: { id: cursoId },
    });
    if (!curso) {
      throw new NotFoundException('Curso não encontrado');
    }

    // Faz o hash da senha antes de salvar no banco
    const senhaHash = await bcrypt.hash(senha, 10);

    try {
      // Cria o aluno com senha criptografada e, se informado, cria o endereço
      const aluno = await this.prisma.aluno.create({
        data: {
          nome,
          email,
          senhaHash,
          cursoId,
          endereco: endereco ? { create: endereco } : undefined,
        },
        include: {
          endereco: true,
        },
      });

      // Se foi passada turmaId, vincula o aluno à turma
      if (turmaId) {
        await this.vincularTurma(aluno.id, turmaId);
      }

      return aluno;
    } catch (error) {
      throw new InternalServerErrorException('Erro ao criar aluno: ' + error.message);
    }
  }

  // Atualiza senhas que estão armazenadas em texto puro para hash bcrypt
  async atualizarSenhasTextoPuro() {
    // Busca todos os alunos no banco
    const alunos = await this.prisma.aluno.findMany();

    for (const aluno of alunos) {
      // Verifica se a senha parece estar em texto puro
      // Exemplo: hashes bcrypt normalmente começam com '$2b$' ou '$2a$'
      if (!aluno.senhaHash.startsWith('$2')) {
        // Faz o hash da senha antiga que está em texto puro
        const novaSenhaHash = await bcrypt.hash(aluno.senhaHash, 10);

        // Atualiza o aluno com a nova senha criptografada
        await this.prisma.aluno.update({
          where: { id: aluno.id },
          data: { senhaHash: novaSenhaHash },
        });

        console.log(`Senha do aluno ${aluno.email} atualizada para hash.`);
      }
    }

    return { message: 'Atualização de senhas concluída' };
  }

  // Listar todos os alunos com detalhes
  async findAll() {
    return this.prisma.aluno.findMany({
      include: {
        curso: {
          include: {
            universidade: true,
          },
        },
        endereco: true,
        turmas: {
          include: {
            turma: true,
          },
        },
      },
    });
  }

  // Buscar um aluno pelo ID, incluindo detalhes de curso, universidade, endereço e turmas
  async findOne(id: number) {
    const aluno = await this.prisma.aluno.findUnique({
      where: { id },
      include: {
        curso: {
          include: {
            universidade: true,
          },
        },
        endereco: true,
        turmas: {
          include: {
            turma: true,
          },
        },
        permissoes: {
          include: {
            permissao: true,
          },
        },
      },
    });

    if (!aluno) {
      throw new NotFoundException(`Aluno com ID ${id} não encontrado`);
    }

    return aluno;
  }

  // Buscar as turmas de um aluno
  async findAllTurmas() {
    return this.prisma.aluno.findMany({
      include: {
        turmas: {
          include: {
            turma: true,
          },
        },
      },
    });
  }

  // Atualizar um aluno
  async update(id: number, updateAlunoDto: UpdateAlunoDto) {
    await this.findOne(id);

    const { senha, endereco, ...rest } = updateAlunoDto;

    let senhaHash;
    if (senha) {
      // Se a senha for atualizada, faz o hash
      senhaHash = await bcrypt.hash(senha, 10);
    }

    try {
      return await this.prisma.aluno.update({
        where: { id },
        data: {
          ...rest,
          senhaHash: senhaHash ? senhaHash : undefined,
          endereco: endereco ? { update: endereco } : undefined,
        },
        include: {
          endereco: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Erro ao atualizar aluno: ' + error.message);
    }
  }

  // Remover um aluno
  async remove(id: number) {
    await this.findOne(id);

    try {
      await this.prisma.aluno.delete({
        where: { id },
      });
      return { message: 'Aluno removido com sucesso' };
    } catch (error) {
      throw new InternalServerErrorException('Erro ao remover aluno: ' + error.message);
    }
  }

  // Vincular um aluno a uma turma
  async vincularTurma(alunoId: number, turmaId: number) {
    const aluno = await this.prisma.aluno.findUnique({ where: { id: alunoId } });
    if (!aluno) {
      throw new NotFoundException('Aluno não encontrado');
    }

    const turma = await this.prisma.turma.findUnique({ where: { id: turmaId } });
    if (!turma) {
      throw new NotFoundException('Turma não encontrada');
    }

    const vinculoExistente = await this.prisma.alunoTurma.findUnique({
      where: {
        alunoId_turmaId: {
          alunoId,
          turmaId,
        },
      },
    });

    if (vinculoExistente) {
      throw new BadRequestException('Aluno já está vinculado a esta turma');
    }

    try {
      await this.prisma.alunoTurma.create({
        data: {
          alunoId,
          turmaId,
        },
      });
      return { message: 'Aluno vinculado à turma com sucesso' };
    } catch (error) {
      throw new InternalServerErrorException('Erro ao vincular aluno à turma: ' + error.message);
    }
  }

  // Desvincular um aluno de uma turma
  async desvincularTurma(alunoId: number, turmaId: number) {
    const vinculoExistente = await this.prisma.alunoTurma.findUnique({
      where: {
        alunoId_turmaId: {
          alunoId,
          turmaId,
        },
      },
    });

    if (!vinculoExistente) {
      throw new NotFoundException('Vínculo entre aluno e turma não encontrado');
    }

    try {
      await this.prisma.alunoTurma.delete({
        where: {
          alunoId_turmaId: {
            alunoId,
            turmaId,
          },
        },
      });
      return { message: 'Aluno desvinculado da turma com sucesso' };
    } catch (error) {
      throw new InternalServerErrorException('Erro ao desvincular aluno da turma: ' + error.message);
    }
  }
}
