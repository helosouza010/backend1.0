import { IsString, IsOptional, IsNotEmpty, Length } from 'class-validator';

export class CreateEnderecoDto {
  @IsString()
  @IsNotEmpty()
  logradouro: string;

  @IsString()
  @IsNotEmpty()
  numero: string;

  @IsString()
  @IsOptional()
  complemento?: string;

  @IsString()
  @IsNotEmpty()
  bairro: string;

  @IsString()
  @IsNotEmpty()
  cidade: string;

  @IsString()
  @Length(2, 2)
  estado: string;

  @IsString()
  @IsNotEmpty()
  cep: string;

  @IsString()
  @IsOptional()
  pais?: string;
}
