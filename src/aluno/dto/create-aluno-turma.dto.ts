import { IsInt } from 'class-validator';

export class CreateAlunoTurmaDto {
  @IsInt()
  alunoId: number;

  @IsInt()
  turmaId: number;
}