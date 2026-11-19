// ============================================================
// cliente.js — area do cliente: solicitar descarte + status.
// ============================================================
if (!exigirLogin()) throw new Error('sem login');

const $ = (s) => document.querySelector(s);
function toast(msg, tipo = 'ok') {
  const t = $('#toast'); t.textContent = msg; t.className = 'toast ' + tipo;
  t.hidden = false; setTimeout(() => { t.hidden = true; }, 3000);
}
function dados(form) { const o = {}; new FormData(form).forEach((v, k) => o[k] = v); return o; }
function dataBR(iso) { return new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }); }

// Rotulo bonito para o status
function statusBadge(s) {
  const mapa = {
    solicitado: ['Aguardando confirmação', 'st-aguardando'],
    confirmado: ['Confirmado', 'st-confirmado'],
    recusado:   ['Recusado', 'st-recusado'],
  };
  const [txt, cls] = mapa[s] || [s, ''];
  return `<span class="status ${cls}">${txt}</span>`;
}

$('#ola').textContent = 'Olá, ' + (auth.usuario()?.nome || '');
$('#btnSair').addEventListener('click', () => auth.sair());

let pontosCache = [];

async function carregarPerfil() {
  const p = await api.get('/perfil');
  $('#meusPontos').textContent = p.pontuacao.pontos;
  $('#meuNivel').textContent = p.pontuacao.nivel;
}

async function carregarSelects() {
  const [pontos, tipos] = await Promise.all([api.get('/pontos'), api.get('/tipos')]);
  pontosCache = pontos;
  $('#selPonto').innerHTML = pontos.map((p) => `<option value="${p.id_ponto}">${p.nome_local} — ${p.cidade}</option>`).join('');
  $('#selTipo').innerHTML = tipos.map((t) => `<option value="${t.id_tipo}">${t.nome}</option>`).join('');
  mostrarEndereco();
}

// Mostra o endereco do ponto selecionado
function mostrarEndereco() {
  const id = Number($('#selPonto').value);
  const p = pontosCache.find((x) => x.id_ponto === id);
  $('#enderecoPonto').textContent = p ? `📍 ${p.endereco}, ${p.cidade}` : '';
}
$('#selPonto').addEventListener('change', mostrarEndereco);

async function carregarMinhas() {
  const lista = await api.get('/perfil/entregas');
  $('#tabMinhas tbody').innerHTML = lista.map((e) => `
    <tr><td>${dataBR(e.data_entrega)}</td><td>${e.nome_local}</td><td>${e.nome_tipo}</td>
    <td>${e.peso_residuo}</td><td>${statusBadge(e.status)}</td></tr>`).join('')
    || '<tr><td colspan="5">Nenhum descarte ainda. Solicite o primeiro acima!</td></tr>';
}

$('#formDescarte').addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    await api.post('/entregas', dados(e.target)); // id_usuario vem do token
    e.target.reset();
    mostrarEndereco();
    $('#avisoSolicitacao').hidden = false;
    toast('Solicitação enviada!');
    carregarMinhas();
  } catch (err) { toast(err.message, 'erro'); }
});

(async function iniciar() {
  try { await Promise.all([carregarPerfil(), carregarSelects(), carregarMinhas()]); }
  catch (err) { toast('Erro ao carregar. A API está rodando?', 'erro'); }
})();
