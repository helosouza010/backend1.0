import { IsNotEmpty, Length } from 'class-validator';
import { IsUniqueUniversidadeNome } from 'src/validation/v-universidade/nome-validation';

export class CreateUniversidadeDto {
  @IsNotEmpty()
  @Length(3, 255)
  @IsUniqueUniversidadeNome({ message: 'Nome da universidade deve ser único' })
  nome: string;

  @IsNotEmpty()
  @Length(6, 255)
  Cnpj: string;

}