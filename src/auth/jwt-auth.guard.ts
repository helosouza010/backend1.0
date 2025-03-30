// Um "guard" que protege as rotas que precisam de autenticação. 
// Ele verifica se o token JWT fornecido é válido antes de permitir o acesso àquela rota.

import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';  // Importa os decorators e classes necessárias do NestJS
import { AuthGuard } from '@nestjs/passport';  // Importa a classe AuthGuard para usar com a estratégia JWT

@Injectable()  // Torna o guard utilizável como um provedor no NestJS
export class JwtAuthGuard extends AuthGuard('jwt') {  // Extende o AuthGuard com a estratégia 'jwt'

  // Método canActivate decide se a rota pode ser acessada (se o guard permite o acesso)
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);  // A decisão de ativar o guard é delegada à estratégia JWT, garantindo que o token é verificado
  }

  // Método handleRequest manipula a resposta do guard e lida com erros de autenticação
  handleRequest(err, user, info) {
    const timestamp = new Date().toISOString(); // Obter o timestamp no formato ISO

    // Status do processo (erro ou sucesso)
    const status = err || !user ? 'Erro encontrado' : 'Sem erros';

    // Exibir o timestamp apenas uma vez
    console.log(`[${timestamp}]`);

    // Exibir os logs subsequentes
    console.log(`Status: ${status}`);
    console.log(`Usuário autenticado: ${user ? JSON.stringify(user) : 'Nenhum usuário encontrado'}`);
    console.log(`Info: ${info ? info.message || JSON.stringify(info) : 'Nenhuma informação adicional'}`);
    console.log(); // Linha em branco para separar os logs

    if (err || !user) {
      throw new UnauthorizedException('Acesso não autorizado. Verifique o token.');  // Lança uma exceção de "não autorizado" (401)
    }
    return user;  // Retorna o usuário autenticado para que a requisição prossiga
  }
}
