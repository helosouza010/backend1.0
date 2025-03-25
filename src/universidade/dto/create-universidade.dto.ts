import { IsNotEmpty, Length } from 'class-validator';

export class CreateUniversidadeDto {
    @IsNotEmpty()
    @Length(3, 255)
    name: string;

    @IsNotEmpty()
    @Length(3, 255)
    email: string;
    cnpj: string | undefined;
}
