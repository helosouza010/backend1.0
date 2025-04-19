import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as fs from 'fs';

@Injectable()
export class DevService {
  constructor(private readonly prisma: PrismaService) {}

  async importarDados() {
    const dados = JSON.parse(fs.readFileSync('src/dev/dadosInsercao.json', 'utf-8'));

    for (const universidade of dados.universidades) {
      const uni = await this.prisma.universidade.create({
        data: {
          nome: universidade.nome,
          cnpj: universidade.cnpj,
        },
      });

      for (const endereco of universidade.enderecos || []) {
        await this.prisma.endereco.create({
          data: {
            ...endereco,
            universidadeId: uni.id,
          },
        });
      }
    }

    for (const curso of dados.cursos) {
      await this.prisma.curso.create({ data: curso });
    }

    for (const disciplina of dados.disciplinas) {
      await this.prisma.disciplina.create({ data: disciplina });
    }

    for (const professor of dados.professores) {
      const prof = await this.prisma.professor.create({
        data: {
          nome: professor.nome,
          email: professor.email,
        },
      });

      if (professor.endereco) {
        await this.prisma.endereco.create({
          data: {
            ...professor.endereco,
            professorId: prof.id,
          },
        });
      }

      for (const id of professor.disciplinas || []) {
        await this.prisma.professorDisciplina.create({
          data: {
            professorId: prof.id,
            disciplinaId: id,
          },
        });
      }
    }

    for (const turma of dados.turmas) {
      await this.prisma.turma.create({ data: turma });
    }

    for (const aluno of dados.alunos) {
      const al = await this.prisma.aluno.create({
        data: {
          nome: aluno.nome,
          email: aluno.email,
          senhaHash: aluno.senhaHash,
          cursoId: aluno.cursoId,
        },
      });

      if (aluno.endereco) {
        await this.prisma.endereco.create({
          data: {
            ...aluno.endereco,
            alunoId: al.id,
          },
        });
      }

      for (const turmaId of aluno.turmas || []) {
        await this.prisma.alunoTurma.create({
          data: {
            alunoId: al.id,
            turmaId,
          },
        });
      }
    }

    return { message: 'Dados importados com sucesso! '};
  }
}
