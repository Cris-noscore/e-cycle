// ============================================================
// api.js — comunicacao com o backend + gestao do token (JWT).
// O token e o usuario logado ficam no localStorage.
// ============================================================
const API_URL = 'http://localhost:3000/api';

const auth = {
  salvar(token, usuario) {
    localStorage.setItem('ecycle_token', token);
    localStorage.setItem('ecycle_user', JSON.stringify(usuario));
  },
  token() { return localStorage.getItem('ecycle_token'); },
  usuario() {
    const u = localStorage.getItem('ecycle_user');
    return u ? JSON.parse(u) : null;
  },
  sair() {
    localStorage.removeItem('ecycle_token');
    localStorage.removeItem('ecycle_user');
    window.location.href = 'index.html';
  },
};

async function requisitar(caminho, opcoes = {}) {
  const cabecalhos = { 'Content-Type': 'application/json', ...(opcoes.headers || {}) };
  const token = auth.token();
  if (token) cabecalhos.Authorization = 'Bearer ' + token;

  const resp = await fetch(API_URL + caminho, { ...opcoes, headers: cabecalhos });
  const texto = await resp.text();
  const dados = texto ? JSON.parse(texto) : null;

  if (!resp.ok) {
    // Token expirado/invalido durante uma sessao ja logada -> volta pro login.
    if (resp.status === 401 && token) { auth.sair(); return; }
    const msg = dados?.erro || (dados?.erros && dados.erros.join(', ')) || 'Erro na requisicao';
    throw new Error(msg);
  }
  return dados;
}

const api = {
  get:  (c) => requisitar(c),
  post: (c, b) => requisitar(c, { method: 'POST', body: JSON.stringify(b) }),
  put:  (c, b) => requisitar(c, { method: 'PUT', body: JSON.stringify(b) }),
  del:  (c) => requisitar(c, { method: 'DELETE' }),
};

// Guardas de acesso das paginas (chamados no inicio de cada tela protegida).
function exigirLogin() {
  if (!auth.token()) { window.location.href = 'index.html'; return false; }
  return true;
}
function exigirAdmin() {
  const u = auth.usuario();
  if (!auth.token()) { window.location.href = 'index.html'; return false; }
  if (u?.tipo_usuario !== 'admin' && u?.tipo !== 'admin') {
    window.location.href = 'cliente.html'; return false;
  }
  return true;
}
