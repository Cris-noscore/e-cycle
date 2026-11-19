// ============================================================
// admin.js — painel do admin.
//   admin GLOBAL (sem ponto): ve tudo (relatorios, gestao, todos os pendentes)
//   admin DE PONTO (com id_ponto): so pendentes/historico do seu ponto
// ============================================================
if (!exigirAdmin()) throw new Error('acesso negado');

const $ = (s) => document.querySelector(s);
function toast(msg, tipo = 'ok') {
  const t = $('#toast'); t.textContent = msg; t.className = 'toast ' + tipo;
  t.hidden = false; setTimeout(() => { t.hidden = true; }, 3000);
}
function dados(form) { const o = {}; new FormData(form).forEach((v, k) => o[k] = v); return o; }
function dataBR(iso) { return new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }); }
function statusBadge(s) {
  const mapa = { solicitado: ['Aguardando', 'st-aguardando'], confirmado: ['Confirmado', 'st-confirmado'], recusado: ['Recusado', 'st-recusado'] };
  const [txt, cls] = mapa[s] || [s, ''];
  return `<span class="status ${cls}">${txt}</span>`;
}

const usuario = auth.usuario();
const ehGlobal = !usuario?.id_ponto;   // admin global nao tem ponto
$('#ola').textContent = 'Olá, ' + (usuario?.nome || '');
$('#btnSair').addEventListener('click', () => auth.sair());

// Admin de ponto: esconde as abas globais e ajusta o subtitulo.
if (!ehGlobal) {
  document.querySelectorAll('.aba-global').forEach((a) => a.hidden = true);
  $('#subAdmin').textContent = 'Responsável de ponto de coleta';
}

// ---- Abas ----
$('#abas').addEventListener('click', (e) => {
  const btn = e.target.closest('.aba'); if (!btn) return;
  document.querySelectorAll('.aba').forEach((b) => b.classList.remove('ativa'));
  document.querySelectorAll('.secao').forEach((s) => s.classList.remove('ativa'));
  btn.classList.add('ativa');
  $('#' + btn.dataset.alvo).classList.add('ativa');
  if (btn.dataset.alvo === 'painel') carregarRelatorios();
  if (btn.dataset.alvo === 'pendentes') carregarPendentes();
});

// ---- PENDENTES (confirmar / recusar) ----
async function carregarPendentes() {
  const lista = await api.get('/entregas/pendentes');
  const b = $('#badgePend');
  if (lista.length) { b.textContent = lista.length; b.hidden = false; } else b.hidden = true;
  $('#notaPend').textContent = ehGlobal
    ? 'Descartes solicitados aguardando confirmação (todos os pontos).'
    : 'Descartes solicitados no seu ponto de coleta.';
  $('#tabPendentes tbody').innerHTML = lista.map((e) => `
    <tr>
      <td>${dataBR(e.data_entrega)}</td><td>${e.nome_usuario}</td><td>${e.nome_local}</td>
      <td>${e.nome_tipo}</td><td>${e.peso_residuo}</td>
      <td>
        <button class="btn-confirmar" data-id="${e.id_entrega}">Confirmar</button>
        <button class="btn-excluir" data-recusar="${e.id_entrega}">Recusar</button>
      </td>
    </tr>`).join('') || '<tr><td colspan="6">Nenhuma solicitação pendente.</td></tr>';
}
$('#tabPendentes').addEventListener('click', async (e) => {
  const conf = e.target.closest('.btn-confirmar');
  const rec = e.target.closest('[data-recusar]');
  try {
    if (conf) {
      const r = await api.put('/entregas/' + conf.dataset.id + '/confirmar');
      toast(`Confirmado! Cliente ganhou ${r.gamificacao.pontos_ganhos} pontos.`);
    } else if (rec) {
      await api.put('/entregas/' + rec.dataset.recusar + '/recusar');
      toast('Descarte recusado.');
    } else return;
    carregarPendentes();
    if (ehGlobal) { carregarEntregas(); }
  } catch (err) { toast(err.message, 'erro'); }
});

// ---- HISTORICO ----
async function carregarEntregas() {
  const lista = await api.get('/entregas');
  $('#tabEntregas tbody').innerHTML = lista.map((e) => `
    <tr><td>${dataBR(e.data_entrega)}</td><td>${e.nome_usuario}</td><td>${e.nome_local}</td>
    <td>${e.nome_tipo}</td><td>${e.peso_residuo}</td><td>${statusBadge(e.status)}</td></tr>`).join('');
}

// ---- (Somente admin global) Gestao + relatorios ----
async function carregarUsuarios() {
  const lista = await api.get('/usuarios');
  $('#tabUsuarios tbody').innerHTML = lista.map((u) => `
    <tr><td>${u.id_usuario}</td><td>${u.nome}</td><td>${u.email}</td><td>${u.tipo_usuario}</td>
    <td><button class="btn-excluir" data-id="${u.id_usuario}">Excluir</button></td></tr>`).join('');
}
async function carregarEmpresas() {
  const lista = await api.get('/empresas');
  $('#tabEmpresas tbody').innerHTML = lista.map((e) => `
    <tr><td>${e.id_empresa}</td><td>${e.nome_empresa}</td><td>${e.cnpj}</td><td>${e.contato || '—'}</td>
    <td><button class="btn-excluir" data-id="${e.id_empresa}">Excluir</button></td></tr>`).join('');
}
async function carregarTipos() {
  const lista = await api.get('/tipos');
  $('#tabTipos tbody').innerHTML = lista.map((t) => `
    <tr><td>${t.id_tipo}</td><td>${t.nome}</td><td>${t.descricao || '—'}</td>
    <td><button class="btn-excluir" data-id="${t.id_tipo}">Excluir</button></td></tr>`).join('');
}
async function carregarPontos() {
  const lista = await api.get('/pontos');
  $('#tabPontos tbody').innerHTML = lista.map((p) => `
    <tr><td>${p.id_ponto}</td><td>${p.nome_local}</td><td>${p.cidade}</td><td>${p.nome_empresa}</td>
    <td><button class="btn-excluir" data-id="${p.id_ponto}">Excluir</button></td></tr>`).join('');
}
async function carregarSelects() {
  const empresas = await api.get('/empresas');
  $('#selEmpresaPonto').innerHTML = empresas.map((e) => `<option value="${e.id_empresa}">${e.nome_empresa}</option>`).join('');
}
async function carregarRelatorios() {
  const [totais, ranking, pontos, tipos] = await Promise.all([
    api.get('/relatorios/totais'), api.get('/relatorios/ranking'),
    api.get('/relatorios/pontos'), api.get('/relatorios/tipos'),
  ]);
  $('#totalEntregas').textContent = totais.total_entregas;
  $('#totalPeso').textContent = Number(totais.peso_total_kg).toFixed(2);
  $('#tabRanking tbody').innerHTML = ranking.map((u, i) => `
    <tr><td>${i + 1}</td><td>${u.nome}</td><td>${u.pontos}</td><td>${u.nivel}</td><td>${Number(u.peso_total_kg).toFixed(2)}</td></tr>`).join('');
  $('#tabPontosRel tbody').innerHTML = pontos.map((p) => `
    <tr><td>${p.nome_local}</td><td>${p.cidade}</td><td>${p.total_entregas}</td><td>${Number(p.peso_total_kg).toFixed(2)}</td></tr>`).join('');
  $('#tabTiposRel tbody').innerHTML = tipos.map((t) => `
    <tr><td>${t.nome}</td><td>${t.total_entregas}</td><td>${Number(t.peso_total_kg).toFixed(2)}</td></tr>`).join('');
}

// Formularios de gestao (so existem/valem para admin global)
$('#formUsuario')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  try { await api.post('/usuarios', dados(e.target)); e.target.reset(); toast('Usuário cadastrado'); carregarUsuarios(); }
  catch (err) { toast(err.message, 'erro'); }
});
$('#formEmpresa')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  try { await api.post('/empresas', dados(e.target)); e.target.reset(); toast('Empresa cadastrada'); carregarEmpresas(); carregarSelects(); }
  catch (err) { toast(err.message, 'erro'); }
});
$('#formTipo')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  try { await api.post('/tipos', dados(e.target)); e.target.reset(); toast('Tipo cadastrado'); carregarTipos(); }
  catch (err) { toast(err.message, 'erro'); }
});
$('#formPonto')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  try { await api.post('/pontos', dados(e.target)); e.target.reset(); toast('Ponto cadastrado'); carregarPontos(); }
  catch (err) { toast(err.message, 'erro'); }
});
document.querySelectorAll('#tabUsuarios,#tabEmpresas,#tabTipos,#tabPontos').forEach((tab) => {
  tab.addEventListener('click', async (e) => {
    const b = e.target.closest('.btn-excluir'); if (!b) return;
    const mapa = { tabUsuarios: 'usuarios', tabEmpresas: 'empresas', tabTipos: 'tipos', tabPontos: 'pontos' };
    const recurso = mapa[tab.id];
    try {
      await api.del('/' + recurso + '/' + b.dataset.id);
      toast('Removido');
      ({ usuarios: carregarUsuarios, empresas: carregarEmpresas, tipos: carregarTipos, pontos: carregarPontos }[recurso])();
      if (recurso === 'empresas') carregarSelects();
    } catch (err) { toast(err.message, 'erro'); }
  });
});

// ---- Inicializacao ----
(async function iniciar() {
  try {
    await Promise.all([carregarPendentes(), carregarEntregas()]);
    if (ehGlobal) {
      await Promise.all([carregarRelatorios(), carregarUsuarios(), carregarEmpresas(), carregarTipos(), carregarPontos(), carregarSelects()]);
    }
  } catch (err) { toast('Erro ao carregar. A API está rodando?', 'erro'); }
})();
