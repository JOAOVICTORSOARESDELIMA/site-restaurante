# Restaurante do Sabor: cardápio do dia e pedidos

Site simples para um restaurante de almoço e quentinhas. Funciona assim:

- o dono marca as comidas do dia num painel;
- os clientes montam o pedido pelo celular e enviam pelo WhatsApp;
- os garçons anotam os pedidos do salão e da viagem num celular;
- todos os pedidos saem sozinhos numa impressora térmica no restaurante.

Não tem servidor nem programa para instalar. São só arquivos HTML, CSS e JavaScript puro. O único serviço externo é o **Firebase Realtime Database** (gratuito), que guarda o cardápio do dia e os pedidos.

---

## Páginas

| Arquivo | Quem usa | Para quê |
|---|---|---|
| `index.html` | Clientes | Ver o cardápio de hoje, escolher o tamanho (M/G) e as comidas, e enviar o pedido pelo WhatsApp (entrega ou retirada). |
| `garcom.html` | Garçons | Anotar pedidos na mesa: **Salão** ou **Viagem**, com o nome do cliente (obrigatório, porque o cliente é chamado pelo nome). O pedido vai direto para a impressora. |
| `admin.html` | Dono / administrador | Login e escolha das comidas do dia. Ao tocar em **Publicar**, o cardápio aparece para clientes e garçons. |
| `pedidos.html` | Computador do caixa | Login, lista dos pedidos do dia e impressão automática do cupom (papel de 80 mm ou 58 mm). |

## Arquivos de apoio

| Arquivo | O que tem |
|---|---|
| `cardapio.js` | **Cardápio completo**: categorias, comidas, tamanhos e preços das quentinhas, horário de funcionamento. É aqui que se adiciona comida nova ou se muda preço. |
| `banco.js` | Comunicação com o Firebase: ler e publicar o cardápio, login do administrador, salvar e buscar pedidos. |
| `config.exemplo.js` | Modelo do arquivo de configuração privada (veja abaixo). |
| `estilo.css` | Visual de todas as páginas. |
| `Comidas.txt` | Lista original das comidas, usada para montar o `cardapio.js`. |

---

## Como funciona por dentro

```
 admin.html ──publica──▶  Firebase /cardapio  ──lê──▶ index.html e garcom.html
                                                            │
     index.html ──(WhatsApp + cópia)──┐                     │
     garcom.html ─────────────────────┴──▶ Firebase /pedidos/AAAAMMDD
                                                            │
                         pedidos.html ◀──confere a cada 5 s─┘ ──▶ imprime o cupom
```

1. **Cardápio do dia.** O `cardapio.js` tem todas as comidas, cada uma com um número fixo (id). O painel publica só a lista de ids marcados e a data de hoje. O site de clientes só mostra o cardápio se a data publicada for a de hoje; se não for, aparece "o cardápio de hoje ainda não saiu".
2. **Pedido do cliente.** O pedido é montado em texto e abre o WhatsApp com a mensagem pronta. Ao mesmo tempo, uma cópia é gravada no Firebase para ser impressa. Cada pedido recebe um número de 4 dígitos.
3. **Pedido do garçom.** O pedido não passa pelo WhatsApp: vai direto para o Firebase. A página espera a confirmação de que o pedido chegou e depois limpa a tela para o próximo.
4. **Impressão.** A `pedidos.html` fica aberta no computador do caixa. A cada 5 segundos ela busca pedidos novos, toca um aviso sonoro e imprime o cupom. Os pedidos do garçom saem com **SALÃO** ou **VIAGEM** e o nome do cliente em letra grande. Para imprimir sem a janela de confirmação, abra o Chrome com a opção `--kiosk-printing` e deixe a impressora térmica como padrão.
5. **Horário.** O site de clientes só aceita pedidos dentro do horário definido em `cardapio.js` (`HORARIO`). A página do garçom não tem esse bloqueio.

---

## Instalação

### 1. Configuração privada

O arquivo `config.js` **não está no repositório**, de propósito: ele guarda as chaves do Firebase e o número do WhatsApp do restaurante.

1. Copie `config.exemplo.js` e renomeie a cópia para `config.js`.
2. Preencha `FIREBASE.apiKey`, `FIREBASE.databaseURL`, `WHATSAPP` e `WHATSAPP_TEXTO`.

Com o Firebase vazio, o site funciona em **modo de teste**: o cardápio fica salvo só no aparelho de quem publicou, e os pedidos não vão para a impressão.

### 2. Firebase

1. Crie um projeto no [Firebase](https://console.firebase.google.com/).
2. Ative o **Realtime Database**.
3. Em **Authentication**, ative o login por **e-mail e senha** e crie o usuário do administrador. Não existe tela de cadastro: as contas são criadas pelo console do Firebase.
4. Coloque regras de segurança parecidas com estas. Todos podem ler o cardápio, só quem tem login pode mudá-lo, qualquer um pode criar pedido e só quem tem login pode ler os pedidos:

```json
{
  "rules": {
    "cardapio": {
      ".read": true,
      ".write": "auth != null"
    },
    "pedidos": {
      "$dia": {
        ".read": "auth != null",
        ".indexOn": ["criadoEm"],
        "$id": {
          ".write": "!data.exists()"
        }
      }
    }
  }
}
```

> A chave de API do Firebase (`apiKey`) aparece no navegador de quem abre o site, porque é assim que o Firebase funciona na web. Quem protege os dados são as **regras** acima e o login, não o segredo da chave. Mesmo assim, ela fica fora do repositório.

### 3. Hospedagem

Qualquer hospedagem de site estático serve: Firebase Hosting, Netlify, GitHub Pages etc. Lembre de enviar também o `config.js` para a hospedagem, porque ele não está no repositório.

Para testar no computador, abra a pasta com qualquer servidor local (por exemplo, a extensão *Live Server* do VS Code).

---

## Manutenção do dia a dia

- **Mudar preço ou tamanho:** edite `TAMANHOS` em `cardapio.js`.
- **Adicionar comida:** inclua uma linha na categoria certa em `cardapio.js`, com um **número que ainda não foi usado**. Nunca troque o número de uma comida que já existe.
- **Mudar horário:** edite `HORARIO` em `cardapio.js`.
- **Trocar o WhatsApp:** edite o `config.js`.

## Tecnologias

- HTML, CSS e JavaScript puro, sem frameworks e sem etapa de build
- Firebase Realtime Database (API REST) e Firebase Authentication
- Fontes Pacifico e Poppins (Google Fonts)
