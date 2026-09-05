# lojinha DESAPEGOS

Loja de roupas semi novas com vitrine, carrinho e checkout via WhatsApp. Painel admin para produtos, pedidos e configurações da loja.

## Estrutura do projeto

```
loja sara/
├── frontend/          # React + TypeScript + Vite
├── backend/           # Rails API + PostgreSQL
└── docker-compose.yml # Orquestra db, api e web
```

## Rodar com Docker (recomendado)

Copie o arquivo de ambiente e ajuste se precisar:

```bash
cp .env.example .env
```

Na raiz do repositório:

```bash
docker compose up -d --build
```

Serviços:

| Serviço | URL |
|---------|-----|
| Loja (nginx + front) | http://localhost:8080 |
| API Rails | http://localhost:3000 |

O front em produção usa proxy `/api` → Rails. A API já vem com seed de produtos, pedidos e configurações.

Para parar:

```bash
docker compose down
```

## Desenvolvimento local

### Frontend

```bash
cd frontend
npm install
npm run dev
```

O Vite sobe em http://localhost:5173 e faz proxy de `/api` para `http://localhost:3000`.

Scripts úteis:

```bash
npm run build    # build de produção
npm run lint     # oxlint
npm run preview  # preview do build
```

### Backend

Requisitos: Ruby 3.x, PostgreSQL.

```bash
cd backend
bundle install
bin/rails db:create db:migrate db:seed
bin/rails server
```

A API fica em http://localhost:3000.

Para variáveis locais, copie `backend/.env.example` para `backend/.env` e exporte antes de rodar o Rails (ou use um gerenciador de env).

## Admin

Acesse http://localhost:8080/admin (ou http://localhost:5173/admin no dev).

Credenciais do seed:

- **E-mail:** `sara@admin`
- **Senha:** `sa1107ra`

## Deploy do frontend

O `frontend/vercel.json` configura rewrite SPA para rotas como `/admin`. Na Vercel, defina o **Root Directory** como `frontend`.

## Stack

- **Front:** React 19, React Router, Vite, TypeScript
- **Back:** Rails API, JWT, PostgreSQL
- **Infra:** Docker Compose, nginx (front), Puma (API)
