import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  ValidateIf,
} from 'class-validator';
import { TipoEndereco } from '@prisma/client';

export class CreateEnderecoDto {
  @ValidateIf(o => !o.universidadeId && !o.alunoId)
  @IsNotEmpty({ message: 'alunoId ou universidadeId deve ser informado' })
  private validacaoRelacionamento!: any; // Apenas para forçar a validação

  @IsNotEmpty()
  @IsString()
  logradouro: string;

  @IsNotEmpty()
  @IsString()
  numero: string;

  @IsOptional()
  @IsString()
  complemento?: string;

  @IsNotEmpty()
  @IsString()
  bairro: string;

  @IsNotEmpty()
  @IsString()
  cidade: string;

  @IsNotEmpty()
  @IsString()
  estado: string;

  @IsNotEmpty()
  @IsString()
  cep: string;

  @IsOptional()
  @IsString()
  pais?: string;

  @IsNotEmpty()
  @IsEnum(TipoEndereco)
  tipo: TipoEndereco;

  @IsOptional()
  universidadeId?: number;

  @IsOptional()
  alunoId?: number;
}
