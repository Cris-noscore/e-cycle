# E-Cycle — Modelo Lógico

Tabelas, chaves, tipos e restrições. Corresponde a `banco/01_create_tables.sql`.

## usuarios
| Campo | Tipo | Restrições |
|---|---|---|
| id_usuario | SERIAL | PK |
| nome | VARCHAR(100) | NOT NULL |
| email | VARCHAR(150) | NOT NULL, UNIQUE |
| senha | VARCHAR(255) | NOT NULL (hash bcrypt) |
| telefone | VARCHAR(20) | — |
| tipo_usuario | VARCHAR(20) | NOT NULL, DEFAULT 'comum' |
| criado_em | TIMESTAMP | NOT NULL, DEFAULT NOW() |

## empresas
| Campo | Tipo | Restrições |
|---|---|---|
| id_empresa | SERIAL | PK |
| nome_empresa | VARCHAR(120) | NOT NULL |
| cnpj | VARCHAR(18) | NOT NULL, UNIQUE |
| contato | VARCHAR(120) | — |

## tipos_residuo
| Campo | Tipo | Restrições |
|---|---|---|
| id_tipo | SERIAL | PK |
| nome | VARCHAR(80) | NOT NULL, UNIQUE |
| descricao | VARCHAR(200) | — |

## pontos_coleta
| Campo | Tipo | Restrições |
|---|---|---|
| id_ponto | SERIAL | PK |
| nome_local | VARCHAR(120) | NOT NULL |
| endereco | VARCHAR(200) | NOT NULL |
| cidade | VARCHAR(80) | NOT NULL |
| id_empresa | INT | NOT NULL, FK → empresas(id_empresa) |

## entregas
| Campo | Tipo | Restrições |
|---|---|---|
| id_entrega | SERIAL | PK |
| id_usuario | INT | NOT NULL, FK → usuarios(id_usuario) |
| id_ponto | INT | NOT NULL, FK → pontos_coleta(id_ponto) |
| id_tipo | INT | NOT NULL, FK → tipos_residuo(id_tipo) |
| peso_residuo | DECIMAL(10,2) | NOT NULL, CHECK > 0 (em kg) |
| data_entrega | TIMESTAMP | NOT NULL, DEFAULT NOW() |

## pontuacao
| Campo | Tipo | Restrições |
|---|---|---|
| id_pontuacao | SERIAL | PK |
| id_usuario | INT | NOT NULL, UNIQUE, FK → usuarios(id_usuario) |
| pontos | INT | NOT NULL, DEFAULT 0 |
| nivel | INT | NOT NULL, DEFAULT 1 |
| data_registro | TIMESTAMP | NOT NULL, DEFAULT NOW() |

## Cardinalidades

| Relação | Cardinalidade |
|---|---|
| usuarios → entregas | 1:N |
| usuarios → pontuacao | 1:1 |
| empresas → pontos_coleta | 1:N |
| pontos_coleta → entregas | 1:N |
| tipos_residuo → entregas | 1:N |
