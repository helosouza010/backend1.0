import {IsEmail,IsNotEmpty,Length} from 'class-validator';

export class CreateUsuarioDto {
  @IsNotEmpty()
  @Length(3, 100)
  nome: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(6, 100)
  senha: string;
}
