import { SetMetadata } from '@nestjs/common';

// Define um metadata personalizado chamado 'permissoes'
export const Permissoes = (...permissoes: string[]) => SetMetadata('permissoes', permissoes);
