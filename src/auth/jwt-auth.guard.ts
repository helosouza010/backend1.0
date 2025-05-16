import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable() // Marca essa classe como um provider injetável no NestJS
export class JwtAuthGuard extends AuthGuard('jwt') { // Extende o AuthGuard usando a estratégia JWT

  // Método que decide se a requisição pode prosseguir ou não (autenticação)
  canActivate(context: ExecutionContext) {
    // Usa a implementação padrão do AuthGuard para validação do JWT
    return super.canActivate(context);
  }

  // Método que manipula o resultado da validação (usuário, erros, informações adicionais)
  handleRequest(err, user, info) {
    // Cria um timestamp atual para identificar quando a requisição foi processada
    const timestamp = new Date().toISOString();

    // Define o status da autenticação: "Erro encontrado" se houve erro ou usuário inválido, "Sem erros" caso contrário
    const status = err || !user ? 'Erro encontrado' : 'Sem erros';

    // Exibe o timestamp para organização dos logs
    console.log(`[${timestamp}]`);
    // Exibe o status da autenticação
    console.log(`Status: ${status}`);

    // Exibe o usuário autenticado (com as permissões embutidas no objeto)
    console.log('Usuário autenticado:');
    if (user) {
      // Converte o objeto user para JSON formatado (indentado) para facilitar a leitura no console
      console.log(JSON.stringify(user, null, 2));
    } else {
      // Caso não exista usuário, exibe essa mensagem
      console.log('Nenhum usuário encontrado');
    }

    // Exibe informações adicionais do processo de autenticação, caso existam
    console.log(`Info: ${info ? info.message || JSON.stringify(info) : 'Nenhuma informação adicional'}`);
    console.log(); // Linha em branco para separar visualmente os logs

    // Se houve erro ou usuário inválido, lança exceção de acesso não autorizado (401)
    if (err || !user) {
      throw new UnauthorizedException('Acesso não autorizado. Verifique o token.');
    }

    // Retorna o usuário autenticado para que o NestJS prossiga com a requisição
    return user;
  }
}

//CODIGO COMPLETO SEM LOGS

//import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
//import { AuthGuard } from '@nestjs/passport';
//
//@Injectable()
//export class JwtAuthGuard extends AuthGuard('jwt') {
//
//  // Método que decide se a requisição pode prosseguir (validação JWT)
//  canActivate(context: ExecutionContext) {
//    return super.canActivate(context);
//  }
//
//  // Método que manipula o resultado da validação do token JWT
//  handleRequest(err, user, info) {
//    // Se ocorreu erro ou usuário inválido, lança exceção de não autorizado
//    if (err || !user) {
//      throw new UnauthorizedException('Acesso não autorizado. Verifique o token.');
//    }
//
//    // Retorna o usuário autenticado para a requisição continuar
//    return user;
//  }
//}
