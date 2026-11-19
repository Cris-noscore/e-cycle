-- ============================================================
-- E-CYCLE — Dados de teste (INSERTs)
-- Rode DEPOIS do 01_create_tables.sql.
--
-- Logins de teste (senhas em hash bcrypt):
--   ADMIN GLOBAL   -> diego@email.com  / admin123   (ve tudo)
--   ADMIN DE PONTO -> marcos@email.com / ponto123   (Ponto Centro)
--                     julia@email.com  / ponto123   (Ponto Shopping Sul)
--   CLIENTE        -> ana@email.com    / senha123
--                     bruno@email.com  / senha123
-- ============================================================

-- 1) EMPRESAS
INSERT INTO empresas (nome_empresa, cnpj, contato) VALUES
('EcoTech Reciclagem',  '12.345.678/0001-90', 'contato@ecotech.com.br'),
('Verde Digital LTDA',  '98.765.432/0001-10', 'suporte@verdedigital.com.br'),
('ReValor Eletrônicos', '11.222.333/0001-44', 'atendimento@revalor.com.br');

-- 2) TIPOS DE RESÍDUO
INSERT INTO tipos_residuo (nome, descricao) VALUES
('Baterias',     'Pilhas e baterias de aparelhos'),
('Celulares',    'Smartphones e telefones celulares'),
('Placas',       'Placas de circuito e componentes'),
('Cabos',        'Cabos e carregadores'),
('Computadores', 'Desktops, notebooks e peças');

-- 3) PONTOS DE COLETA (antes dos usuarios, por causa do id_ponto do admin)
INSERT INTO pontos_coleta (nome_local, endereco, cidade, id_empresa) VALUES
('Ponto Centro',       'Av. Brasil, 100',     'Carapicuíba', 1),
('Ponto Shopping Sul', 'Rua das Flores, 250', 'Carapicuíba', 1),
('Ponto Zona Norte',   'Rua Verde, 45',       'Osasco',      2),
('Ponto Escola',       'Rua da Escola, 10',   'Carapicuíba', 3);

-- 4) USUÁRIOS
--   comum  -> senha123 | admin global -> admin123 | admin de ponto -> ponto123
INSERT INTO usuarios (nome, email, senha, telefone, tipo_usuario, id_ponto) VALUES
('Ana Souza',   'ana@email.com',    '$2b$10$WEGhPf7z02u/QOv3B9pJeuolVCPD44a9/zkv6Uq3.WLpthwUqy49a', '(11) 90000-0001', 'comum', NULL),
('Bruno Lima',  'bruno@email.com',  '$2b$10$WEGhPf7z02u/QOv3B9pJeuolVCPD44a9/zkv6Uq3.WLpthwUqy49a', '(11) 90000-0002', 'comum', NULL),
('Carla Dias',  'carla@email.com',  '$2b$10$WEGhPf7z02u/QOv3B9pJeuolVCPD44a9/zkv6Uq3.WLpthwUqy49a', '(11) 90000-0003', 'comum', NULL),
('Diego Prof',  'diego@email.com',  '$2b$10$RnEwrvtqNRLguW/NtK0veO0XQm4umeOJ7i/mBygzku5YdQFXUl4MO', '(11) 90000-0004', 'admin', NULL),
('Marcos Ponto','marcos@email.com', '$2b$10$a0zzTicos2N6kK05qUj3buUdfnQFd/l4NvvlUrCG4DUdzwYoEgsey', '(11) 90000-0005', 'admin', 1),
('Julia Ponto', 'julia@email.com',  '$2b$10$a0zzTicos2N6kK05qUj3buUdfnQFd/l4NvvlUrCG4DUdzwYoEgsey', '(11) 90000-0006', 'admin', 2);

-- 5) ENTREGAS de teste
--   Algumas ja CONFIRMADAS (contam nos relatorios) e uma SOLICITADA (pendente).
INSERT INTO entregas (id_usuario, id_ponto, id_tipo, peso_residuo, status, data_confirmacao) VALUES
(1, 1, 2, 1.50, 'confirmado', NOW()),
(1, 1, 1, 0.80, 'confirmado', NOW()),
(2, 2, 5, 5.00, 'confirmado', NOW()),
(2, 3, 3, 2.20, 'confirmado', NOW()),
(1, 1, 5, 3.10, 'solicitado', NULL);   -- pendente de confirmacao no Ponto Centro

-- 6) PONTUAÇÃO (coerente com as entregas CONFIRMADAS, regra pontos = peso*10)
INSERT INTO pontuacao (id_usuario, pontos, nivel) VALUES
(1, 23, 1),   -- (1.50 + 0.80) * 10 = 23   (a de 3.10 ainda esta pendente)
(2, 72, 1);   -- (5.00 + 2.20) * 10 = 72
