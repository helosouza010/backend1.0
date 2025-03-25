import { IsNotEmpty,Length } from "class-validator"; 
export class CreateCursoDto {
    @IsNotEmpty()
    @Length (3, 255)
    name: string;

    @IsNotEmpty()
    @Length (3, 255)
    cargahoarioa: number;
    univerdidadeId:any;
}
