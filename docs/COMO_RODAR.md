# Passo a passo: rodar o E-Cycle no seu computador

E.E. Prof. José Domingos da Silveira · 3º A DS · Projeto Multidisciplinar · Prof. Cristiano Silveira

Ao final deste roteiro você vai ter o E-Cycle funcionando no seu computador: o **banco** no Supabase (na nuvem), a **API** rodando no seu computador e o **site** aberto no navegador. Siga as etapas **na ordem**, sem pular nenhuma. Tempo total: cerca de 40 minutos.

Repositório do projeto: **https://github.com/Cris-noscore/e-cycle**

Como as três partes conversam:

```
Navegador (frontend)  →  API no seu PC (localhost:3000)  →  Supabase (banco na nuvem)
```

O navegador **nunca** fala direto com o Supabase. Quem acessa o banco é a API, usando a senha que fica guardada no arquivo `.env`.

## Etapa 1 — Contas e programas

Você precisa de duas contas gratuitas:

- **GitHub** — https://github.com (se ainda não tiver, crie com o seu e-mail)
- **Supabase** — https://supabase.com (dá para entrar com a conta do GitHub)

E de três programas instalados:

| Programa | Onde baixar | Como testar (no terminal) |
| --- | --- | --- |
| Git | https://git-scm.com/downloads | `git --version` |
| Node.js (versão **LTS**) | https://nodejs.org | `node -v` e `npm -v` |
| VSCode | https://code.visualstudio.com | abrir o programa |

No VSCode, instale duas extensões (ícone de quadradinhos na barra lateral, ou **Ctrl+Shift+X**):

- **REST Client** (autor: Huachao Mao) — para testar a API
- **Live Server** (autor: Ritwick Dey) — para abrir o site

> Para abrir o terminal dentro do VSCode: menu **Terminal → New Terminal** (ou **Ctrl+'**). Se você instalou algum programa com o VSCode aberto, **feche e abra o VSCode de novo** para o terminal reconhecer.

## Etapa 2 — Clonar o repositório

"Clonar" é baixar o projeto do GitHub para o seu computador, já ligado ao Git.

1. Abra o VSCode e o terminal (**Terminal → New Terminal**).
2. Vá para a pasta Documentos:

```
cd Documents
```

3. Clone o projeto:

```
git clone https://github.com/Cris-noscore/e-cycle.git
```

4. Abra a pasta do projeto no VSCode:

```
cd e-cycle
code .
```

Uma nova janela do VSCode abre com as pastas `backend`, `banco`, `docs` e `frontend`. **Daqui em diante, use essa janela.**

> Não conseguiu usar o `git clone`? Plano B: no site do repositório, clique no botão verde **Code → Download ZIP**, extraia o ZIP e abra a pasta no VSCode (**File → Open Folder**).

## Etapa 3 — Criar o banco no Supabase

1. Entre em https://supabase.com/dashboard e clique em **New project**.
2. Preencha:
    - **Name:** `ecycle`
    - **Database Password:** crie uma senha **só com letras e números** (sem `@`, `#`, `/`, `?`, `%`) e **anote** — você vai precisar dela na Etapa 5.
    - **Region:** South America (São Paulo)
3. Clique em **Create new project** e espere alguns minutos até o projeto ficar pronto.

> Esqueceu a senha? Em **Project Settings → Database → Reset database password** você cria outra.

## Etapa 4 — Criar as tabelas e os dados de teste

Os scripts SQL estão na pasta `banco/` do projeto.

1. No Supabase, menu lateral, clique em **SQL Editor** e depois em **New query**.
2. No VSCode, abra `banco/01_create_tables.sql`, selecione tudo (**Ctrl+A**), copie (**Ctrl+C**) e cole no SQL Editor.
3. Clique em **Run**. Deve aparecer **Success. No rows returned**.
4. Abra uma **New query** de novo e faça o mesmo com `banco/02_inserts_teste.sql`.
5. Confira: no menu **Table Editor** devem aparecer as tabelas `usuarios`, `empresas`, `tipos_residuo`, `pontos_coleta`, `entregas` e `pontuacao`, já com dados.

> Atenção: o script `01` **apaga e recria** as tabelas. Rode ele de novo só se quiser zerar o banco (e depois rode o `02` outra vez).

## Etapa 5 — Pegar o endereço de conexão do banco

A API precisa de um endereço (a "string de conexão") para entrar no seu banco.

1. No topo do painel do Supabase, clique em **Connect**.
2. Escolha **Session pooler** e copie a **URI**. Ela tem este formato:

```
postgresql://postgres.abcdefghij:[YOUR-PASSWORD]@aws-0-sa-east-1.pooler.supabase.com:5432/postgres
```

3. Troque `[YOUR-PASSWORD]` pela senha que você criou na Etapa 3 — **incluindo os colchetes**. Exemplo, se a senha for `Ecycle2026abc`:

```
postgresql://postgres.abcdefghij:Ecycle2026abc@aws-0-sa-east-1.pooler.supabase.com:5432/postgres
```

> Use **Session pooler**, não "Direct connection". A conexão direta costuma não funcionar em redes de escola e de casa.

## Etapa 6 — Configurar a API (arquivo .env)

O arquivo `.env` guarda os segredos da API: a senha do banco e o segredo do login. Ele **nunca** vai para o GitHub.

1. No terminal do VSCode, entre na pasta do backend:

```
cd backend
```

2. Crie o `.env` a partir do modelo:

```
copy .env.example .env
```

(no Mac ou Linux: `cp .env.example .env`)

3. Abra o arquivo `backend/.env` no VSCode e preencha duas linhas:

```
DATABASE_URL=postgresql://postgres.abcdefghij:Ecycle2026abc@aws-0-sa-east-1.pooler.supabase.com:5432/postgres
JWT_SECRET=invente-uma-frase-grande-aqui-sem-espacos
```

4. Salve (**Ctrl+S**). O arquivo tem que se chamar exatamente `.env` e ficar **dentro da pasta `backend`**.

## Etapa 7 — Ligar a API

Ainda no terminal, dentro da pasta `backend`:

1. Instale as dependências (só na primeira vez; demora um pouco):

```
npm install
```

2. Ligue a API:

```
npm start
```

3. Deve aparecer: **E-Cycle API rodando em http://localhost:3000**
4. Abra http://localhost:3000 no navegador. Deve aparecer:

```
{"app":"E-Cycle API","status":"ok","versao":"2.0.0"}
```

> **Deixe esse terminal aberto** enquanto usa o sistema. Fechou o terminal, a API desliga. Para desligar de propósito: **Ctrl+C**. Precisa digitar outro comando? Abra um **segundo terminal** (botão **+** no painel do terminal).

## Etapa 8 — Testar a API (REST Client)

Aqui você confirma que a API está **consumindo o Supabase** de verdade.

1. No VSCode, abra `backend/testes-http/auth.http`.
2. Em cima de cada requisição aparece o link **Send Request**. Clique no do login.
3. Do lado direito aparece a resposta: **HTTP/1.1 200 OK** e um `token`. Isso significa que a API foi ao Supabase, achou o usuário e conferiu a senha.
4. Abra os outros arquivos da pasta `testes-http/` e clique em **Send Request** de cima para baixo. Cada arquivo faz o login primeiro e reaproveita o token.

> Se a resposta for **401 — Token não informado**, está tudo certo: rotas protegidas só funcionam depois do login. Rode a requisição de login do mesmo arquivo primeiro.

## Etapa 9 — Abrir o site (frontend)

1. Com a API ligada (Etapa 7), clique com o botão direito em `frontend/index.html` e escolha **Open with Live Server**.
2. O navegador abre a tela de login (endereço parecido com `http://127.0.0.1:5500/frontend/index.html`).
3. Entre com um dos usuários de teste:

| Perfil | E-mail | Senha |
| --- | --- | --- |
| Admin global | diego@email.com | admin123 |
| Admin de ponto (Ponto Centro) | marcos@email.com | ponto123 |
| Admin de ponto (Shopping Sul) | julia@email.com | ponto123 |
| Cliente | ana@email.com | senha123 |

Teste o fluxo completo:

1. Entre como **ana@email.com** e **solicite um descarte** no Ponto Centro. Repare que ainda **não pontuou**.
2. Saia e entre como **marcos@email.com**. Na aba **Solicitações pendentes**, **confirme** o descarte da Ana.
3. Volte como **ana@email.com**: agora os **pontos** apareceram.
4. Entre como **diego@email.com** e veja os **relatórios**.

## Etapa 10 — Ver o Supabase sendo consumido

Tudo o que você fez no site foi parar no banco. Confira:

1. No Supabase, abra o **Table Editor → entregas**. A solicitação da Ana está lá: primeiro com status `solicitado`, depois `confirmado`.
2. Abra a tabela **pontuacao** e veja os pontos da Ana.
3. No **SQL Editor**, teste uma consulta sua:

```
SELECT u.nome, p.pontos, p.nivel
FROM pontuacao p
JOIN usuarios u ON u.id_usuario = p.id_usuario
ORDER BY p.pontos DESC;
```

O caminho de cada dado, dentro do código:

1. O `fetch` em `frontend/js/api.js` chama a API em `http://localhost:3000/api`.
2. A rota (`backend/src/routes/`) passa para o controller, que chama o service.
3. O service (`backend/src/services/`) roda o SQL com `db.query(...)`.
4. O `backend/src/config/db.js` usa a `DATABASE_URL` do `.env` para conectar no Supabase.

Exemplo de como o service consulta o banco:

```
const r = await db.query(
  'SELECT * FROM usuarios WHERE id_usuario = $1',
  [id]
);
```

O `$1` é trocado pelo valor de `id` com segurança. **Nunca** monte SQL juntando texto com `+`: isso abre brecha para SQL Injection.

## Problemas comuns

| Mensagem ou sintoma | O que fazer |
| --- | --- |
| `'git' não é reconhecido…` | Instale o Git (Etapa 1) e feche e abra o VSCode |
| `'npm' não é reconhecido…` | Instale o Node.js LTS e feche e abra o VSCode |
| `…execução de scripts foi desabilitada neste sistema` (PowerShell) | No terminal, clique na setinha ao lado do **+** e escolha **Command Prompt**. Rode o comando de novo lá |
| `[db] Atencao: DATABASE_URL nao definida` | O `.env` está no lugar errado ou com nome errado. Tem que ser `backend/.env` (não `.env.txt`, não na pasta de fora) |
| `password authentication failed` | Senha errada na `DATABASE_URL`, ou ficaram os colchetes `[ ]`. Refaça a Etapa 5 ou troque a senha no Supabase |
| `getaddrinfo ENOTFOUND` ou `timeout` | Confira a internet e se copiou a URI do **Session pooler**. Se a rede bloquear, teste em outra rede (ex.: roteador do celular) |
| `relation "usuarios" does not exist` | As tabelas não foram criadas: refaça a Etapa 4 |
| Login dos usuários de teste dá "E-mail ou senha invalidos" | O script `02_inserts_teste.sql` não foi rodado. Rode o `01` e o `02` de novo |
| `EADDRINUSE … :3000` | A API já está ligada em outro terminal. Feche o outro (**Ctrl+C**) ou use aquele |
| Site mostra `Failed to fetch` ou não faz login | A API não está ligada. Volte à Etapa 7 e deixe o terminal aberto |
| Supabase mostra "Project paused" | Projetos gratuitos pausam depois de dias sem uso. Clique em **Restore project** e espere |

## Antes de pedir ajuda

Mande para o professor:

1. Em qual **etapa** parou.
2. Um **print** da mensagem de erro (terminal ou navegador).
3. **Nunca** mande o arquivo `.env` nem a sua senha do banco — nem por WhatsApp, nem no GitHub.
