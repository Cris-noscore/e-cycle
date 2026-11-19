-- ============================================================
-- E-CYCLE — Consultas dos relatórios (ETAPA 6)
-- Contam apenas entregas CONFIRMADAS (as solicitadas ainda nao
-- foram recebidas, entao nao entram nos numeros).
-- ============================================================

-- 1) Quantidade de resíduos coletados (total geral)
SELECT COUNT(*) AS total_entregas,
       COALESCE(SUM(peso_residuo), 0) AS peso_total_kg
FROM entregas
WHERE status = 'confirmado';

-- 2) Usuários que mais reciclam (ranking por pontos)
SELECT u.id_usuario, u.nome,
       COALESCE(p.pontos, 0) AS pontos,
       COALESCE(p.nivel, 1)  AS nivel,
       COUNT(e.id_entrega)   AS total_entregas,
       COALESCE(SUM(e.peso_residuo), 0) AS peso_total_kg
FROM usuarios u
LEFT JOIN pontuacao p ON p.id_usuario = u.id_usuario
LEFT JOIN entregas  e ON e.id_usuario = u.id_usuario AND e.status = 'confirmado'
WHERE u.tipo_usuario = 'comum'
GROUP BY u.id_usuario, u.nome, p.pontos, p.nivel
ORDER BY pontos DESC, peso_total_kg DESC;

-- 3) Pontos de coleta mais utilizados
SELECT pc.id_ponto, pc.nome_local, pc.cidade,
       COUNT(e.id_entrega) AS total_entregas,
       COALESCE(SUM(e.peso_residuo), 0) AS peso_total_kg
FROM pontos_coleta pc
LEFT JOIN entregas e ON e.id_ponto = pc.id_ponto AND e.status = 'confirmado'
GROUP BY pc.id_ponto, pc.nome_local, pc.cidade
ORDER BY total_entregas DESC;

-- 4) Tipos de resíduos mais descartados
SELECT tr.id_tipo, tr.nome,
       COUNT(e.id_entrega) AS total_entregas,
       COALESCE(SUM(e.peso_residuo), 0) AS peso_total_kg
FROM tipos_residuo tr
LEFT JOIN entregas e ON e.id_tipo = tr.id_tipo AND e.status = 'confirmado'
GROUP BY tr.id_tipo, tr.nome
ORDER BY total_entregas DESC;
