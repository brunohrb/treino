# IRON — Protocolo Hipertrofia (PWA v2)

PWA offline-first com treino + dieta + timer + readiness + deload automático. Dados salvos localmente (localStorage). Progresso do treino/dieta zera à meia-noite; readiness e semana persistem.

## Novidades v2

- **Toggle 6 dias / 5 dias** — escolha volume ideal ou conservador
- **Readiness diário** (0-100) — avaliação de sono, energia, dor muscular e humor → recomenda ajuste de carga
- **Semana de deload automática** (a cada 5 semanas) — séries reduzidas 50%, aviso pra reduzir carga 40%
- **Contador de semana** — com botões + / − pra corrigir manualmente

## Como instalar no celular

### Opção 1 — GitHub Pages (recomendado)

1. Criar repositório novo no GitHub (ex: `iron-treino`)
2. Subir todos os arquivos desta pasta na raiz
3. **Settings → Pages → Source → Deploy from a branch → main / root → Save**
4. Aguardar 1-2min. Link: `https://SEU_USER.github.io/iron-treino/`
5. Abrir no Chrome do celular → menu → **Instalar app**
6. Vira ícone na tela inicial, funciona offline

### Opção 2 — Teste local

```bash
python3 -m http.server 8080
```
Acessar `http://localhost:8080`

### Opção 3 — Netlify Drop

https://app.netlify.com/drop → arrastar a pasta → link HTTPS na hora

## Funcionalidades

### Treino
- 7 dias mapeados · escolha entre **6d** (ideal) ou **5d** (conservador)
- Toque no exercício pra marcar como feito
- Contador de semana · badge de "deload em X sem"
- Quando entra a semana de deload, séries são automaticamente reduzidas e aparece banner amarelo

### Readiness (novo)
- 4 sliders: sono, energia, dor muscular (DOMS), humor
- Score 0-100 com recomendação automática:
  - **80+** → tente progressão / PR
  - **60-79** → treino normal
  - **40-59** → reduzir carga 10-15%
  - **<40** → treino leve ou off
- Preserva histórico por data

### Dieta
- 5 refeições · 3000 kcal / 180g ptn
- Lista de substituições e suplementos

### Timer
- Presets 45s / 60s / 90s / 2m / 3m
- Som + vibração ao terminar

### Stats
- Barras de progresso treino/dieta
- Reset do dia e reset total

## Estrutura

```
index.html        → interface
app.js            → lógica + dados treino/dieta/readiness
manifest.json     → PWA
sw.js             → service worker offline
icon-192.png
icon-512.png
```

## Personalização

Tudo em `app.js`:
- `SPLITS` — divisão semanal (6d / 5d)
- `WORKOUTS` — exercícios por treino
- `MEALS` — refeições
- `state.deloadEvery` — frequência de deload (padrão 5 semanas)

## Lembretes importantes

- Exames periódicos: hemograma, lipidograma, função hepática/renal, PSA
- Pressão arterial semanal
- Sono ≥ 7h
- Cardio 2x/sem inegociável
- Hidratação 3.5-4L/dia
