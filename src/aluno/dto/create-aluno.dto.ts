import { IsNotEmpty, IsEmail, Length, IsInt, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateEnderecoDto } from 'src/endereco/dto/create-endereco.dto'; // Criação do DTO para o endereço

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

  @IsNotEmpty()
  @IsInt()
  cursoId: number;

  @IsOptional() // O campo é opcional
  @ValidateNested()
  @Type(() => CreateEnderecoDto) // Assegura que o endereço será validado com o DTO específico
  endereco?: CreateEnderecoDto;
  
  @IsOptional()
  @IsInt()
  turmaId?: number; // Relacionamento com o endereço
}
