import { IsNotEmpty, IsInt, IsOptional } from 'class-validator';

export class CreateTurmaDto {
  @IsNotEmpty()
  nome: string;

  @IsInt()
  cursoId: number;

  @IsInt()
  professorId: number;

  @IsOptional()
  @IsInt()
  disciplinaId?: number;
}
