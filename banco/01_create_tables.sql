-- ============================================================
-- E-CYCLE — Criação das tabelas (PostgreSQL / Supabase)
-- Rode este script no SQL Editor do Supabase.
-- ============================================================

DROP TABLE IF EXISTS pontuacao     CASCADE;
DROP TABLE IF EXISTS entregas      CASCADE;
DROP TABLE IF EXISTS pontos_coleta CASCADE;
DROP TABLE IF EXISTS tipos_residuo CASCADE;
DROP TABLE IF EXISTS empresas      CASCADE;
DROP TABLE IF EXISTS usuarios      CASCADE;

-- ------------------------------------------------------------
-- USUÁRIOS
-- tipo_usuario: 'comum' (cliente) ou 'admin'.
-- id_ponto: preenchido para o ADMIN responsavel por um ponto
--           de coleta. NULL para cliente e para admin global.
-- ------------------------------------------------------------
CREATE TABLE usuarios (
    id_usuario   SERIAL       PRIMARY KEY,
    nome         VARCHAR(100) NOT NULL,
    email        VARCHAR(150) NOT NULL UNIQUE,
    senha        VARCHAR(255) NOT NULL,           -- hash (bcrypt)
    telefone     VARCHAR(20),
    tipo_usuario VARCHAR(20)  NOT NULL DEFAULT 'comum',  -- 'comum' | 'admin'
    id_ponto     INT,                             -- FK adicionada mais abaixo
    criado_em    TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- EMPRESAS RECICLADORAS
-- ------------------------------------------------------------
CREATE TABLE empresas (
    id_empresa   SERIAL       PRIMARY KEY,
    nome_empresa VARCHAR(120) NOT NULL,
    cnpj         VARCHAR(18)  NOT NULL UNIQUE,
    contato      VARCHAR(120)
);

-- ------------------------------------------------------------
-- TIPOS DE RESÍDUO ELETRÔNICO
-- ------------------------------------------------------------
CREATE TABLE tipos_residuo (
    id_tipo   SERIAL       PRIMARY KEY,
    nome      VARCHAR(80)  NOT NULL UNIQUE,
    descricao VARCHAR(200)
);

-- ------------------------------------------------------------
-- PONTOS DE COLETA (cada um pertence a uma empresa)
-- ------------------------------------------------------------
CREATE TABLE pontos_coleta (
    id_ponto   SERIAL       PRIMARY KEY,
    nome_local VARCHAR(120) NOT NULL,
    endereco   VARCHAR(200) NOT NULL,
    cidade     VARCHAR(80)  NOT NULL,
    id_empresa INT          NOT NULL,
    CONSTRAINT fk_ponto_empresa FOREIGN KEY (id_empresa) REFERENCES empresas (id_empresa)
);

-- Agora que pontos_coleta existe, liga o admin ao seu ponto.
ALTER TABLE usuarios
    ADD CONSTRAINT fk_usuario_ponto FOREIGN KEY (id_ponto) REFERENCES pontos_coleta (id_ponto);

-- ------------------------------------------------------------
-- ENTREGAS (o "descarte")
-- status: 'solicitado' -> 'confirmado' (ou 'recusado')
-- A pontuacao so e gerada na CONFIRMACAO.
-- ------------------------------------------------------------
CREATE TABLE entregas (
    id_entrega       SERIAL        PRIMARY KEY,
    id_usuario       INT           NOT NULL,
    id_ponto         INT           NOT NULL,
    id_tipo          INT           NOT NULL,
    peso_residuo     DECIMAL(10,2) NOT NULL CHECK (peso_residuo > 0),  -- kg
    status           VARCHAR(20)   NOT NULL DEFAULT 'solicitado',
    data_entrega     TIMESTAMP     NOT NULL DEFAULT NOW(),
    data_confirmacao TIMESTAMP,
    CONSTRAINT fk_entrega_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario),
    CONSTRAINT fk_entrega_ponto   FOREIGN KEY (id_ponto)   REFERENCES pontos_coleta (id_ponto),
    CONSTRAINT fk_entrega_tipo    FOREIGN KEY (id_tipo)    REFERENCES tipos_residuo (id_tipo)
);

-- ------------------------------------------------------------
-- PONTUAÇÃO / GAMIFICAÇÃO (uma linha por usuario)
-- ------------------------------------------------------------
CREATE TABLE pontuacao (
    id_pontuacao  SERIAL     PRIMARY KEY,
    id_usuario    INT        NOT NULL UNIQUE,
    pontos        INT        NOT NULL DEFAULT 0,
    nivel         INT        NOT NULL DEFAULT 1,
    data_registro TIMESTAMP  NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_pontuacao_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario)
);

CREATE INDEX idx_entregas_usuario ON entregas (id_usuario);
CREATE INDEX idx_entregas_ponto   ON entregas (id_ponto);
CREATE INDEX idx_entregas_tipo    ON entregas (id_tipo);
CREATE INDEX idx_entregas_status  ON entregas (status);
