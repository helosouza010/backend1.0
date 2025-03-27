
import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class CreateAlunoDto {
  @IsNotEmpty()
  @Length(3, 255)
  nome: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(6, 255)
  senha: string;

  
}
