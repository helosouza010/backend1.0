import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class CepService {
  private readonly apiUrl = 'https://brasilapi.com.br/api/cep/v1';

  async buscarCep(cep: string) {
    try {
      const response = await axios.get(`${this.apiUrl}/${cep}`);
      return response.data;
    } catch (error) {
      const status = error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      const message = error.response?.data?.message || 'Erro ao buscar o CEP na BrasilAPI';

      throw new HttpException(message, status);
    }
  }
}
