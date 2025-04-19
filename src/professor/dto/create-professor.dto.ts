import { IsNotEmpty, IsString, IsEmail, Length,IsOptional,ValidateNested,} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateEnderecoDto } from 'src/endereco/dto/create-endereco.dto';

export class CreateProfessorDto {
  @IsNotEmpty()
  @Length(3, 255)
  nome: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional() // O campo é opcional
  @ValidateNested()
  @Type(() => CreateEnderecoDto) // Assegura que o endereço será validado com o DTO específico
  endereco?: CreateEnderecoDto;
}
