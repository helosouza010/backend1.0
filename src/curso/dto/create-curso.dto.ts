import { IsNotEmpty, IsInt, Length } from 'class-validator';

export class CreateCursoDto {
  @IsNotEmpty()
  @Length(3, 255)
  nome: string;

  @IsNotEmpty()
  @IsInt()
  universidadeId: number;
}
