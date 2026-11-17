/* ============================================================
   CARDÁPIO COMPLETO DO RESTAURANTE
   Para adicionar uma comida nova: coloque uma linha nova com um
   número (id) que ainda NÃO foi usado. Nunca troque o número de
   uma comida que já existe.
   ============================================================ */

// O número do WhatsApp fica no config.js (arquivo privado)
const NOME_RESTAURANTE = "Restaurante do Sabor";

// Tamanhos e preços da quentinha (em reais). Para mudar o preço, troque o número.
const TAMANHOS = [
  { sigla: "M", nome: "Média", preco: 23 },
  { sigla: "G", nome: "Grande", preco: 28 },
];

// Horário em que o site aceita pedidos (hora de João Pessoa/Brasília, formato 24h)
const HORARIO = { abre: "08:00", fecha: "13:30" };

function restauranteAberto(agora = new Date()) {
  const hora = new Intl.DateTimeFormat("en-GB", {
    timeZone: "America/Fortaleza", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).format(agora);
  return hora >= HORARIO.abre && hora <= HORARIO.fecha;
}

function horaBonita(hhmm) {
  const [h, m] = hhmm.split(":");
  return Number(h) + "h" + (m === "00" ? "" : m);
}
const TEXTO_HORARIO = `das ${horaBonita(HORARIO.abre)} às ${horaBonita(HORARIO.fecha)}`;

const CARDAPIO = [
  {
    categoria: "Acompanhamentos", icone: "🍚",
    quantidade: false,
    itens: [
      [1, "Feijão carioca", "Feijão carioca cozido com tempero caseiro e caldo no ponto."],
      [2, "Feijão preto", "Feijão preto bem temperado, cozido devagar."],
      [3, "Feijão macassar", "Feijão macassar cozido no tempero caseiro, ao estilo nordestino."],
      [4, "Rubacão com feijão verde", "Clássico nordestino de arroz com feijão verde, bem temperado."],
      [5, "Favada", "Prato típico de fava, encorpado e cheio de sabor."],
      [6, "Arroz branco", "Arroz branco soltinho."],
      [7, "Arroz refogado", "Arroz refogado soltinho e temperado."],
      [8, "Arroz refogado com cenoura", "Arroz refogado com cenoura, soltinho e colorido."],
      [9, "Arroz refogado com couve", "Arroz refogado com couve fresquinha."],
      [10, "Arroz refogado com brócolis", "Arroz refogado com brócolis."],
      [11, "Macarrão alho e óleo", "Macarrão temperado no alho e óleo."],
      [12, "Farofa caseira", "Farofa feita na casa, soltinha e bem temperada."],
    ],
  },
  {
    categoria: "Saladas e guarnições", icone: "🥗",
    quantidade: false,
    itens: [
      [13, "Salada de folhas", "Alface e acelga frescas."],
      [14, "Salada crua", "Tomate, cebola, pimentão e pepino em fatias frescas."],
      [15, "Vinagrete", "Tomate, cebola e pimentão picados no tempero de vinagrete."],
      [16, "Legumes cozidos", "Legumes cozidos no ponto."],
      [17, "Legumes na maionese", "Legumes cozidos com maionese cremosa."],
      [18, "Legumes e vegetais ao forno", "Legumes assados no forno, macios e dourados."],
      [19, "Purê de batata", "Purê de batata cremoso."],
      [20, "Batata doce", "Batata doce cozida, macia e naturalmente adocicada."],
      [21, "Beterraba", "Beterraba cozida em fatias."],
      [22, "Salada de cenoura e abobrinha com couve", "Cenoura e abobrinha refogadas com couve."],
      [23, "Salada de repolho na maionese", "Repolho fatiado com maionese."],
      [24, "Salpicão de frango", "Frango desfiado com legumes e maionese, gelado."],
      [25, "Mix de repolho com abacaxi", "Repolho com pedaços de abacaxi, refrescante."],
      [26, "Salada de batatinhas ao forno", "Batatinhas assadas no forno e temperadas."],
    ],
  },
  {
    categoria: "Proteínas", icone: "🍗",
    quantidade: false,
    itens: [
      [27, "Bife acebolado", "Bife grelhado com cebola refogada."],
      [28, "Bife ao molho de tomate", "Bife no molho de tomate caseiro."],
      [29, "Carne moída", "Carne moída refogada com tempero caseiro."],
      [30, "Strogonoff de frango", "Frango em molho cremoso de strogonoff."],
      [31, "Calabresa frita acebolada", "Calabresa frita com cebola."],
      [32, "Frango frito coxa e sobrecoxa", "Coxa e sobrecoxa fritas, crocantes por fora e suculentas por dentro."],
      [33, "Lasca de bacalhau ao forno", "Lascas de bacalhau assadas no forno."],
      [34, "Carne suína torrada", "Carne suína torradinha e saborosa."],
      [35, "Fígado acebolado", "Fígado bovino macio com cebola refogada."],
      [36, "Filé de frango à milanesa", "Filé de frango empanado e frito, crocante."],
      [37, "Galinha guisada", "Galinha cozida no molho, bem temperada."],
      [38, "Linguiça toscana frita", "Linguiça toscana frita."],
      [39, "Fricassê de frango", "Frango em molho cremoso, no estilo fricassê."],
      [40, "Filé de peixe à milanesa", "Filé de peixe empanado e frito."],
      [41, "Filé de frango frito", "Filé de frango frito, macio e dourado."],
    ],
  },
  {
    categoria: "Sobremesas e bebida", icone: "🍮",
    quantidade: true, // cliente escolhe quantas unidades
    itens: [
      [42, "Suco da fruta 300 ml", "Suco natural da fruta do dia."],
      [43, "Delícia de abacaxi", "Sobremesa cremosa de abacaxi."],
      [44, "Delícia de goiaba", "Sobremesa cremosa de goiaba."],
      [45, "Salada de frutas", "Frutas frescas picadas."],
      [46, "Mousse de limão", "Mousse cremosa e leve de limão."],
      [47, "Mousse de maracujá", "Mousse cremosa de maracujá."],
      [48, "Mini pudim", "Pudim de leite com calda de caramelo."],
    ],
  },
];

/* ---------- Funções compartilhadas (não precisa mexer) ---------- */

const CHAVE_SALVO = "cardapioDoDia";

function hojeTexto() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}`;
}

function dataBonita(aaaammdd) {
  return `${aaaammdd.slice(6, 8)}/${aaaammdd.slice(4, 6)}/${aaaammdd.slice(0, 4)}`;
}

function emReais(n) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function lerSalvo() {
  try {
    const s = JSON.parse(localStorage.getItem(CHAVE_SALVO));
    if (s && Array.isArray(s.ids)) return s;
  } catch (e) {}
  return null;
}

function salvar(ids) {
  try {
    localStorage.setItem(CHAVE_SALVO, JSON.stringify({ data: hojeTexto(), ids }));
  } catch (e) {}
}

function linkWhatsApp(texto) {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`;
}

// Título de uma categoria com o ícone ao lado
function tituloCategoria(cat) {
  const h = document.createElement("h2");
  const ic = document.createElement("span");
  ic.className = "icone"; ic.textContent = cat.icone; ic.setAttribute("aria-hidden", "true");
  h.append(ic, cat.categoria);
  return h;
}