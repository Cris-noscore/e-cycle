# E-Cycle — Documentação da API

Base: `http://localhost:3000/api`
Autenticação: **JWT**. Faça login, pegue o `token` e envie em cada requisição protegida no cabeçalho:
`Authorization: Bearer <token>`

## Autenticação — `/auth` (público)
| Método | Rota | Descrição |
|---|---|---|
| POST | `/auth/register` | Cadastra um cliente (`comum`) e já devolve o token |
| POST | `/auth/login` | Login; devolve `{ usuario, token }` |

```json
// register
{ "nome": "Ana", "email": "ana@email.com", "senha": "segredo123", "telefone": "..." }
// login
{ "email": "ana@email.com", "senha": "segredo123" }
```

## Perfil — `/perfil` (qualquer logado)
| Método | Rota | Descrição |
|---|---|---|
| GET | `/perfil` | Meus dados + minha pontuação |
| GET | `/perfil/entregas` | Meu histórico de descartes |

## Entregas / Descarte — `/entregas`
Fluxo: cliente **solicita** → admin do ponto **confirma** (aí pontua) ou **recusa**.

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| POST | `/entregas` | logado | Cliente solicita o próprio descarte (status `solicitado`, sem pontuar). id vem do token |
| GET | `/entregas/pendentes` | admin | Solicitações pendentes (admin de ponto vê só o seu ponto) |
| PUT | `/entregas/:id/confirmar` | admin | Confirma o descarte e **gera a pontuação** |
| PUT | `/entregas/:id/recusar` | admin | Recusa o descarte (sem pontos) |
| GET | `/entregas` | admin | Histórico (admin de ponto vê só o seu ponto) |

```json
// POST /entregas  (NAO enviar id_usuario)
{ "id_ponto": 1, "id_tipo": 5, "peso_residuo": 12 }
```

## Usuários — `/usuarios` (admin)
| Método | Rota | Descrição |
|---|---|---|
| GET | `/usuarios` | Lista |
| GET | `/usuarios/:id` | Busca |
| POST | `/usuarios` | Cria (admin pode definir o tipo) |
| PUT | `/usuarios/:id` | Atualiza |
| DELETE | `/usuarios/:id` | Remove |

## Empresas — `/empresas` (admin)
GET, GET/:id, POST, PUT/:id, DELETE/:id

## Tipos de resíduo — `/tipos`
| Método | Acesso |
|---|---|
| GET, GET/:id | logado (cliente precisa para o descarte) |
| POST, PUT, DELETE | admin |

## Pontos de coleta — `/pontos`
| Método | Acesso |
|---|---|
| GET, GET/:id | logado (cliente precisa para o descarte) |
| POST, PUT, DELETE | admin |

## Relatórios — `/relatorios` (admin)
| Método | Rota | Descrição |
|---|---|---|
| GET | `/relatorios/totais` | Quantidade de resíduos coletados |
| GET | `/relatorios/ranking` | Usuários que mais reciclam |
| GET | `/relatorios/pontos` | Pontos de coleta mais utilizados |
| GET | `/relatorios/tipos` | Tipos de resíduos mais descartados |

## Códigos de erro comuns
- `400` dados inválidos · `401` sem token / token inválido / senha errada
- `403` sem permissão (perfil errado) · `404` não encontrado · `409` duplicado
