// Contém as definições de dados (DTO - Data Transfer Object) para os dados que são 
//enviados e recebidos durante o processo de login ou autenticação.

import { IsString } from 'class-validator';

export class AuthDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}
//login