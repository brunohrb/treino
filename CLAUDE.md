# CLAUDE.md — Guia de contexto pro Claude Code

Arquivo lido automaticamente em toda nova sessão. Mantém o Claude ciente do projeto sem precisar reexplicar tudo.

## Sobre o projeto

**BHR Treinos** — PWA pessoal de treino, bioimpedância, exames, scanner corporal e relatórios. Single-page, single-file (`index.html` com ~6800 linhas, HTML + CSS + JS embutidos). Usa Supabase (RLS + JSONB) pra persistência multi-device. Integração com OpenAI pra gerar treinos e analisar exames/scans.

100% do uso é pelo iPhone — qualquer mudança visual deve ser pensada mobile-first. O app está instalado como PWA na tela de início (manifest + service-worker).

## Stack

- Frontend: **HTML/CSS/JS puro** num único arquivo (`index.html`)
- Backend: **Supabase** (`https://hisbbtddpoxufvghxqtm.supabase.co`, schema `treino`)
- IA: **OpenAI API** (gpt-4o-mini default, gpt-4o e gpt-4 disponíveis) — chave salva em localStorage do user
- PWA: `manifest.json` + `service-worker.js` (network-first HTML, cache-first estáticos)
- Deploy: **GitHub Pages** servindo `main` em `https://brunohrb.github.io/treino/`

Sem framework, sem build step, sem package.json. Só editar `index.html` e mandar pra `main`.

## Convenções importantes

### Branches e deploy
- Desenvolva sempre numa branch nova `claude/<assunto>`
- Abra PR pra `main`. **Não merge sem o usuário pedir.**
- Após merge em `main`, o GitHub Pages republica em ~1-2 min
- Veja status em https://github.com/brunohrb/treino/actions

### Estilo de código
- Comentários em **português brasileiro**
- Funções utilitárias internas começam com `_` (ex: `_beepFim`, `_iniciarAudioKeepalive`)
- Estado global em variáveis `let _xxx` no topo do bloco que usa (não tem módulos)
- Constantes em UPPER_SNAKE_CASE (`SUPABASE_URL`, `MAPA_GRUPOS`)
- IDs de DOM em camelCase (`restTimerFloat`, `loadingOverlay`)

### Mobile-first
- Touch targets **≥44px** em mobile (Apple HIG) — checar media query `@media (max-width: 768px)`
- Inputs com `font-size: 16px` no mobile pra evitar zoom automático do iOS ao focar
- Sempre usar `env(safe-area-inset-*)` quando posicionar fixos no topo/rodapé
- Animações suaves com `:active { transform: scale(0.96); }` pra feedback tátil
- Não quebrar `prefers-reduced-motion`

### Supabase
- Todas as tabelas usam o padrão JSONB blob: `user_id` (PK), `record_content` (JSONB), `updated_at`
- Tabelas: `bhr_perfis`, `bhr_treinos`, `bhr_sessoes`, `bhr_bio`, `bhr_exames`, `bhr_atividades`, `bhr_scans`
- RLS ligado em todas: política `auth.uid()::text = user_id`
- Sempre testar com `eq('user_id', USER_ID)` nas queries

### IA (OpenAI)
- Função central: `callIA(prompt, contexto)` em ~linha 3490
- `contexto = 'treino'` ativa system prompt especializado + `response_format: json_object` (em GPT-4o)
- Custo é trackeado em `localStorage['bhr_ia_gastos']` e exibido na aba Perfil
- Modelos disponíveis: `gpt-4o-mini` (default), `gpt-4o`, `gpt-4`

## Áreas críticas do código (com line ranges)

| Área | Linhas | Notas |
|------|--------|-------|
| CSS global | 40–2202 | Custom properties em `:root`. Sem framework. |
| Nav tabs (top) | 2212–2221 | 8 tabs scroll horizontal. NÃO há nav inferior. |
| Switch tabs | `switchTab()` ~3404 | Trata `?tab=...` deep links no fim do `<script>` |
| Auth (Supabase) | 3110–3230 | Login com nome (vira email interno `nome@bhr.treino`) |
| `callIA()` | ~3490 | Wrapper único pra OpenAI; tracking de custo embutido |
| `gerarTreinoIA()` | ~3690 | Pipeline completo de geração com validação e retry 3x |
| Prompt do treino | ~3986 | Reescrito 2026-04-16 com metodologia por objetivo + few-shot |
| `normalizarExercicio()` | ~3627 | Inclui novos campos: `carga_sugerida`, `descanso_seg`, `alternativa` |
| `renderTreino()` | ~4180 | Renderiza card do treino com aquecimento/alongamento/grupos |
| **Rest timer** | 6383–6620 | Reescrito 2026-04-16: timestamp absoluto, Wake Lock, audio keep-alive |
| PWA registration | 6700+ | Service worker + handler de `?tab=...` |

## Bugs históricos resolvidos (não regredir!)

1. **Timer perde tempo em background** (resolvido 2026-04-16): trocado decremento por timestamp absoluto. Use `Date.now()` pra calcular o restante, NÃO `restante--` em setInterval.
2. **Bipe não toca em fone Bluetooth com tela bloqueada** (resolvido 2026-04-16): pré-agenda os bipes via `osc.start(absoluteTime)` no AudioContext + `<audio>` silencioso em loop pra manter sessão de áudio viva no iOS.
3. **iOS abre PWA no Chrome em vez do Safari**: usar URL `x-safari-https://brunohrb.github.io/treino/` em atalhos do iOS quando Chrome é navegador padrão. No Apple Watch precisa ação "Continuar atalho no iPhone".

## Regras pessoais do Bruno

- Português BR sempre — em comentários, commits, PR titles
- Sem emojis em código a menos que peça
- Não criar testes automatizados (não tem suite)
- Não criar arquivos novos sem necessidade — preferir editar `index.html`
- Ao terminar uma sessão de implementação: **commit + push pra branch própria + abrir PR pra main** (não merge sozinho)
- Mensagens de commit: 1ª linha curta em pt-BR descrevendo o "porquê", body opcional com detalhes técnicos
- Quando em dúvida sobre escopo, **perguntar** antes de implementar feature extra
- Preferir mostrar diffs cirúrgicos a refactor amplo

## Coisas a NÃO fazer

- ❌ Não trocar `index.html` por múltiplos arquivos sem motivo forte
- ❌ Não adicionar bundler/framework
- ❌ Não quebrar a key da OpenAI no Git (fica em localStorage do user, nunca commit)
- ❌ Não mexer em `manifest.json` ou `service-worker.js` sem entender impacto no PWA já instalado
- ❌ Não criar PR sem o usuário pedir explicitamente
- ❌ Não fazer `git push --force` em `main`

## Workflow padrão de uma sessão

1. `git checkout main && git pull origin main`
2. `git checkout -b claude/<assunto-curto>`
3. Editar `index.html` (e arquivos PWA se for o caso)
4. `node -e "..."` rápido pra validar sintaxe inline JS (ver exemplo abaixo)
5. `git add -A && git commit -m "..."`
6. `git push -u origin claude/<assunto>`
7. Abrir PR via `mcp__github__create_pull_request` (só se o user pedir)

### Snippet pra validar JS inline

```bash
node -e "
const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const scripts = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)];
scripts.forEach((m, i) => {
  if (!m[1].trim()) return;
  try { new Function(m[1]); console.log('Script', i+1, 'OK'); }
  catch (e) { console.log('Script', i+1, 'FAIL:', e.message); }
});
"
```
