// TODO: Substituir toda esta lógica mockada por uma chamada de API real (ex: POST /api/auth/login)
// TODO: No backend, a senha deve ser armazenada com hash (Bcrypt/Argon2)
// TODO: O frontend deve armazenar um token JWT (preferencialmente em cookies httpOnly)

export const mockUsers = [
  {
    id: 'cli_001',
    email: 'cliente@tusocio.com',
    senha: '123456', // Mock password
    role: 'cliente',
    nome: 'María López',
  },
  {
    id: 'func_001',
    email: 'funcionario@tusocio.com',
    senha: '123456',
    role: 'funcionario',
    nome: 'Equipo Tu Socio',
  },
  {
    id: 'admin_001',
    email: 'admin@tusocio.com',
    senha: '123456',
    role: 'admin',
    nome: 'Administrador Tu Socio',
  }
];

export const fakeLogin = async (email, password) => {
  // Simula latência de rede
  await new Promise(resolve => setTimeout(resolve, 800));

  const user = mockUsers.find(u => u.email === email && u.senha === password);
  
  if (user) {
    const { senha, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  
  throw new Error('Credenciais inválidas');
};
