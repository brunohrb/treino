# BHR Treinos

App de treinos com IA (PWA).

## 📱 Instalar no iPhone (ícone na tela de início)

1. Publique este repositório em **HTTPS** (GitHub Pages, Vercel, Netlify,
   Cloudflare Pages etc.). O iOS exige HTTPS para instalar PWAs.
2. No iPhone, abra o site no **Safari** (não funciona pelo Chrome no iOS).
3. Toque no botão **Compartilhar** (ícone de quadrado com seta pra cima).
4. Role e toque em **Adicionar à Tela de Início**.
5. Confirme o nome (**BHR**) e toque em **Adicionar**.

Pronto — o ícone ficará na home do iPhone e o app abrirá em tela cheia,
sem a barra do Safari, com cache offline via Service Worker.

### Estrutura PWA

- `manifest.json` — metadados do PWA (nome, ícones, cores, atalhos).
- `service-worker.js` — cache offline (network-first p/ HTML, cache-first
  p/ estáticos, stale-while-revalidate p/ CDNs). Ignora requisições ao
  Supabase.
- `icons/` — ícones em PNG (120, 152, 167, 180, 192, 512 + maskable).
- Meta tags iOS (`apple-mobile-web-app-*`) e `apple-touch-icon` no `<head>`
  de `index.html`.

## ⌚️ Apple Watch

O watchOS **não executa PWAs nativamente**. A forma suportada pela Apple
é criar um **Atalho (Shortcuts)** no iPhone que abre a URL do app — e
esse atalho fica disponível no Apple Watch (app Atalhos ou como
complicação de mostrador).

Passo a passo:

1. No iPhone, abra o app **Atalhos** → toque em **+**.
2. Adicione a ação **Abrir URL** e cole a URL do seu app (ex.:
   `https://seu-dominio/index.html`).
3. Toque em **Detalhes do Atalho** e ative **Mostrar no Apple Watch**.
4. Dê o nome **BHR Treinos** e escolha um ícone/cor.
5. No Apple Watch, abra o app **Atalhos** — o BHR aparece na lista.
   (Opcional) Adicione como complicação: no mostrador, edite
   complicações → **Atalhos** → selecione **BHR Treinos**.

Ao tocar no atalho, o Watch pede para continuar no iPhone e o PWA abre
em tela cheia.

### Deep-links por aba

O app aceita `?tab=` para abrir direto numa aba. Exemplos para atalhos:

- `…/index.html?tab=treinos`
- `…/index.html?tab=scanner`
- `…/index.html?tab=bio`
- `…/index.html?tab=atividades`

Você pode criar vários atalhos no iPhone (um por aba) e todos podem ir
para o Apple Watch.
