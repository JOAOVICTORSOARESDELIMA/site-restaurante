/* ============================================================
   MODELO DE CONFIGURAÇÃO
   1. Copie este arquivo e renomeie a cópia para "config.js".
   2. Preencha com os dados do seu restaurante.
   O config.js fica fora do GitHub para não expor esses dados.
   ============================================================ */

// Ligação com o banco de dados online (Firebase).
// Deixe vazio para usar o "modo de teste" (cardápio salvo só no aparelho).
const FIREBASE = {
  apiKey: "",       // Configurações do projeto > Geral > Chave de API da Web
  databaseURL: "",  // Ex.: https://SEU-PROJETO-default-rtdb.firebaseio.com
};

// WhatsApp que recebe os pedidos: 55 (Brasil) + DDD + número, só dígitos
const WHATSAPP = "5500000000000";
// Como o número aparece escrito no rodapé do site
const WHATSAPP_TEXTO = "(00) 00000-0000";
