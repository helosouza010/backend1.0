//Um "guard" que protege as rotas que precisam de autenticação. 
//Ele verifica se o token JWT fornecido é válido antes de permitir o acesso àquela rota.



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
    console.log('Erro:', err);  // Exibe o erro (se houver) no console
    console.log('Usuário:', user);  // Exibe o usuário que foi autenticado
    console.log('Info:', info);  // Exibe informações adicionais sobre a autenticação

    if (err || !user) {  // Se houver erro ou se o usuário não for válido
      throw new UnauthorizedException();  // Lança uma exceção de "não autorizado" (401)
    }
    return user;  // Se tudo estiver ok, retorna o usuário autenticado para que a requisição prossiga
  }
}
