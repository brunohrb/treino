# BHR Treinos — Guia para o Claude Code

Este documento orienta o Claude Code (e qualquer dev) ao trabalhar neste repositório.

## Visão geral

Aplicativo web **single-file** de treinos, análise corporal e acompanhamento de
performance, otimizado para uso como **PWA no iPhone** (adicionar à Tela de
Início).

Toda a aplicação vive em `index.html`: HTML + CSS + JS juntos.

## Estrutura do repositório

```
.
├── index.html                     # App completo (HTML + CSS + JS)
├── manifest.webmanifest           # Manifesto PWA
├── icon.svg                       # Ícone vetorial (fonte de verdade)
├── apple-touch-icon.png           # 180x180 (iOS padrão)
├── apple-touch-icon-152.png       # 152x152 (iPad)
├── apple-touch-icon-167.png       # 167x167 (iPad Pro)
├── icon-192.png / icon-512.png    # PWA Android / splash
├── favicon-16.png / favicon-32.png
├── CLAUDE.md                      # Este arquivo
└── README.md
```

## Stack

- HTML/CSS/JS puros (sem build step).
- Bibliotecas via CDN: `chart.js`, `pdf.js`, `@supabase/supabase-js`, `@mediapipe/pose`.
- Backend: **Supabase** (auth + DB). Credenciais `SUPABASE_URL` / `SUPABASE_KEY`
  ficam inline em `index.html` (chave pública `anon`).
- Fontes: Google Fonts (`Archivo Black`, `DM Sans`).

## Como rodar localmente

Como o app é estático, qualquer servidor HTTP serve:

```bash
python3 -m http.server 8000
# abrir http://localhost:8000
```

No iPhone, acessar via IP local no Safari e usar **Compartilhar → Adicionar à
Tela de Início** para instalar.

## Regras de PWA / iOS (importantes)

- O ícone fonte é `icon.svg`. **Sempre** que alterar, regerar os PNGs:

  ```bash
  python3 - <<'PY'
  import cairosvg
  for name, size in {
      "apple-touch-icon.png":180,"apple-touch-icon-152.png":152,
      "apple-touch-icon-167.png":167,"icon-192.png":192,"icon-512.png":512,
      "favicon-32.png":32,"favicon-16.png":16,
  }.items():
      cairosvg.svg2png(url="icon.svg", write_to=name,
                       output_width=size, output_height=size)
  PY
  ```

- Meta tags obrigatórias no `<head>` (já presentes):
  - `apple-mobile-web-app-capable`, `mobile-web-app-capable`
  - `apple-mobile-web-app-status-bar-style="black-translucent"`
  - `apple-mobile-web-app-title="BHR Treinos"`
  - `theme-color="#0F1419"`
  - `viewport` com `viewport-fit=cover`
  - `<link rel="apple-touch-icon" ...>` para 152/167/180
  - `<link rel="manifest" href="manifest.webmanifest">`

- `manifest.webmanifest` precisa acompanhar mudanças de nome/tema/ícones.

- **Safe areas**: usar `env(safe-area-inset-*)` em tudo que toca as bordas
  (header fixo, bottom sheets, botões flutuantes).

- Inputs devem ter `font-size >= 16px` para o iOS não dar zoom ao focar.

## Convenções de código

- Um único arquivo `index.html`. Não criar arquivos JS/CSS separados sem
  necessidade real.
- Nomes de funções e UI em **português** (pt-BR), seguindo o padrão existente.
- Emojis são usados livremente em UI (ícones de categorias, status, etc.).
- Paleta (variáveis CSS em `:root`):
  - `--primary: #00D9B1` (verde-água, cor-marca)
  - `--secondary: #FF6B9D`
  - `--dark: #0F1419`, `--dark-lighter: #1C2128`, `--dark-card: #252D38`
  - `--text: #E8EAED`, `--text-muted: #9CA3AF`
- Evitar `alert()`/`confirm()` quando houver UI customizada disponível.

## UX para "cara de app nativo"

- Scroll sem rubber-band (`overscroll-behavior-y: none`).
- `-webkit-user-select: none` no body; textos selecionáveis apenas em
  `input`, `textarea`, `[contenteditable]`.
- Sem zoom por duplo-toque nem por pinça (bloqueados em JS).
- Banner `#iosInstallBanner` aparece **apenas** no Safari iOS quando o app
  ainda não está instalado, e pode ser dispensado (persistido em
  `localStorage` sob a chave `bhr_ios_install_dismissed_v1`).
- Ao alterar copy/ícone do banner, manter o tom curto e direto.

## Branch & commits

- Branch padrão: `main`.
- Branch de feature atual: `claude/iphone-app-icon-ux-73nLU`.
- Commits descritivos em português, com escopo claro (ex.: `ios: adiciona
  apple-touch-icon e manifest PWA`).

## Coisas a NÃO fazer

- Não dividir `index.html` em múltiplos arquivos sem pedido explícito.
- Não trocar a stack (sem bundler, sem framework).
- Não remover as meta tags de PWA/iOS.
- Não comitar chaves privadas do Supabase (apenas `anon` pode ir no cliente).
- Não subir imagens/ícones sem regerar a partir de `icon.svg`.
