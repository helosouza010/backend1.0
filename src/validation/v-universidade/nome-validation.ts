import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, registerDecorator, ValidationOptions } from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UniversidadeService } from 'src/universidade/universidade.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class UniqueNomeValidator implements ValidatorConstraintInterface {
  constructor(private readonly universidadeService: UniversidadeService) {}

  async validate(nome: string, args: ValidationArguments) {
    const universidade = await this.universidadeService.findByNome(nome);
    return !universidade; // Retorna true se não existir uma universidade com o mesmo nome
  }

  defaultMessage(args: ValidationArguments) {
    return 'Já existe uma universidade com o nome "$value".';
  }
}

export function IsUniqueUniversidadeNome(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: UniqueNomeValidator,
    });
  };
}