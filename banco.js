/* Conversa com o banco de dados online (Firebase). Não precisa mexer aqui. */

const BANCO_LIGADO = !!(FIREBASE.apiKey && FIREBASE.databaseURL);
const CHAVE_LOGIN = "adminLogin";
let sessao = null; // { token, expira }

function urlCardapio() {
  return FIREBASE.databaseURL.replace(/\/+$/, "") + "/cardapio.json";
}

// Devolve { data: "aaaammdd", ids: [...] } ou null se nunca foi publicado
async function buscarCardapio() {
  if (!BANCO_LIGADO) return lerSalvo();
  const r = await fetch(urlCardapio(), { cache: "no-store" });
  if (!r.ok) throw new Error("rede");
  const s = await r.json();
  if (!s || !s.data) return null;
  return { data: String(s.data), ids: Array.isArray(s.ids) ? s.ids.filter(Number.isInteger) : [] };
}

async function publicarCardapio(ids) {
  if (!BANCO_LIGADO) {
    salvar(ids);
    return;
  }
  const token = await tokenAtual();
  if (!token) throw new Error("login");
  const r = await fetch(urlCardapio() + "?auth=" + encodeURIComponent(token), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: hojeTexto(), ids, atualizadoEm: Date.now() }),
  });
  if (r.status === 401 || r.status === 403) throw new Error("permissao");
  if (!r.ok) throw new Error("rede");
}

async function entrar(email, senha) {
  const r = await fetch(
    "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" + FIREBASE.apiKey,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: senha, returnSecureToken: true }),
    }
  );
  const j = await r.json().catch(() => ({}));
  if (!r.ok) {
    const cod = (j.error && j.error.message) || "";
    if (/INVALID|NOT_FOUND|MISSING/.test(cod)) throw new Error("E-mail ou senha incorretos.");
    if (/TOO_MANY/.test(cod)) throw new Error("Muitas tentativas. Espere alguns minutos e tente de novo.");
    throw new Error("Não foi possível entrar. Verifique a internet e tente de novo.");
  }
  guardarSessao(j.idToken, j.refreshToken, j.expiresIn);
}

function guardarSessao(token, renovar, segundos) {
  sessao = { token, expira: Date.now() + (Number(segundos) - 60) * 1000 };
  try { localStorage.setItem(CHAVE_LOGIN, renovar); } catch (e) {}
}

// Devolve o token de acesso válido, ou null se precisa fazer login
async function tokenAtual() {
  if (sessao && Date.now() < sessao.expira) return sessao.token;
  let renovar = null;
  try { renovar = localStorage.getItem(CHAVE_LOGIN); } catch (e) {}
  if (!renovar) return null;
  try {
    const r = await fetch("https://securetoken.googleapis.com/v1/token?key=" + FIREBASE.apiKey, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "grant_type=refresh_token&refresh_token=" + encodeURIComponent(renovar),
    });
    if (!r.ok) { sair(); return null; }
    const j = await r.json();
    guardarSessao(j.id_token, j.refresh_token, j.expires_in);
    return sessao.token;
  } catch (e) {
    return null;
  }
}

function sair() {
  sessao = null;
  try { localStorage.removeItem(CHAVE_LOGIN); } catch (e) {}
}

/* ---------- Pedidos (para a impressão no restaurante) ---------- */

function urlPedidos(dia) {
  return FIREBASE.databaseURL.replace(/\/+$/, "") + "/pedidos/" + dia + ".json";
}

// Chamado quando o cliente envia o pedido. Não trava o site se falhar.
function salvarPedido(pedido) {
  if (!BANCO_LIGADO) return;
  try {
    fetch(urlPedidos(hojeTexto()), {
      method: "POST",
      keepalive: true,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...pedido, criadoEm: { ".sv": "timestamp" } }),
    }).catch(() => {});
  } catch (e) {}
}

// Usado na página do garçom: espera a resposta para confirmar que o pedido chegou.
async function enviarPedido(pedido) {
  if (!BANCO_LIGADO) throw new Error("banco");
  const r = await fetch(urlPedidos(hojeTexto()), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...pedido, criadoEm: { ".sv": "timestamp" } }),
  });
  if (!r.ok) throw new Error("rede");
}

// Devolve os pedidos do dia criados depois de "desde" (só para o administrador)
async function buscarPedidos(dia, desde) {
  const token = await tokenAtual();
  if (!token) throw new Error("login");
  const filtro = '&orderBy="criadoEm"&startAt=' + (desde + 1);
  const r = await fetch(urlPedidos(dia) + "?auth=" + encodeURIComponent(token) + filtro, { cache: "no-store" });
  if (r.status === 401 || r.status === 403) throw new Error("permissao");
  if (!r.ok) throw new Error("rede");
  return (await r.json()) || {};
}