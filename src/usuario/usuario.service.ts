import { Injectable ,BadRequestException} from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import {PrismaService} from 'src/prisma/prisma.service';
@Injectable()
export class UsuarioService {
  constructor(private prisma: PrismaService) {}
 
  async create(createUsuarioDto: CreateUsuarioDto) {

    return await this.prisma.usuario.create({ 
      data: createUsuarioDto 
    });
  }

  async findAll() {
    return this.prisma.usuario.findMany();
  }

  async findOne(id: number) {
    return this.prisma.usuario.findUnique ({
      where: {id},
  });
}

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    return this.prisma.usuario.update({
      where: {id},
      data: updateUsuarioDto,
    });
  }

  async remove(id: number) {
    return this.prisma.usuario.delete({
      where: {id},
  });
}



}