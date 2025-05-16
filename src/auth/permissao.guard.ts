import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  
  @Injectable()  // Torna o guard disponível para injeção e uso pelo NestJS
  export class PermissaoGuard implements CanActivate {
    constructor(private reflector: Reflector) {}  // Injeta o Reflector para acessar metadados definidos pelos decorators
  
    // Método que decide se a rota pode ser acessada
    canActivate(context: ExecutionContext): boolean {
        const permissoesRequeridas = this.reflector.getAllAndOverride<string[]>('permissoes', [
          context.getHandler(),
          context.getClass(),
        ]);
      
        if (!permissoesRequeridas || permissoesRequeridas.length === 0) {
          return true;
        }
      
        const request = context.switchToHttp().getRequest();
        const usuario = request.user;
      
        console.log('Permissões do usuário:', usuario?.permissoes);
        console.log('Permissões exigidas:', permissoesRequeridas);
      
        if (!usuario || !usuario.permissoes) {
          throw new ForbiddenException('Usuário sem permissões definidas.');
        }
      
        const temPermissao = usuario.permissoes.some((p: string) =>
          permissoesRequeridas.includes(p),
        );
      
        if (!temPermissao) {
          throw new ForbiddenException('Permissão insuficiente para acessar este recurso.');
        }
      
        return true;
      }
    }
        