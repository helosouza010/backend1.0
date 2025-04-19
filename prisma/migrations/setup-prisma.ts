// prisma/migrations/setup-prisma.ts
import { execSync } from 'child_process';

function run(cmd: string) {
  console.log(`🔧 Executando: ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
}

try {
  // Limpa o terminal antes de tudo
  const clearCommand = process.platform === 'win32' ? 'cls' : 'clear';
  execSync(clearCommand, { stdio: 'inherit' });

  const isProd = process.env.NODE_ENV === 'production';

  if (isProd) {
    // Em produção, aplicamos as migrations com segurança
    run('npx prisma migrate deploy');
  } else {
    // Em desenvolvimento, sincronizamos direto com o schema
    run('npx prisma db push');
  }

  // Gera o Prisma Client
  run('npx prisma generate');

  console.log('✅ Banco de dados sincronizado com sucesso!');
} catch (err) {
  console.error('❌ Erro ao sincronizar o banco de dados:', err);
  process.exit(1);
}
