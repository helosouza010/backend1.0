// Contém as definições de dados (DTO - Data Transfer Object) para os dados que são 
//enviados e recebidos durante o processo de login ou autenticação.
import { IsString } from 'class-validator';

export class AuthDto {
  @IsString()
  email: string;  // Alterado de 'username' para 'email'

  @IsString()
  senha: string;  // Alterado de 'password' para 'senha' para refletir o novo campo
}
