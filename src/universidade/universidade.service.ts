import { Injectable } from '@nestjs/common';
import { CreateUniversidadeDto } from './dto/create-universidade.dto';
import { UpdateUniversidadeDto } from './dto/update-universidade.dto';

@Injectable()
export class UniversidadeService {
  create(createUniversidadeDto: CreateUniversidadeDto) {
    return 'This action adds a new universidade';
  }

  findAll() {
    return `This action returns all universidade`;
  }

  findOne(id: number) {
    return `This action returns a #${id} universidade`;
  }

  update(id: number, updateUniversidadeDto: UpdateUniversidadeDto) {
    return `This action updates a #${id} universidade`;
  }

  remove(id: number) {
    return `This action removes a #${id} universidade`;
  }
}
