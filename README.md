# 🏈 NFL Bolão - Sistema de Apostas da NFL

Um sistema completo de bolão para os jogos da NFL, desenvolvido com Next.js 16, TypeScript e Prisma.

## 📋 Sobre o Projeto

O NFL Bolão é uma aplicação web que permite aos usuários fazer palpites sobre os jogos da NFL, acompanhar o ranking em tempo real e competir com amigos. O sistema inclui uma área administrativa completa para gerenciamento de times, rodadas, jogos e apuração de resultados.

## ✨ Funcionalidades

### Para Jogadores

- 🔐 Sistema de autenticação seguro (registro, login, alteração de senha)
- 🎯 Fazer palpites nos jogos de cada rodada dos playoffs
- 📊 Visualizar ranking geral com pontuação de todos os participantes
- 📅 Acompanhar rodadas e jogos programados
- 👤 Perfil de usuário com estatísticas pessoais

### Para Administradores

- ⚙️ Gerenciamento completo de times (criação, edição, exclusão)
- 📆 Gerenciamento de rodadas (Wildcard, Divisional, Conference, Super Bowl)
- 🎮 Gerenciamento de jogos (criação, edição, definição de resultados)
- 🏆 Sistema de apuração automática de pontos
- 📈 Visualização de todos os palpites dos jogadores

## 🛠️ Tecnologias Utilizadas

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
- **Estilização**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Banco de Dados**: PostgreSQL
- **ORM**: [Prisma](https://www.prisma.io/)
- **Validação**: [Zod](https://zod.dev/)
- **Autenticação**: Sistema customizado com bcrypt
- **Linting**: ESLint

## 🚀 Como Executar o Projeto

### Pré-requisitos

- Node.js 20+ instalado
- PostgreSQL configurado
- Conta no Prisma Data Platform (para Accelerate) ou banco PostgreSQL local

### Instalação

1. Clone o repositório:

```bash
git clone https://github.com/lucian-ortolan/nfl-bolao.git
cd nfl-bolao
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente:
   Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
DATABASE_URL="sua-url-do-postgresql"
POSTGRES_URL="sua-url-do-postgresql"
PRISMA_DATABASE_URL="sua-url-do-prisma-accelerate"
INVITE_CODE="SEU-CODIGO-DE-CONVITE"
```

4. Execute as migrações do banco de dados:

```bash
npx prisma migrate dev
```

5. (Opcional) Popule o banco com dados iniciais:

```bash
npx prisma db seed
```

6. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

7. Acesse a aplicação em [http://localhost:3000](http://localhost:3000)

## 📁 Estrutura do Projeto

```
nfl-bolao/
├── app/                      # Páginas e rotas (App Router)
│   ├── admin/               # Área administrativa
│   │   ├── apuracao/       # Apuração de resultados
│   │   ├── jogos/          # Gerenciamento de jogos
│   │   ├── rodadas/        # Gerenciamento de rodadas
│   │   └── times/          # Gerenciamento de times
│   ├── api/                # API Routes
│   │   ├── admin/          # Endpoints administrativos
│   │   ├── auth/           # Autenticação
│   │   ├── games/          # Jogos
│   │   ├── picks/          # Palpites
│   │   └── ranking/        # Ranking
│   ├── login/              # Página de login
│   ├── ranking/            # Página de ranking
│   ├── register/           # Página de registro
│   ├── rodada/             # Página de rodada individual
│   ├── rodadas/            # Lista de rodadas
│   └── trocar-senha/       # Alteração de senha
├── prisma/                 # Configuração do Prisma
│   ├── schema.prisma       # Schema do banco de dados
│   └── migrations/         # Migrações
├── src/
│   ├── components/         # Componentes React
│   └── lib/               # Bibliotecas e utilitários
│       ├── auth.ts        # Lógica de autenticação
│       ├── prisma.ts      # Cliente Prisma
│       └── scoring.ts     # Sistema de pontuação
└── public/                # Arquivos estáticos

```

## 🗄️ Modelo de Dados

O sistema utiliza os seguintes modelos principais:

- **User**: Usuários do sistema (jogadores e administradores)
- **Session**: Sessões de autenticação
- **Round**: Rodadas dos playoffs (Wildcard, Divisional, etc.)
- **Team**: Times da NFL
- **Game**: Jogos entre times
- **Pick**: Palpites dos usuários nos jogos

## 🎮 Sistema de Pontuação

O sistema calcula pontos automaticamente baseado nos palpites e resultados reais dos jogos. A lógica de pontuação está implementada em `src/lib/scoring.ts`.

## 🔒 Segurança

- Senhas são criptografadas usando bcrypt
- Sistema de sessões com tokens únicos
- Middleware de autenticação para rotas protegidas
- Validação de dados com Zod
- Código de convite obrigatório para registro

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria a build de produção
- `npm start` - Inicia o servidor de produção
- `npm run lint` - Executa o linter
- `npx prisma studio` - Abre o Prisma Studio para visualizar o banco

## 🚀 Deploy

O projeto está configurado para deploy na Vercel:

1. Faça push do código para o GitHub
2. Importe o projeto na Vercel
3. Configure as variáveis de ambiente
4. Deploy automático!

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## 📄 Licença

Este projeto é privado e de uso interno.

## 👥 Autor

Desenvolvido por Lucian Ortolan

---

**Nota**: Este é um projeto de bolão privado. O código de convite é necessário para registro de novos usuários.
