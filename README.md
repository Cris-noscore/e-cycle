# E-Cycle ♺

Plataforma de reciclagem de eletrônicos — projeto de referência do **Projeto Multidisciplinar** (3º A DS, E.E. José Domingos da Silveira).

> **Primeira vez?** Siga o passo a passo completo (clonar, criar o banco no Supabase, rodar a API e o site) e a tabela de erros comuns: [docs/COMO_RODAR.md](docs/COMO_RODAR.md)

Três camadas:

- **Frontend** — HTML, CSS e JavaScript (sem framework), consome a API.
- **Backend** — Node.js + Express (MVC), com SQL puro (`pg`) e **autenticação por token (JWT)**.
- **Banco** — PostgreSQL hospedado no **Supabase**.

```
Frontend  ──fetch (+token)──▶  API Node/Express  ──SQL──▶  Supabase (Postgres)
```

## Perfis de acesso

Ninguém acessa nada sem fazer login. Há dois tipos de usuário:

- **Cliente (`comum`)** — cria a conta, faz login e **solicita** descartes escolhendo o ponto de coleta. Ganha pontos só depois que o descarte é confirmado.
- **Admin de ponto** — responsável por um ponto de coleta: vê as solicitações do **seu** ponto e **confirma** (ou recusa) o recebimento; ao confirmar, o cliente pontua.
- **Admin global** — vê todos os pontos, gerencia empresas/tipos/pontos/usuários e os relatórios.

Fluxo do descarte: **cliente solicita → admin do ponto confirma → cliente pontua**. As rotas são protegidas **no backend** por perfil.

---

## Pré-requisitos

- **Node.js 18+**
- Conta no **[Supabase](https://supabase.com)**
- **VSCode** com **REST Client** (`humao.rest-client`) e **Live Server** (`ritwickdey.liveserver`)

---

## Passo 1 — Banco no Supabase

No **SQL Editor** do Supabase, rode nesta ordem:

1. `banco/01_create_tables.sql`
2. `banco/02_inserts_teste.sql`

> **Atualizando de uma versão anterior?** Rode os dois de novo (o `01` recria as tabelas). As senhas de teste agora estão em **hash** — sem re-rodar, o login dos usuários semente não funciona.

Pegue a string de conexão em **Connect → Session pooler → URI** e troque `[YOUR-PASSWORD]` pela senha do banco.

---

## Passo 2 — Backend

```bash
cd backend
cp .env.example .env        # (Windows: copy .env.example .env)
```

No `.env`, preencha a `DATABASE_URL` (Supabase) e defina um `JWT_SECRET` qualquer. Depois:

```bash
npm install
npm start
```

API em **http://localhost:3000**. Teste: `curl http://localhost:3000/`.

---

## Passo 3 — Testar endpoints

Abra os arquivos em `backend/testes-http/` (extensão REST Client). Cada arquivo já faz o **login** primeiro e reaproveita o token nas demais requisições — é só clicar em "Send Request" de cima para baixo.

---

## Passo 4 — Frontend

Abra `frontend/index.html` com o **Live Server**. Você cai na **tela de login**.

**Logins de teste** (já vêm no banco):

| Perfil | E-mail | Senha |
|---|---|---|
| Admin global | diego@email.com | admin123 |
| Admin de ponto (Ponto Centro) | marcos@email.com | ponto123 |
| Admin de ponto (Shopping Sul) | julia@email.com | ponto123 |
| Cliente | ana@email.com | senha123 |

- Entrando como **cliente** → tela de descarte + seus pontos.
- Entrando como **admin** → painel de gestão + relatórios.
- Para criar um cliente do zero, use **Criar conta** na tela de login.

Fluxo sugerido: entre como **cliente** (ana) e solicite um descarte no Ponto Centro — repare que ainda **não pontua**. Saia e entre como **admin de ponto** (marcos), confirme a solicitação na aba "Solicitações pendentes"; a Ana ganha os pontos. Como **admin global** (diego), veja tudo e os relatórios.

---

## Estrutura do projeto

```
e-cycle/
├── banco/            Scripts SQL (Supabase / PostgreSQL)
├── backend/          API Node.js + Express (MVC)
│   ├── src/
│   │   ├── config/       conexao com o banco
│   │   ├── routes/       endpoints (com protecao por perfil)
│   │   ├── controllers/  recebem req/res
│   │   ├── services/     regra de negocio + SQL
│   │   └── middlewares/  validacao, erros e AUTENTICACAO (JWT)
│   └── testes-http/  arquivos .http (REST Client)
├── frontend/
│   ├── index.html    login / cadastro
│   ├── admin.html    painel do admin
│   ├── cliente.html  area do cliente
│   └── js/           api.js, auth.js, admin.js, cliente.js
└── docs/             DER, modelo logico, documentacao da API
```

---

## Segurança (pontos de ensino)

- **Senha com hash** (bcrypt) — nunca guardada nem devolvida em texto.
- **Token JWT** — emitido no login; exigido em todas as rotas (menos cadastro/login).
- **Autorização por perfil** — `apenasAdmin` protege gestão e relatórios.
- **Não confiar no cliente** — ao registrar um descarte, o `id_usuario` vem do **token**, não do formulário.

## Regra de gamificação

Pontos = peso (kg) × 10. Nível sobe a cada 100 pontos.
Ajustável em `backend/src/services/entregas.service.js`.
