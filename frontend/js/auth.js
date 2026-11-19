// ============================================================
// auth.js — logica da tela de login e cadastro.
// ============================================================
const $ = (s) => document.querySelector(s);

function toast(msg, tipo = 'ok') {
  const t = $('#toast');
  t.textContent = msg;
  t.className = 'toast ' + tipo;
  t.hidden = false;
  setTimeout(() => { t.hidden = true; }, 3000);
}
function dados(form) {
  const o = {};
  new FormData(form).forEach((v, k) => { o[k] = v; });
  return o;
}

// Se ja estiver logado, vai direto pra tela certa.
(function redirecionarSeLogado() {
  const u = auth.usuario();
  if (auth.token() && u) {
    window.location.href = (u.tipo_usuario === 'admin') ? 'admin.html' : 'cliente.html';
  }
})();

// Alternar entre as abas Entrar / Criar conta
document.querySelectorAll('.login-aba').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.login-aba').forEach((b) => b.classList.remove('ativa'));
    btn.classList.add('ativa');
    $('#formLogin').hidden = btn.dataset.form !== 'formLogin';
    $('#formCadastro').hidden = btn.dataset.form !== 'formCadastro';
  });
});

// Depois de autenticar, guarda o token e vai pra tela do perfil.
function entrar(resultado) {
  auth.salvar(resultado.token, resultado.usuario);
  const destino = resultado.usuario.tipo_usuario === 'admin' ? 'admin.html' : 'cliente.html';
  window.location.href = destino;
}

$('#formLogin').addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const r = await api.post('/auth/login', dados(e.target));
    entrar(r);
  } catch (err) { toast(err.message, 'erro'); }
});

$('#formCadastro').addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const r = await api.post('/auth/register', dados(e.target));
    toast('Conta criada!');
    entrar(r);
  } catch (err) { toast(err.message, 'erro'); }
});
