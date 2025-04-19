import { IsNotEmpty, IsString, IsInt, Length } from 'class-validator';

export class CreateDisciplinaDto {
  @IsNotEmpty()
  @Length(3, 255)
  nome: string;

  @IsNotEmpty()
  @IsInt()
  cursoId: number; // Relacionamento com o curso
}
