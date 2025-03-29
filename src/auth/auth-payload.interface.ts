// Define a estrutura de dados (interface) que será usada para armazenar 
//as informações dentro do token JWT, como o ID do usuário.


export interface JwtPayload {
  username: string;
  sub: number; // ID do usuário
}