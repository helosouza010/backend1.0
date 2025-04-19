
import { IsInt } from 'class-validator';

export class CreateProfessorDisciplinaDto {
  @IsInt()
  professorId: number;

  @IsInt()
  disciplinaId: number;
}