// Define a estrutura de dados (interface) que será usada para armazenar 
// as informações dentro do token JWT, como o ID do aluno e o email.

export interface JwtPayload {
  email: string;  // O email do aluno, utilizado para autenticação
  sub: number;    // ID do aluno (campo 'id' no banco de dados)
}
