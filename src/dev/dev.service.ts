import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as fs from 'fs';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DevService {
  constructor(private readonly prisma: PrismaService) {}

  async importarDados() {
    // Lê o arquivo JSON com os dados para importar
    const dados = JSON.parse(fs.readFileSync('src/dev/dadosInsercao.json', 'utf-8'));

    // --- COLETAR PERMISSÕES DOS ALUNOS ---
    const todasPermissoes = new Set<string>();
    for (const aluno of dados.alunos) {
      for (const nomePermissao of aluno.permissoes || []) {
        todasPermissoes.add(nomePermissao);
      }
    }

    // Arrays para armazenar logs resumidos
    const logsPermissoesCriadas: string[] = [];
    const logsUniversidades: string[] = [];
    const logsCursos: string[] = [];
    const logsDisciplinas: string[] = [];
    const logsProfessores: string[] = [];
    const logsTurmas: string[] = [];
    const logsAlunos: string[] = [];

    // --- CRIAÇÃO DAS PERMISSÕES QUE NÃO EXISTEM ---
    for (const nomePermissao of todasPermissoes) {
      const existe = await this.prisma.permissao.findUnique({ where: { nome: nomePermissao } });
      if (!existe) {
        await this.prisma.permissao.create({ data: { nome: nomePermissao } });
        logsPermissoesCriadas.push(nomePermissao);
      }
    }

    // --- IMPORTA UNIVERSIDADES E ENDEREÇOS ---
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

      logsUniversidades.push(`Universidade criada: id=${uni.id}, nome=${uni.nome}`);
    }

    // --- IMPORTA CURSOS ---
    for (const curso of dados.cursos) {
      const c = await this.prisma.curso.create({ data: curso });
      logsCursos.push(`Curso criado: id=${c.id}, nome=${c.nome || '[sem nome]'}`);
    }

    // --- IMPORTA DISCIPLINAS ---
    for (const disciplina of dados.disciplinas) {
      const d = await this.prisma.disciplina.create({ data: disciplina });
      logsDisciplinas.push(`Disciplina criada: id=${d.id}, nome=${d.nome || '[sem nome]'}`);
    }

    // --- IMPORTA PROFESSORES, ENDEREÇOS E ASSOCIAÇÕES COM DISCIPLINAS ---
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

      logsProfessores.push(`Professor criado: id=${prof.id}, nome=${prof.nome}`);
    }

    // --- IMPORTA TURMAS ---
    for (const turma of dados.turmas) {
      const t = await this.prisma.turma.create({ data: turma });
      logsTurmas.push(`Turma criada: id=${t.id}, nome=${t.nome || '[sem nome]'}`);
    }

    // --- IMPORTA ALUNOS, CRIA HASH DAS SENHAS E ASSOCIA TURMAS E PERMISSÕES ---
    for (const aluno of dados.alunos) {
      if (!aluno.senha) {
        throw new Error(`Aluno ${aluno.nome} não possui senha para hash.`);
      }

      const senhaHash = await bcrypt.hash(aluno.senha, 10);

      const al = await this.prisma.aluno.create({
        data: {
          nome: aluno.nome,
          email: aluno.email,
          senhaHash,
          cursoId: aluno.cursoId,
        },
      });

      const partesAlunoLog: string[] = [];
      partesAlunoLog.push(`Aluno criado: id=${al.id}, nome=${al.nome}`);

      if (aluno.endereco) {
        await this.prisma.endereco.create({
          data: {
            ...aluno.endereco,
            alunoId: al.id,
          },
        });
        partesAlunoLog.push(`Endereço criado para aluno id=${al.id}`);
      }

      for (const turmaId of aluno.turmas || []) {
        await this.prisma.alunoTurma.create({
          data: { alunoId: al.id, turmaId },
        });
        partesAlunoLog.push(`Aluno id=${al.id} associado à turma id=${turmaId}`);
      }

      if (aluno.permissoes && aluno.permissoes.length > 0) {
        const permissoesAssociadas: string[] = [];
        for (const nomePermissao of aluno.permissoes) {
          const permissao = await this.prisma.permissao.findUnique({ where: { nome: nomePermissao } });
          if (permissao) {
            await this.prisma.alunoPermissao.create({
              data: { alunoId: al.id, permissaoId: permissao.id },
            });
            permissoesAssociadas.push(nomePermissao);
          }
        }
        if (permissoesAssociadas.length > 0) {
          partesAlunoLog.push(`Permissões associadas ao aluno id=${al.id}: ${permissoesAssociadas.join(', ')}`);
        }
      }

      logsAlunos.push(partesAlunoLog.join('  \n'));
    }

    // --- LOG FINAL COM TIMESTAMP E GRUPOS ---
    const timestamp = new Date().toISOString();

    let logFinal = `[${timestamp}]\n\n`;

    if (logsPermissoesCriadas.length > 0) {
      logFinal += `Permissões criadas: ${logsPermissoesCriadas.join(', ')}\n\n`;
    }
    if (logsUniversidades.length > 0) {
      logFinal += `Universidades:\n${logsUniversidades.join('\n')}\n\n`;
    }
    if (logsCursos.length > 0) {
      logFinal += `Cursos:\n${logsCursos.join('\n')}\n\n`;
    }
    if (logsDisciplinas.length > 0) {
      logFinal += `Disciplinas:\n${logsDisciplinas.join('\n')}\n\n`;
    }
    if (logsProfessores.length > 0) {
      logFinal += `Professores:\n${logsProfessores.join('\n')}\n\n`;
    }
    if (logsTurmas.length > 0) {
      logFinal += `Turmas:\n${logsTurmas.join('\n')}\n\n`;
    }
    logFinal += `Alunos:\n${logsAlunos.join('\n\n')}\n`;

    console.log(logFinal);

    return { message: 'Dados importados com sucesso!' };
  }
}
