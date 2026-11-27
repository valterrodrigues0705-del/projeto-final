# Projeto Final — Rede Social de Fotos

Aplicação full stack de uma rede social de fotos. O projeto permite criar uma conta, entrar no sistema, visualizar o feed, publicar fotos e stories, curtir e comentar publicações e editar o perfil.

## Tecnologias

- Frontend: React, React Router e CSS
- Backend: Node.js e Express
- Persistência local: arquivo JSON e pasta de uploads

## Pré-requisitos

- Node.js 20.19 ou superior
- npm

## Como executar

Abra dois terminais na pasta do projeto.

### Backend

```bash
cd backend
npm ci
npm start
```

O servidor será iniciado em `http://localhost:3000`.

### Frontend

```bash
cd frontend
npm ci
npm run dev
```

Abra no navegador o endereço exibido pelo terminal, normalmente `http://localhost:5173`.

## Funcionalidades

- Cadastro e autenticação de usuários
- Feed de publicações e stories
- Criação, edição e exclusão de publicações
- Curtidas e comentários
- Criação e exclusão de stories
- Visualização e edição do perfil
- Upload de imagens

## Estrutura

```text
projeto-final/
├── backend/    # API e persistência local
└── frontend/   # Interface React
```

## Configuração para publicação

Por padrão, o frontend usa a API em `http://localhost:3000`. Em uma publicação online, defina `VITE_API_URL` com o endereço público do backend antes de gerar o frontend:

```bash
VITE_API_URL=https://sua-api.exemplo.com npm run build
```

O conteúdo final do frontend será gerado em `frontend/dist`.
