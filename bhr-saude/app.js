// ====================================================================
// BHR SAÚDE — treino · dieta · readiness · exames · bio · IA
// Estado local em localStorage (treino/dieta zera 00h).
// Exames, bio e chave Claude sincronizam via Supabase.
// ====================================================================

// ---------- DIVISÕES -------------------------------------------------
const SPLITS = {
  '6d': [
    { day: 'DOM', focus: 'OFF',      key: 'rest' },
    { day: 'SEG', focus: 'PEITO/TRI',key: 'push1' },
    { day: 'TER', focus: 'COSTAS/BI',key: 'pull1' },
    { day: 'QUA', focus: 'PERNA A',  key: 'legs1' },
    { day: 'QUI', focus: 'OMB/TRAP', key: 'shoulders' },
    { day: 'SEX', focus: 'BRAÇO',    key: 'arms' },
    { day: 'SAB', focus: 'PERNA B',  key: 'legs2' }
  ],
  '5d': [
    { day: 'DOM', focus: 'OFF',      key: 'rest' },
    { day: 'SEG', focus: 'PEITO/TRI',key: 'push1' },
    { day: 'TER', focus: 'COSTAS/BI',key: 'pull1' },
    { day: 'QUA', focus: 'OFF',      key: 'rest' },
    { day: 'QUI', focus: 'OMB/TRAP', key: 'shoulders' },
    { day: 'SEX', focus: 'BRAÇO',    key: 'arms' },
    { day: 'SAB', focus: 'PERNA',    key: 'legsfull' }
  ]
};

// ---------- TREINOS --------------------------------------------------
const WORKOUTS = {
  rest: {
    title: 'DESCANSO',
    rest: true,
    note: 'Caminhada leve 30min OPCIONAL. Alongamento. Hidratação ≥ 3L.'
  },
  push1: {
    title: 'PEITO · TRÍCEPS',
    duration: '60-70min',
    volume: '22 séries',
    exercises: [
      { name: 'Supino reto com barra', sets: '4x8-10', detail: 'Descanso 90s · Carga pesada' },
      { name: 'Supino inclinado halteres', sets: '4x10-12', detail: 'Descanso 75s · Inclinação 30°' },
      { name: 'Crucifixo inclinado', sets: '3x12-15', detail: 'Descanso 60s · Alongamento máximo' },
      { name: 'Crossover cabo', sets: '3x12-15', detail: 'Descanso 60s · Contração no centro' },
      { name: 'Paralelas (peito)', sets: '3x8-12', detail: 'Descanso 90s · Tronco inclinado' },
      { name: 'Tríceps pulley corda', sets: '4x10-12', detail: 'Descanso 60s · Abrir corda no final' },
      { name: 'Tríceps francês halteres', sets: '3x10-12', detail: 'Descanso 60s · Amplitude total' },
      { name: 'Tríceps testa barra W', sets: '3x12-15', detail: 'Descanso 45s · Finalizador' }
    ]
  },
  pull1: {
    title: 'COSTAS · BÍCEPS',
    duration: '75-85min',
    volume: '23 séries + cardio',
    exercises: [
      { name: 'Barra fixa (pegada aberta)', sets: '4xAMRAP', detail: 'Descanso 90s · Alternativa: puxada 4x8-10' },
      { name: 'Remada curvada barra', sets: '4x8-10', detail: 'Descanso 90s · Pegada pronada' },
      { name: 'Remada cavalinho (T-bar)', sets: '4x10-12', detail: 'Descanso 75s · Pegada neutra' },
      { name: 'Puxada frente fechada', sets: '3x12', detail: 'Descanso 60s · Pegada neutra/supinada' },
      { name: 'Remada unilateral halter', sets: '3x10-12 cada', detail: 'Descanso 60s · Foco contração' },
      { name: 'Pullover polia alta', sets: '3x15', detail: 'Descanso 45s · Alongamento máximo' },
      { name: 'Rosca direta barra W', sets: '4x8-10', detail: 'Descanso 75s · Sem balançar' },
      { name: 'Rosca alternada halteres', sets: '3x10-12', detail: 'Descanso 60s · Supinação completa' },
      { name: 'Rosca martelo', sets: '3x12', detail: 'Descanso 45s · Braquial + antebraço' },
      { name: 'CARDIO — Esteira/bike LISS', sets: '20min', detail: 'Zona 2 · FC 120-135 · pós-treino' }
    ]
  },
  legs1: {
    title: 'PERNA A · QUADRÍCEPS',
    duration: '50-60min',
    volume: '16 séries',
    exercises: [
      { name: 'Agachamento livre', sets: '4x8-10', detail: 'Descanso 2min · Abaixo paralelo' },
      { name: 'Leg press 45°', sets: '4x12-15', detail: 'Descanso 90s · Pés médios' },
      { name: 'Cadeira extensora', sets: '3x15', detail: 'Descanso 60s · Contração 1s topo' },
      { name: 'Mesa flexora', sets: '3x12', detail: 'Descanso 60s · Controle excêntrica' },
      { name: 'Elevação pélvica (hip thrust)', sets: '3x12', detail: 'Descanso 75s · Glúteo' },
      { name: 'Panturrilha em pé', sets: '4x15-20', detail: 'Descanso 45s · Amplitude total' },
      { name: 'Abdominal canivete', sets: '3x20', detail: 'Descanso 45s' }
    ]
  },
  shoulders: {
    title: 'OMBRO · TRAPÉZIO',
    duration: '75-80min',
    volume: '22 séries + cardio',
    exercises: [
      { name: 'Desenvolvimento militar barra', sets: '4x8-10', detail: 'Descanso 90s' },
      { name: 'Desenvolvimento halteres', sets: '4x10-12', detail: 'Descanso 75s · Sentado' },
      { name: 'Elevação lateral halteres', sets: '4x12-15', detail: 'Descanso 45s · Controle descida' },
      { name: 'Elevação lateral cabo (uni)', sets: '3x12 cada', detail: 'Descanso 45s' },
      { name: 'Elevação frontal halter/anilha', sets: '3x12', detail: 'Descanso 45s' },
      { name: 'Crucifixo invertido (peck deck)', sets: '4x12-15', detail: 'Descanso 60s · Deltoide posterior' },
      { name: 'Encolhimento halteres', sets: '4x12-15', detail: 'Descanso 60s · Pausa 1s topo' },
      { name: 'Remada alta cabo', sets: '3x12', detail: 'Descanso 45s · Pegada fechada' },
      { name: 'CARDIO — Esteira/bike LISS', sets: '20min', detail: 'Zona 2 · FC 120-135 · pós-treino' }
    ]
  },
  arms: {
    title: 'BRAÇO (BI+TRI+ANTE)',
    duration: '60min',
    volume: '24 séries · especialização',
    exercises: [
      { name: 'Rosca direta barra reta', sets: '4x8-10', detail: 'Descanso 75s · Carga progressiva' },
      { name: 'Tríceps testa barra W', sets: '4x10-12', detail: 'Descanso 75s · Emparelhado' },
      { name: 'Rosca Scott barra W', sets: '3x10-12', detail: 'Descanso 60s · Amplitude total' },
      { name: 'Tríceps pulley corda', sets: '3x12-15', detail: 'Descanso 60s' },
      { name: 'Rosca concentrada', sets: '3x12 cada', detail: 'Descanso 45s · Pico' },
      { name: 'Tríceps coice cabo (uni)', sets: '3x15 cada', detail: 'Descanso 45s · Bombeamento' },
      { name: 'Rosca martelo corda', sets: '4x12-15', detail: 'Descanso 45s · Braquial' },
      { name: 'Tríceps francês halter uni', sets: '3x12', detail: 'Descanso 45s' },
      { name: 'Rosca inversa barra W', sets: '3x15', detail: 'Descanso 45s · Antebraço' },
      { name: 'Flexão punho (antebraço)', sets: '3x20', detail: 'Descanso 30s' },
      { name: 'Abdominal infra', sets: '3x15', detail: 'Descanso 45s' }
    ]
  },
  legs2: {
    title: 'PERNA B + CARDIO',
    duration: '60min',
    volume: '14 séries + cardio',
    exercises: [
      { name: 'Stiff com barra', sets: '4x10-12', detail: 'Descanso 90s · Leve flexão joelho' },
      { name: 'Afundo halteres', sets: '3x10 cada', detail: 'Descanso 75s · Amplitude total' },
      { name: 'Cadeira flexora', sets: '4x12-15', detail: 'Descanso 60s · Posteriores' },
      { name: 'Cadeira abdutora', sets: '3x15-20', detail: 'Descanso 45s · Glúteo médio' },
      { name: 'Panturrilha sentado', sets: '4x15-20', detail: 'Descanso 45s · Sóleo' },
      { name: 'Prancha isométrica', sets: '3x45s', detail: 'Descanso 45s' },
      { name: 'CARDIO — Esteira/bike LISS', sets: '25min', detail: 'Zona 2 · FC 120-135 · pós-treino' }
    ]
  },
  legsfull: {
    title: 'PERNA COMPLETA + CARDIO',
    duration: '70-80min',
    volume: '18 séries + cardio',
    exercises: [
      { name: 'Agachamento livre', sets: '4x8-10', detail: 'Descanso 2min · Abaixo paralelo' },
      { name: 'Stiff com barra', sets: '4x10-12', detail: 'Descanso 90s · Posteriores' },
      { name: 'Leg press 45°', sets: '3x12-15', detail: 'Descanso 90s · Pés médios' },
      { name: 'Afundo halteres', sets: '3x10 cada', detail: 'Descanso 75s' },
      { name: 'Cadeira extensora', sets: '3x15', detail: 'Descanso 60s' },
      { name: 'Cadeira flexora', sets: '3x12-15', detail: 'Descanso 60s' },
      { name: 'Panturrilha em pé', sets: '4x15-20', detail: 'Descanso 45s' },
      { name: 'Abdominal canivete', sets: '3x20', detail: 'Descanso 45s' },
      { name: 'CARDIO — LISS', sets: '20min', detail: 'Zona 2 · FC 120-135' }
    ]
  }
};

// ---------- DIETA ----------------------------------------------------
// Cada refeição tem múltiplas opções — usuário escolhe uma por dia.
// skipOnFast: oculta quando Jejum 16h está ativo (janela alimentar 13h→20h30).
const MEALS = [
  {
    id: 'cafe', name: 'CAFÉ DA MANHÃ', time: '07:00', skipOnFast: true,
    options: [
      {
        label: 'Ovos + aveia',
        items: [
          '4 ovos inteiros + 3 claras mexidos',
          '80g aveia com 1 banana e canela',
          '1 colher (sopa) pasta de amendoim integral',
          '1 xícara café preto'
        ],
        macros: { kcal: 680, p: 42, c: 75, g: 20 }
      },
      {
        label: 'Omelete + tapioca',
        items: [
          '3 ovos + 4 claras em omelete com queijo cottage (50g)',
          '1 tapioca média (3 col sopa) com pasta de amendoim',
          '1 mamão papaia pequeno',
          'Café preto'
        ],
        macros: { kcal: 640, p: 44, c: 60, g: 22 }
      },
      {
        label: 'Iogurte + granola',
        items: [
          '300g iogurte natural desnatado',
          '1 scoop whey (30g) misturado',
          '50g granola sem açúcar + 1 banana',
          'Café preto'
        ],
        macros: { kcal: 620, p: 45, c: 70, g: 14 }
      }
    ]
  },
  {
    id: 'lanche1', name: 'LANCHE 1', time: '10:30', skipOnFast: true,
    options: [
      {
        label: 'Whey + castanhas',
        items: [
          '1 scoop whey (30g) com 300ml água',
          '50g castanhas (pará/caju/amêndoa)',
          '1 fruta (maçã, pera ou mamão)'
        ],
        macros: { kcal: 480, p: 28, c: 35, g: 24 }
      },
      {
        label: 'Sanduíche proteico',
        items: [
          '2 fatias pão integral',
          '100g peito de peru ou atum',
          '1 col (sopa) requeijão light',
          '1 fruta'
        ],
        macros: { kcal: 450, p: 32, c: 55, g: 10 }
      }
    ]
  },
  {
    id: 'almoco', name: 'ALMOÇO', time: '13:00',
    options: [
      {
        label: 'Frango + arroz+feijão',
        items: [
          '180g peito de frango grelhado',
          '150g arroz integral cozido + 1 concha feijão',
          'Salada verde à vontade + 1 colher azeite',
          '100g batata-doce ou legumes cozidos'
        ],
        macros: { kcal: 780, p: 50, c: 95, g: 18 }
      },
      {
        label: 'Patinho + mandioquinha',
        items: [
          '180g patinho moído refogado',
          '150g mandioquinha (baroa) ou mandioca',
          'Brócolis + couve refogados',
          '1 col azeite extravirgem'
        ],
        macros: { kcal: 760, p: 48, c: 85, g: 22 }
      },
      {
        label: 'Tilápia + arroz integral',
        items: [
          '200g tilápia grelhada (ou outro peixe branco)',
          '150g arroz integral',
          'Salada colorida + azeite',
          '1 laranja ou maçã'
        ],
        macros: { kcal: 700, p: 50, c: 85, g: 16 }
      }
    ]
  },
  {
    id: 'pre', name: 'PRÉ-TREINO', time: '16:30',
    options: [
      {
        label: 'Pão + peru',
        items: [
          '2 fatias pão integral ou 1 tapioca (3 col sopa)',
          '100g peito de peru ou frango desfiado',
          '1 banana com mel (1 col chá)',
          'Café preto ou cafeína 200mg'
        ],
        macros: { kcal: 520, p: 32, c: 80, g: 8 }
      },
      {
        label: 'Shake rápido',
        items: [
          '1 scoop whey (30g)',
          '1 banana média + 30g aveia',
          '300ml leite desnatado',
          'Cafeína 200mg (cápsula)'
        ],
        macros: { kcal: 480, p: 35, c: 70, g: 6 }
      }
    ]
  },
  {
    id: 'jantar', name: 'JANTAR (pós-treino)', time: '20:30',
    options: [
      {
        label: 'Carne + arroz',
        items: [
          '200g carne vermelha magra (patinho/coxão mole)',
          '150g arroz branco ou batata-doce',
          'Legumes no vapor (brócolis, abobrinha, cenoura)',
          '1 col azeite de oliva extravirgem'
        ],
        macros: { kcal: 740, p: 48, c: 80, g: 22 }
      },
      {
        label: 'Salmão + batata-doce',
        items: [
          '200g salmão grelhado',
          '150g batata-doce assada',
          'Aspargos ou brócolis',
          '1 col azeite'
        ],
        macros: { kcal: 720, p: 45, c: 65, g: 26 }
      },
      {
        label: 'Frango + macarrão integral',
        items: [
          '180g peito de frango em cubos',
          '120g (cru) macarrão integral com molho de tomate caseiro',
          'Salada + 1 col azeite',
          'Parmesão ralado (10g)'
        ],
        macros: { kcal: 720, p: 50, c: 90, g: 14 }
      }
    ]
  },
  {
    id: 'ceia', name: 'CEIA', time: '22:30', optional: true,
    options: [
      {
        label: 'Caseína lenta',
        items: [
          '1 scoop caseína (30g) com 200ml água ou leite desnatado',
          '20g amêndoas',
          'Chá de camomila ou erva-doce'
        ],
        macros: { kcal: 280, p: 28, c: 8, g: 14 }
      },
      {
        label: 'Cottage + fruta',
        items: [
          '200g queijo cottage',
          '1 kiwi ou 1/2 mamão',
          'Canela a gosto',
          '10g castanhas-do-pará (1 unidade)'
        ],
        macros: { kcal: 260, p: 26, c: 18, g: 10 }
      },
      {
        label: 'Claras + pasta de amendoim',
        items: [
          '6 claras mexidas (ou omelete)',
          '1 col (sopa) pasta de amendoim integral',
          '1 fatia pão integral (opcional)'
        ],
        macros: { kcal: 240, p: 25, c: 12, g: 12 }
      }
    ]
  }
];

// ---------- STATE ----------------------------------------------------
const STORAGE_KEY = 'iron-data-v2';
const todayKey = () => new Date().toISOString().slice(0, 10);
const getTodayIndex = () => new Date().getDay();

function defaultState() {
  return {
    date: todayKey(),
    split: '6d',           // '6d' ou '5d'
    weekNumber: 1,         // incrementa a cada segunda
    lastWeekIncrement: todayKey(),
    deloadEvery: 5,        // deload a cada X semanas (4-6 range comum)
    exercises: {},
    meals: {},              // { [mealId]: true/false }
    mealChoice: {},         // { [mealId]: optionIndex }
    fastToday: false,       // jejum 16h ativo hoje
    fastDays: {},           // { 'YYYY-MM-DD': true } — histórico de jejum
    fastTarget: 2,          // meta de jejum por semana
    selectedDay: getTodayIndex(),
    readiness: {}           // { 'YYYY-MM-DD': { sleep, energy, soreness, mood, score } }
  };
}

let state;

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    // migrate missing fields
    const base = defaultState();
    for (const k of Object.keys(base)) {
      if (parsed[k] === undefined) parsed[k] = base[k];
    }
    // reset daily progress
    if (parsed.date !== todayKey()) {
      // se jejum estava ativo ontem, registra no histórico semanal
      if (parsed.fastToday) parsed.fastDays[parsed.date] = true;
      parsed.date = todayKey();
      parsed.exercises = {};
      parsed.meals = {};
      parsed.fastToday = false;
      parsed.selectedDay = getTodayIndex();
      // increment week number every Monday
      if (getTodayIndex() === 1 && parsed.lastWeekIncrement !== todayKey()) {
        parsed.weekNumber++;
        parsed.lastWeekIncrement = todayKey();
      }
    }
    // migração: meals numéricos antigos (0,1,2...) → limpar
    if (parsed.meals && Object.keys(parsed.meals).some(k => /^\d+$/.test(k))) {
      parsed.meals = {};
    }
    return parsed;
  } catch {
    return defaultState();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  updateProgress();
  updateReadinessDisplay();
  updateDeloadBadge();
}

// ---------- DELOAD ---------------------------------------------------
function isDeloadWeek() {
  return state.weekNumber > 0 && state.weekNumber % state.deloadEvery === 0;
}

function applyDeloadModifier(sets) {
  // reduz séries em ~50% e pede reduzir carga 40%
  if (!isDeloadWeek()) return sets;
  const match = sets.match(/^(\d+)x(.+)$/);
  if (!match) return sets;
  const newSets = Math.max(2, Math.ceil(parseInt(match[1]) / 2));
  return `${newSets}x${match[2]}`;
}

// ---------- READINESS (0-100) ----------------------------------------
function computeReadinessScore(r) {
  // cada campo 1-5, soma ponderada
  const s = (r.sleep || 3) * 1.5 + (r.energy || 3) * 1.5 + (6 - (r.soreness || 3)) * 1.0 + (r.mood || 3) * 1.0;
  // max = 7.5 + 7.5 + 5 + 5 = 25 -> scale to 100
  return Math.round((s / 25) * 100);
}

function readinessAdvice(score) {
  if (score >= 80) return { level: 'ALTA', color: '#00d97e', text: 'Corpo pronto. Treine forte — pode tentar PR hoje.' };
  if (score >= 60) return { level: 'BOA', color: '#9bd200', text: 'Treino normal conforme plano.' };
  if (score >= 40) return { level: 'MÉDIA', color: '#ffb020', text: 'Reduza carga 10-15%. Mantenha séries.' };
  return { level: 'BAIXA', color: '#ff2d2d', text: 'Considere treino leve ou descanso. Corpo pedindo.' };
}

// ---------- RENDER: WEEK --------------------------------------------
function currentSplit() { return SPLITS[state.split]; }

function renderWeek() {
  const grid = document.getElementById('weekGrid');
  grid.innerHTML = '';
  const today = getTodayIndex();
  const split = currentSplit();
  split.forEach((d, i) => {
    const chip = document.createElement('div');
    chip.className = 'day-chip';
    if (i === state.selectedDay) chip.classList.add('active');
    if (i === today) chip.classList.add('today');
    chip.innerHTML = `<div class="day-name">${d.day}</div><div class="day-focus">${d.focus}</div>`;
    chip.onclick = () => {
      state.selectedDay = i;
      saveState();
      renderWeek();
      renderWorkout();
    };
    grid.appendChild(chip);
  });
}

// ---------- RENDER: WORKOUT -----------------------------------------
function renderWorkout() {
  const container = document.getElementById('workoutContainer');
  const dayData = currentSplit()[state.selectedDay];
  const w = WORKOUTS[dayData.key];

  if (w.rest) {
    container.innerHTML = `
      <div class="rest-card">
        <h3>DESCANSO</h3>
        <p>${w.note}</p>
      </div>
      <div class="info-block">
        <h4>DIA DE RECUPERAÇÃO</h4>
        <p>Hipertrofia acontece no descanso. Aproveita pra dormir bem, comer todas as refeições e hidratação 3.5L+.
        Se sentir ansiedade, caminhada leve 30min — mas <strong>sem treino de força</strong>.</p>
      </div>
    `;
    updateProgress();
    return;
  }

  const deload = isDeloadWeek();
  const deloadBanner = deload ? `
    <div class="deload-banner">
      🔋 SEMANA DE DELOAD (${state.weekNumber}ª sem) · Reduza cargas 40% · Séries já ajustadas
    </div>
  ` : '';

  const exercisesHTML = w.exercises.map((ex, idx) => {
    const key = `${dayData.key}-${idx}`;
    const done = state.exercises[key];
    const adjustedSets = applyDeloadModifier(ex.sets);
    return `
      <div class="exercise ${done ? 'done' : ''}" data-key="${key}">
        <div class="ex-check"></div>
        <div class="ex-body">
          <div class="ex-name">${ex.name}</div>
          <div class="ex-detail">${ex.detail}</div>
        </div>
        <div class="ex-sets">${adjustedSets}</div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    ${deloadBanner}
    <div class="workout-card displayed">
      <div class="workout-header">
        <div class="workout-title">${w.title}</div>
        <div class="workout-meta">
          <span>⏱ <strong>${w.duration}</strong></span>
          <span>📊 <strong>${w.volume}</strong></span>
        </div>
      </div>
      <div class="exercises">${exercisesHTML}</div>
    </div>
  `;

  container.querySelectorAll('.exercise').forEach(el => {
    el.onclick = () => {
      const key = el.dataset.key;
      state.exercises[key] = !state.exercises[key];
      el.classList.toggle('done');
      saveState();
    };
  });

  updateProgress();
}

// ---------- RENDER: MEALS -------------------------------------------
function mealsAtivasHoje() {
  return MEALS.filter(m => !(state.fastToday && m.skipOnFast));
}

function jejumCountSemana() {
  // conta dias marcados como jejum na semana corrente (dom→sáb)
  const today = new Date();
  const dow = today.getDay();
  const inicio = new Date(today); inicio.setDate(today.getDate() - dow);
  inicio.setHours(0, 0, 0, 0);
  let n = 0;
  for (const d in state.fastDays) {
    if (state.fastDays[d] && new Date(d) >= inicio) n++;
  }
  if (state.fastToday) n++;
  return n;
}

function renderMeals() {
  const container = document.getElementById('mealsContainer');
  const ativas = mealsAtivasHoje();

  // Barra de modo + contador de jejum
  const jej = jejumCountSemana();
  const meta = state.fastTarget || 2;
  const barraModo = `
    <div class="diet-mode">
      <div class="diet-mode-title">
        <span class="diet-mode-label">MODO HOJE</span>
        <span class="diet-jejum-counter">JEJUM ${jej}/${meta} ESTA SEMANA</span>
      </div>
      <div class="diet-mode-toggle">
        <button class="diet-mode-btn ${!state.fastToday ? 'active' : ''}" data-mode="normal">NORMAL<small>6 refeições</small></button>
        <button class="diet-mode-btn ${state.fastToday ? 'active' : ''}" data-mode="fast">JEJUM 16H<small>janela 13h → 22h</small></button>
      </div>
      ${state.fastToday ? '<div class="diet-fast-note">🕐 Primeira refeição 13h · última 22h · água, café preto e chá liberados no jejum</div>' : ''}
    </div>
  `;

  const cards = ativas.map(m => {
    const chosenIdx = state.mealChoice[m.id] ?? 0;
    const opt = m.options[chosenIdx] || m.options[0];
    const done = !!state.meals[m.id];
    const items = opt.items.map(i => `<li>${i}</li>`).join('');

    const optChips = m.options.length > 1 ? `
      <div class="meal-options">
        ${m.options.map((o, i) => `
          <button class="opt-chip ${i === chosenIdx ? 'active' : ''}" data-meal="${m.id}" data-opt="${i}">${o.label}</button>
        `).join('')}
      </div>
    ` : '';

    return `
      <div class="meal-card ${done ? 'done' : ''} ${m.optional ? 'optional' : ''}" data-meal="${m.id}">
        <div class="meal-header">
          <div class="meal-name">${m.name}${m.optional ? ' <span class="opt-tag">opcional</span>' : ''}</div>
          <div class="meal-time">${m.time}</div>
        </div>
        ${optChips}
        <ul class="meal-items">${items}</ul>
        <div class="meal-macros">
          <span>${opt.macros.kcal}kcal</span>
          <span>P ${opt.macros.p}g</span>
          <span>C ${opt.macros.c}g</span>
          <span>G ${opt.macros.g}g</span>
        </div>
      </div>
    `;
  }).join('');

  // Totais calculados com opção escolhida
  const tot = ativas.reduce((acc, m) => {
    const idx = state.mealChoice[m.id] ?? 0;
    const o = m.options[idx] || m.options[0];
    acc.kcal += o.macros.kcal; acc.p += o.macros.p; acc.c += o.macros.c; acc.g += o.macros.g;
    return acc;
  }, { kcal: 0, p: 0, c: 0, g: 0 });

  const totais = `
    <div class="meal-totals">
      <div class="meal-totals-label">TOTAL DO DIA</div>
      <div class="meal-totals-grid">
        <div><strong>${tot.kcal}</strong><small>kcal</small></div>
        <div><strong>${tot.p}</strong><small>ptn</small></div>
        <div><strong>${tot.c}</strong><small>carb</small></div>
        <div><strong>${tot.g}</strong><small>gord</small></div>
      </div>
    </div>
  `;

  container.innerHTML = barraModo + cards + totais;

  // Click nos cards → toggle done (ignora cliques em chips)
  container.querySelectorAll('.meal-card').forEach(el => {
    el.onclick = (ev) => {
      if (ev.target.closest('.opt-chip')) return;
      const id = el.dataset.meal;
      state.meals[id] = !state.meals[id];
      el.classList.toggle('done');
      saveState();
    };
  });

  // Chips pra trocar opção
  container.querySelectorAll('.opt-chip').forEach(chip => {
    chip.onclick = (ev) => {
      ev.stopPropagation();
      const mealId = chip.dataset.meal;
      const optIdx = +chip.dataset.opt;
      state.mealChoice[mealId] = optIdx;
      saveState();
      renderMeals();
    };
  });

  // Toggle de modo normal/jejum
  container.querySelectorAll('.diet-mode-btn').forEach(btn => {
    btn.onclick = () => {
      const mode = btn.dataset.mode;
      state.fastToday = (mode === 'fast');
      // ao entrar em jejum, desmarca café e lanche 1
      if (state.fastToday) {
        state.meals.cafe = false;
        state.meals.lanche1 = false;
      }
      saveState();
      renderMeals();
    };
  });
}

// ---------- PROGRESS ------------------------------------------------
function updateProgress() {
  const dayKey = currentSplit()[state.selectedDay].key;
  const dayWorkout = WORKOUTS[dayKey];
  if (!dayWorkout.rest) {
    const total = dayWorkout.exercises.length;
    const done = dayWorkout.exercises.filter((_, i) => state.exercises[`${dayKey}-${i}`]).length;
    const pct = total > 0 ? (done / total) * 100 : 0;
    document.getElementById('barTreino').style.width = pct + '%';
    document.getElementById('valTreino').textContent = `${done} / ${total}`;
  } else {
    document.getElementById('barTreino').style.width = '100%';
    document.getElementById('valTreino').textContent = 'OFF';
  }

  const ativas = mealsAtivasHoje();
  const mealsDone = ativas.filter(m => state.meals[m.id]).length;
  const mealsTotal = ativas.length;
  const mealsPct = mealsTotal > 0 ? (mealsDone / mealsTotal) * 100 : 0;
  document.getElementById('barDieta').style.width = mealsPct + '%';
  document.getElementById('valDieta').textContent = `${mealsDone} / ${mealsTotal}${state.fastToday ? ' · JEJUM' : ''}`;

  // week counter
  const wc = document.getElementById('weekCounter');
  if (wc) wc.textContent = `SEM ${state.weekNumber}`;
  const wd = document.getElementById('weekDisplay');
  if (wd) wd.textContent = state.weekNumber;
}

// ---------- READINESS UI --------------------------------------------
function updateReadinessDisplay() {
  const today = state.readiness[todayKey()];
  const scoreEl = document.getElementById('readinessScore');
  const labelEl = document.getElementById('readinessLabel');
  const adviceEl = document.getElementById('readinessAdvice');
  const headerBadge = document.getElementById('headerReadiness');

  if (!today) {
    scoreEl.textContent = '—';
    scoreEl.style.color = 'var(--ink-dim)';
    labelEl.textContent = 'Preencha abaixo';
    adviceEl.textContent = 'Avalie como você acordou hoje pra ajustar o treino.';
    if (headerBadge) headerBadge.textContent = '—';
    return;
  }
  const advice = readinessAdvice(today.score);
  scoreEl.textContent = today.score;
  scoreEl.style.color = advice.color;
  labelEl.textContent = advice.level;
  labelEl.style.color = advice.color;
  adviceEl.textContent = advice.text;
  if (headerBadge) {
    headerBadge.textContent = today.score;
    headerBadge.style.color = advice.color;
  }

  // reflect slider values
  ['sleep','energy','soreness','mood'].forEach(k => {
    const slider = document.getElementById('rd-' + k);
    const valEl = document.getElementById('rdv-' + k);
    if (slider && today[k] !== undefined) {
      slider.value = today[k];
      if (valEl) valEl.textContent = today[k];
    }
  });
}

function saveReadiness() {
  const r = {
    sleep: +document.getElementById('rd-sleep').value,
    energy: +document.getElementById('rd-energy').value,
    soreness: +document.getElementById('rd-soreness').value,
    mood: +document.getElementById('rd-mood').value,
  };
  r.score = computeReadinessScore(r);
  state.readiness[todayKey()] = r;
  saveState();
}

function updateDeloadBadge() {
  const badge = document.getElementById('deloadBadge');
  if (!badge) return;
  if (isDeloadWeek()) {
    badge.textContent = '⚡ DELOAD';
    badge.style.display = 'inline-block';
  } else {
    const remaining = state.deloadEvery - (state.weekNumber % state.deloadEvery);
    badge.textContent = `deload em ${remaining}sem`;
    badge.style.display = 'inline-block';
  }
}

// ---------- TABS ----------------------------------------------------
document.querySelectorAll('.tab').forEach(tab => {
  tab.onclick = () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('view-' + tab.dataset.view).classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
});

// ---------- TIMER ---------------------------------------------------
let timerDuration = 90;
let timerRemaining = 90;
let timerInterval = null;
let timerRunning = false;
const display = document.getElementById('timerDisplay');
const label = document.getElementById('timerLabel');
const startBtn = document.getElementById('timerStart');

function fmtTime(s) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
}

function updateTimerDisplay() { display.textContent = fmtTime(timerRemaining); }

function startTimer() {
  if (timerRunning) {
    clearInterval(timerInterval);
    timerRunning = false;
    startBtn.textContent = 'CONTINUAR';
    display.classList.remove('running');
    label.textContent = 'PAUSADO';
    return;
  }
  timerRunning = true;
  startBtn.textContent = 'PAUSAR';
  display.classList.add('running');
  label.textContent = 'DESCANSANDO';
  timerInterval = setInterval(() => {
    timerRemaining--;
    updateTimerDisplay();
    if (timerRemaining <= 0) {
      clearInterval(timerInterval);
      timerRunning = false;
      display.classList.remove('running');
      label.textContent = 'TERMINOU — PRÓXIMA SÉRIE';
      startBtn.textContent = 'INICIAR';
      timerRemaining = timerDuration;
      if ('vibrate' in navigator) navigator.vibrate([300, 100, 300, 100, 300]);
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.value = 880;
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.start(); osc.stop(ctx.currentTime + 0.5);
      } catch (e) {}
      setTimeout(() => {
        updateTimerDisplay();
        label.textContent = 'PRONTO';
      }, 2000);
    }
  }, 1000);
}

startBtn.onclick = startTimer;

document.getElementById('timerReset').onclick = () => {
  clearInterval(timerInterval);
  timerRunning = false;
  timerRemaining = timerDuration;
  startBtn.textContent = 'INICIAR';
  display.classList.remove('running');
  label.textContent = 'PRONTO';
  updateTimerDisplay();
};

document.querySelectorAll('.timer-btn[data-sec]').forEach(btn => {
  btn.onclick = () => {
    timerDuration = parseInt(btn.dataset.sec);
    timerRemaining = timerDuration;
    clearInterval(timerInterval);
    timerRunning = false;
    startBtn.textContent = 'INICIAR';
    display.classList.remove('running');
    label.textContent = 'PRONTO';
    updateTimerDisplay();
  };
});

// ---------- SPLIT TOGGLE --------------------------------------------
function updateSplitToggle() {
  document.querySelectorAll('.split-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.split === state.split);
  });
}

document.querySelectorAll('.split-btn').forEach(btn => {
  btn.onclick = () => {
    state.split = btn.dataset.split;
    state.exercises = {};
    state.selectedDay = getTodayIndex();
    saveState();
    updateSplitToggle();
    renderWeek();
    renderWorkout();
  };
});

// ---------- READINESS SLIDERS ---------------------------------------
['sleep','energy','soreness','mood'].forEach(k => {
  const slider = document.getElementById('rd-' + k);
  const valEl = document.getElementById('rdv-' + k);
  slider.addEventListener('input', () => {
    valEl.textContent = slider.value;
  });
  slider.addEventListener('change', saveReadiness);
});

// ---------- WEEK CONTROLS -------------------------------------------
document.getElementById('weekMinus').onclick = () => {
  if (state.weekNumber > 1) { state.weekNumber--; saveState(); renderWorkout(); }
};
document.getElementById('weekPlus').onclick = () => {
  state.weekNumber++; saveState(); renderWorkout();
};

// ---------- RESET ---------------------------------------------------
document.getElementById('resetDay').onclick = () => {
  if (confirm('Zerar todo o progresso de hoje?')) {
    state.exercises = {};
    state.meals = {};
    saveState();
    renderWorkout();
    renderMeals();
  }
};

document.getElementById('resetAll').onclick = () => {
  if (confirm('ATENÇÃO: isso apaga TODOS os dados (readiness, semana, progresso). Continuar?')) {
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  }
};

// ---------- INSTALL -------------------------------------------------
let deferredPrompt;
const installBanner = document.getElementById('installBanner');
const installBtn = document.getElementById('installBtn');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBanner.classList.add('show');
});

installBtn.onclick = async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  if (outcome === 'accepted') installBanner.classList.remove('show');
  deferredPrompt = null;
};

// ---------- INIT ----------------------------------------------------
state = loadState();
renderWeek();
renderWorkout();
renderMeals();
updateTimerDisplay();
updateProgress();
updateSplitToggle();
updateReadinessDisplay();
updateDeloadBadge();

// ====================================================================
// SAÚDE — integração Supabase (reusa bhr_exames e bhr_bio do app BHR)
// ====================================================================
const SUPABASE_URL = 'https://hisbbtddpoxufvghxqtm.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhpc2JidGRkcG94dWZ2Z2h4cXRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMDM0OTgsImV4cCI6MjA4Nzc3OTQ5OH0.r3VkLkBxeorkCYjB-y6WOchePdfRKsm5lWE1iSSYlrw';

let sb = null;
let ironUser = null;
let ironUserId = null;
let bioData = [];
let examesData = [];
let bioChart = null;
let examesChart = null;

function initSupabase() {
  if (typeof window.supabase === 'undefined') { setTimeout(initSupabase, 120); return; }
  try {
    sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, { db: { schema: 'treino' } });
    restoreSession();
  } catch (e) { console.error('Supabase init falhou:', e); }
}

// Mesma função que o BHR usa: nome → email interno
function nomeParaEmail(nome) {
  const limpo = (nome || '').toString().trim().toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
  return limpo ? `${limpo}@bhr.treino` : '';
}

async function restoreSession() {
  if (!sb) return;
  try {
    const { data: { session } } = await sb.auth.getSession();
    if (session && session.user) {
      ironUser = session.user;
      ironUserId = session.user.id;
      onLogado();
    }
  } catch (e) { console.warn('Sessão não recuperada:', e); }
}

function setAuthStatus(msg, type) {
  const el = document.getElementById('authStatus');
  if (!el) return;
  el.textContent = msg || '';
  el.className = 'auth-status' + (type ? ' ' + type : '');
}

async function handleEntrar() {
  if (!sb) { setAuthStatus('Aguardando Supabase...', 'error'); return; }
  const nome = document.getElementById('authNome').value.trim();
  const senha = document.getElementById('authSenha').value;
  const email = nomeParaEmail(nome);
  if (!email || !senha) { setAuthStatus('Preencha nome e senha', 'error'); return; }
  setAuthStatus('Entrando...', '');
  try {
    const { data, error } = await sb.auth.signInWithPassword({ email, password: senha });
    if (error) { setAuthStatus('Erro: ' + error.message, 'error'); return; }
    ironUser = data.user;
    ironUserId = data.user.id;
    setAuthStatus('Conectado!', 'success');
    onLogado();
  } catch (e) { setAuthStatus('Falha: ' + e.message, 'error'); }
}

async function handleSair() {
  if (!sb) return;
  try { await sb.auth.signOut(); } catch {}
  ironUser = null; ironUserId = null;
  bioData = []; examesData = [];
  claudeKeyCache = null;
  if (bioChart) { bioChart.destroy(); bioChart = null; }
  if (examesChart) { examesChart.destroy(); examesChart = null; }
  document.getElementById('syncBar').style.display = 'none';
  document.getElementById('authCard').style.display = 'block';
  document.getElementById('saudeConteudo').style.display = 'none';
}

function onLogado() {
  document.getElementById('authCard').style.display = 'none';
  document.getElementById('saudeConteudo').style.display = 'block';
  document.getElementById('syncBar').style.display = 'flex';
  const nome = (ironUser.email || '').replace('@bhr.treino', '');
  document.getElementById('syncUser').textContent = nome.toUpperCase();
  carregarSaude();
  loadKeyFromSupabase();
}

async function carregarSaude() {
  if (!sb || !ironUserId) return;
  try {
    const { data: bioRow } = await sb.from('bhr_bio')
      .select('record_content').eq('user_id', ironUserId).maybeSingle();
    bioData = Array.isArray(bioRow?.record_content) ? bioRow.record_content : [];
    const { data: exRow } = await sb.from('bhr_exames')
      .select('record_content').eq('user_id', ironUserId).maybeSingle();
    examesData = Array.isArray(exRow?.record_content) ? exRow.record_content : [];
    renderBio();
    renderExames();
  } catch (e) { console.error('Erro ao carregar saúde:', e); }
}

// ---------- BIO RENDER ----------------------------------------------
function renderBio() {
  const metricsEl = document.getElementById('bioMetrics');
  const wrapEl = document.getElementById('bioChartWrap');
  const emptyEl = document.getElementById('bioEmpty');
  if (!bioData || bioData.length === 0) {
    metricsEl.innerHTML = '';
    wrapEl.style.display = 'none';
    emptyEl.style.display = 'block';
    return;
  }
  emptyEl.style.display = 'none';
  const ordenado = [...bioData].sort((a, b) => new Date(a.data) - new Date(b.data));
  const atual = ordenado[ordenado.length - 1];
  const anterior = ordenado.length > 1 ? ordenado[ordenado.length - 2] : null;

  function delta(campo, invertido = false) {
    if (!anterior) return { txt: '—', cls: 'neutral' };
    const d = parseFloat(atual[campo]) - parseFloat(anterior[campo]);
    if (Math.abs(d) < 0.05) return { txt: '0', cls: 'neutral' };
    const sign = d > 0 ? '+' : '';
    // pra gordura subir é ruim; pra massa subir é bom
    const good = invertido ? d < 0 : d > 0;
    return { txt: `${sign}${d.toFixed(1)}`, cls: good ? 'down' : 'up' };
  }

  const dPeso = delta('peso', true);
  const dGord = delta('gordura', true);
  const dMassa = delta('massa', false);
  const dAgua = delta('agua', false);

  metricsEl.innerHTML = `
    <div class="metric-card">
      <div class="metric-value">${atual.peso || '—'}<span class="metric-unit">kg</span></div>
      <div class="metric-label">Peso</div>
      <div class="metric-delta ${dPeso.cls}">${dPeso.txt}</div>
    </div>
    <div class="metric-card">
      <div class="metric-value">${atual.gordura || '—'}<span class="metric-unit">%</span></div>
      <div class="metric-label">Gordura</div>
      <div class="metric-delta ${dGord.cls}">${dGord.txt}</div>
    </div>
    <div class="metric-card">
      <div class="metric-value">${atual.massa || '—'}<span class="metric-unit">kg</span></div>
      <div class="metric-label">Massa</div>
      <div class="metric-delta ${dMassa.cls}">${dMassa.txt}</div>
    </div>
    <div class="metric-card">
      <div class="metric-value">${atual.agua || '—'}<span class="metric-unit">%</span></div>
      <div class="metric-label">Água</div>
      <div class="metric-delta ${dAgua.cls}">${dAgua.txt}</div>
    </div>
  `;

  wrapEl.style.display = 'block';
  const range = ordenado.length > 1
    ? `${new Date(ordenado[0].data).toLocaleDateString('pt-BR')} → ${new Date(atual.data).toLocaleDateString('pt-BR')}`
    : new Date(atual.data).toLocaleDateString('pt-BR');
  document.getElementById('bioChartRange').textContent = range;

  const labels = ordenado.map(b => new Date(b.data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }));
  const ds = [
    { label: 'Peso (kg)', data: ordenado.map(b => +b.peso || null), borderColor: '#ff2d2d', backgroundColor: 'rgba(255,45,45,0.1)', tension: 0.35, yAxisID: 'y' },
    { label: 'Gordura (%)', data: ordenado.map(b => +b.gordura || null), borderColor: '#ffb020', backgroundColor: 'rgba(255,176,32,0.1)', tension: 0.35, yAxisID: 'y1' },
    { label: 'Massa (kg)', data: ordenado.map(b => +b.massa || null), borderColor: '#00d97e', backgroundColor: 'rgba(0,217,126,0.1)', tension: 0.35, yAxisID: 'y' },
  ];
  if (bioChart) bioChart.destroy();
  bioChart = new Chart(document.getElementById('bioChart'), {
    type: 'line',
    data: { labels, datasets: ds },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: { legend: { labels: { color: '#8a8a85', font: { size: 10, family: 'JetBrains Mono' } } } },
      scales: {
        x: { ticks: { color: '#8a8a85', font: { size: 9 } }, grid: { color: 'rgba(42,42,42,0.5)' } },
        y: { position: 'left', ticks: { color: '#8a8a85', font: { size: 9 } }, grid: { color: 'rgba(42,42,42,0.5)' } },
        y1: { position: 'right', ticks: { color: '#ffb020', font: { size: 9 } }, grid: { drawOnChartArea: false } }
      }
    }
  });
}

// ---------- EXAMES RENDER -------------------------------------------
function renderExames() {
  const listEl = document.getElementById('examesList');
  const wrapEl = document.getElementById('examesChartWrap');
  const emptyEl = document.getElementById('examesEmpty');

  if (!examesData || examesData.length === 0) {
    listEl.innerHTML = '';
    wrapEl.style.display = 'none';
    emptyEl.style.display = 'block';
    return;
  }
  emptyEl.style.display = 'none';
  const ordenado = [...examesData].sort((a, b) => new Date(b.data) - new Date(a.data));

  listEl.innerHTML = ordenado.slice(0, 8).map(e => {
    const temIA = e.analiseIA && e.analiseIA.analise_geral;
    const resumo = temIA ? e.analiseIA.analise_geral : (e.resultados || 'Sem análise');
    return `
      <div class="exam-item">
        <div class="exam-head">
          <div class="exam-type">${(e.tipo || 'Exame').toUpperCase()}</div>
          <div class="exam-date">${new Date(e.data).toLocaleDateString('pt-BR')}</div>
        </div>
        ${e.arquivo ? `<div style="font-family:var(--font-mono);font-size:10px;color:var(--accent);letter-spacing:0.08em;">${e.arquivo}</div>` : ''}
        <div class="exam-ia">${resumo}</div>
      </div>
    `;
  }).join('');

  // gráfico: agrupa marcadores principais
  const comIA = ordenado.filter(e => e.analiseIA && e.analiseIA.resultados_principais);
  if (comIA.length < 2) { wrapEl.style.display = 'none'; return; }

  const parametros = {};
  comIA.forEach(e => {
    e.analiseIA.resultados_principais.forEach(r => {
      const v = parseFloat((r.valor || '').toString().match(/[\d.]+/)?.[0]);
      if (isNaN(v)) return;
      if (!parametros[r.parametro]) parametros[r.parametro] = [];
      parametros[r.parametro].push({ data: e.data, valor: v });
    });
  });

  const topParametros = Object.keys(parametros).slice(0, 5);
  if (topParametros.length === 0) { wrapEl.style.display = 'none'; return; }

  wrapEl.style.display = 'block';
  const datas = [...new Set(comIA.map(e => e.data))].sort((a, b) => new Date(a) - new Date(b));
  const labels = datas.map(d => new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }));
  const cores = ['#ff2d2d', '#ffb020', '#00d97e', '#8a8afc', '#fc6e9b'];
  const datasets = topParametros.map((p, i) => ({
    label: p,
    data: datas.map(d => {
      const entry = parametros[p].find(x => x.data === d);
      return entry ? entry.valor : null;
    }),
    borderColor: cores[i],
    backgroundColor: cores[i] + '20',
    tension: 0.35,
    spanGaps: true
  }));

  document.getElementById('examesChartRange').textContent = `${labels[0]} → ${labels[labels.length - 1]}`;
  if (examesChart) examesChart.destroy();
  examesChart = new Chart(document.getElementById('examesChart'), {
    type: 'line',
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: { legend: { labels: { color: '#8a8a85', font: { size: 10, family: 'JetBrains Mono' } } } },
      scales: {
        x: { ticks: { color: '#8a8a85', font: { size: 9 } }, grid: { color: 'rgba(42,42,42,0.5)' } },
        y: { ticks: { color: '#8a8a85', font: { size: 9 } }, grid: { color: 'rgba(42,42,42,0.5)' } }
      }
    }
  });
}

// ====================================================================
// CLAUDE API — análise IA + geração de treino/dieta
// Chave armazenada em Supabase (tabela bhr_config, RLS por user_id).
// Nunca em localStorage nem commitada no git.
// ====================================================================
const CLAUDE_MODEL = 'claude-sonnet-4-6';
let claudeKeyCache = null;  // cache em memória após 1ª leitura

async function getClaudeKey() {
  if (claudeKeyCache) return claudeKeyCache;
  if (!sb || !ironUserId) return '';
  try {
    const { data } = await sb.from('bhr_config')
      .select('record_content').eq('user_id', ironUserId).maybeSingle();
    claudeKeyCache = data?.record_content?.claude_key || '';
    return claudeKeyCache;
  } catch (e) {
    console.warn('bhr_config não encontrada:', e.message);
    return '';
  }
}

async function setClaudeKey(k) {
  if (!sb || !ironUserId) throw new Error('Faça login primeiro');
  const payload = {
    user_id: ironUserId,
    record_content: { claude_key: k, updated_at: new Date().toISOString() },
    updated_at: new Date().toISOString()
  };
  const { error } = await sb.from('bhr_config').upsert(payload, { onConflict: 'user_id' });
  if (error) throw error;
  claudeKeyCache = k;
}

async function clearClaudeKeyCache() { claudeKeyCache = null; }

async function callClaude(systemPrompt, userPrompt, maxTokens = 1500) {
  const key = await getClaudeKey();
  if (!key) throw new Error('Configure sua chave Claude API primeiro (expanda "CONFIGURAR CHAVE" e cole sua key).');
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }]
    })
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Claude API ${res.status}: ${err.slice(0, 200)}`);
  }
  const data = await res.json();
  return data.content?.[0]?.text || '';
}

// Claude com arquivo (imagem ou PDF) — retorna JSON extraído
async function callClaudeWithFile(systemPrompt, userPrompt, fileBase64, mediaType, maxTokens = 3000) {
  const key = await getClaudeKey();
  if (!key) throw new Error('Configure sua chave Claude API primeiro.');
  const isImage = (mediaType || '').startsWith('image/');
  const contentBlock = isImage
    ? { type: 'image', source: { type: 'base64', media_type: mediaType, data: fileBase64 } }
    : { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: fileBase64 } };
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [
        { role: 'user', content: [contentBlock, { type: 'text', text: userPrompt }] },
        { role: 'assistant', content: [{ type: 'text', text: '{' }] }  // prefill pra forçar JSON
      ]
    })
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Claude API ${res.status}: ${err.slice(0, 300)}`);
  }
  const data = await res.json();
  let texto = '{' + (data.content?.[0]?.text || '');
  // Claude pode fechar com texto após o JSON — pega só até o último }
  const lastBrace = texto.lastIndexOf('}');
  if (lastBrace > 0) texto = texto.slice(0, lastBrace + 1);
  return JSON.parse(texto);
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      // dataURL → "data:image/jpeg;base64,AAAA..." — pega só a parte depois da vírgula
      const result = reader.result || '';
      const idx = result.indexOf(',');
      resolve(idx >= 0 ? result.slice(idx + 1) : result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ---------- ADD: BIOIMPEDÂNCIA ---------------------------------------
async function salvarBio(entry) {
  if (!sb || !ironUserId) throw new Error('Faça login primeiro');
  const novaLista = [...bioData, entry];
  const { error } = await sb.from('bhr_bio').upsert({
    user_id: ironUserId,
    record_content: novaLista,
    updated_at: new Date().toISOString()
  }, { onConflict: 'user_id' });
  if (error) throw error;
  bioData = novaLista;
  renderBio();
}

function abrirFormBio() {
  const form = document.getElementById('formBio');
  document.getElementById('bioData').value = todayKey();
  form.style.display = 'block';
  document.getElementById('btnNovaBio').style.display = 'none';
  document.getElementById('bioFormStatus').className = 'form-status';
  document.getElementById('bioFormStatus').textContent = '';
  document.getElementById('bioPeso').focus();
}

function fecharFormBio() {
  document.getElementById('formBio').style.display = 'none';
  document.getElementById('btnNovaBio').style.display = 'block';
  document.getElementById('formBio').reset();
}

async function handleSalvarBio(ev) {
  ev.preventDefault();
  const data = document.getElementById('bioData').value;
  const peso = parseFloat(document.getElementById('bioPeso').value);
  const gordura = parseFloat(document.getElementById('bioGordura').value);
  const massa = parseFloat(document.getElementById('bioMassa').value);
  const agua = parseFloat(document.getElementById('bioAgua').value);
  const altura = 1.76;
  const imc = (peso / (altura * altura)).toFixed(1);
  const status = document.getElementById('bioFormStatus');

  if (!data || isNaN(peso) || isNaN(gordura) || isNaN(massa) || isNaN(agua)) {
    status.className = 'form-status error';
    status.textContent = 'Preencha todos os campos';
    return;
  }

  status.className = 'form-status loading';
  status.textContent = 'Salvando no Supabase...';
  try {
    await salvarBio({ data, peso, gordura, massa, agua, imc });
    status.className = 'form-status success';
    status.textContent = '✓ Salvo!';
    setTimeout(fecharFormBio, 800);
  } catch (e) {
    status.className = 'form-status error';
    status.textContent = 'Erro: ' + e.message;
  }
}

// ---------- ADD: EXAME (Claude Vision) -------------------------------
async function handleUploadExame(file) {
  const statusEl = document.getElementById('exameUploadStatus');
  const btn = document.getElementById('btnNovoExame');
  const setStatus = (txt, cls = 'loading') => {
    statusEl.className = 'form-status ' + cls;
    statusEl.textContent = txt;
  };
  btn.disabled = true;
  try {
    setStatus('Lendo arquivo...');
    const base64 = await fileToBase64(file);
    const mediaType = file.type || (file.name.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'image/jpeg');

    setStatus('Claude analisando o exame (30-60s)...');
    const system = `Você é um médico especialista em análise de exames laboratoriais.
Analise a imagem ou PDF do exame recebido e retorne APENAS um objeto JSON válido (sem texto antes/depois, sem markdown), no formato:

{
  "tipo": "Hemograma completo" (ou "Perfil lipídico", "Glicemia", "Função hepática", "Função renal", "Hormônios", etc conforme o exame),
  "data": "YYYY-MM-DD" (data da coleta; se não achar, usa "${todayKey()}"),
  "analise_geral": "Texto 100-200 palavras em PT-BR: o que está normal, o que tem atenção, recomendações práticas. Sem disclaimer médico longo.",
  "resultados_principais": [
    { "parametro": "Hemoglobina", "valor": "15.2 g/dL", "referencia": "13.5-17.5", "status": "normal" },
    { "parametro": "Colesterol total", "valor": "220 mg/dL", "referencia": "<200", "status": "alto" }
  ]
}

Regras:
- status só pode ser: "normal", "baixo", "alto", "atencao"
- inclua até 20 marcadores principais (os mais relevantes)
- use exatamente os valores do exame, não invente
- se o arquivo não for um exame laboratorial válido, retorne { "erro": "não é um exame" }`;

    const result = await callClaudeWithFile(system, 'Analise este exame e retorne o JSON.', base64, mediaType, 3000);

    if (result.erro) {
      setStatus('Arquivo não parece um exame laboratorial: ' + result.erro, 'error');
      btn.disabled = false;
      return;
    }

    const novoExame = {
      id: Date.now(),
      data: result.data || todayKey(),
      tipo: result.tipo || 'Exame',
      arquivo: file.name,
      analiseIA: {
        analise_geral: result.analise_geral || '',
        resultados_principais: result.resultados_principais || []
      }
    };

    setStatus('Salvando no Supabase...');
    const novaLista = [...examesData, novoExame];
    const { error } = await sb.from('bhr_exames').upsert({
      user_id: ironUserId,
      record_content: novaLista,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' });
    if (error) throw error;
    examesData = novaLista;
    renderExames();
    setStatus(`✓ ${novoExame.tipo} salvo (${novoExame.analiseIA.resultados_principais.length} marcadores)`, 'success');
    setTimeout(() => { statusEl.textContent = ''; statusEl.className = 'form-status'; }, 4000);
  } catch (e) {
    console.error(e);
    setStatus('Erro: ' + e.message, 'error');
  } finally {
    btn.disabled = false;
    document.getElementById('exameFileInput').value = '';
  }
}

function contextoSaude() {
  const bioOrd = [...bioData].sort((a, b) => new Date(a.data) - new Date(b.data));
  const bioAtual = bioOrd[bioOrd.length - 1];
  const bioPrimeiro = bioOrd[0];
  const examesOrd = [...examesData].sort((a, b) => new Date(b.data) - new Date(a.data)).slice(0, 3);

  let texto = `# DADOS DO ATLETA\n`;
  texto += `Bruno · 40 anos · 1.76m · protocolo hipertrofia · split ${state.split} · semana ${state.weekNumber}${isDeloadWeek() ? ' (DELOAD)' : ''}\n\n`;

  if (bioAtual) {
    texto += `# BIOIMPEDÂNCIA ATUAL (${new Date(bioAtual.data).toLocaleDateString('pt-BR')})\n`;
    texto += `Peso: ${bioAtual.peso}kg · Gordura: ${bioAtual.gordura}% · Massa muscular: ${bioAtual.massa}kg · IMC: ${bioAtual.imc} · Água: ${bioAtual.agua}%\n`;
    if (bioPrimeiro && bioPrimeiro !== bioAtual) {
      texto += `Primeira medição (${new Date(bioPrimeiro.data).toLocaleDateString('pt-BR')}): Peso ${bioPrimeiro.peso}kg, Gordura ${bioPrimeiro.gordura}%, Massa ${bioPrimeiro.massa}kg\n`;
      texto += `Δ: peso ${(bioAtual.peso - bioPrimeiro.peso).toFixed(1)}kg · gordura ${(bioAtual.gordura - bioPrimeiro.gordura).toFixed(1)}% · massa ${(bioAtual.massa - bioPrimeiro.massa).toFixed(1)}kg\n`;
    }
    texto += `Total de medições: ${bioOrd.length}\n\n`;
  } else {
    texto += `# BIOIMPEDÂNCIA: sem dados\n\n`;
  }

  if (examesOrd.length > 0) {
    texto += `# ÚLTIMOS EXAMES (${examesOrd.length})\n`;
    examesOrd.forEach(e => {
      texto += `\n## ${e.tipo || 'Exame'} — ${new Date(e.data).toLocaleDateString('pt-BR')}\n`;
      if (e.analiseIA?.analise_geral) texto += `Análise: ${e.analiseIA.analise_geral}\n`;
      if (e.analiseIA?.resultados_principais) {
        e.analiseIA.resultados_principais.forEach(r => {
          texto += `- ${r.parametro}: ${r.valor}${r.status ? ` (${r.status})` : ''}${r.referencia ? ` · ref: ${r.referencia}` : ''}\n`;
        });
      } else if (e.resultados) {
        texto += e.resultados.slice(0, 300) + '\n';
      }
    });
    texto += `\n`;
  } else {
    texto += `# EXAMES: sem dados\n\n`;
  }

  const rToday = state.readiness[todayKey()];
  if (rToday) {
    texto += `# PRONTIDÃO HOJE: ${rToday.score}/100 (sono ${rToday.sleep}, energia ${rToday.energy}, dor ${rToday.soreness}, humor ${rToday.mood})\n`;
  }
  return texto;
}

function showIaOutput(txt) {
  const out = document.getElementById('iaOutput');
  out.textContent = txt;
  out.classList.add('show');
}

function setIaLoading(on, msg) {
  const out = document.getElementById('iaOutput');
  document.querySelectorAll('.ia-btn').forEach(b => b.disabled = on);
  if (on) { out.textContent = msg || 'Consultando Claude...'; out.classList.add('show'); }
}

async function analisarSaude() {
  if (!bioData.length && !examesData.length) {
    showIaOutput('Sem bio/exames ainda. Registre no app BHR Treinos antes.');
    return;
  }
  setIaLoading(true, 'Analisando seus exames + bio...');
  try {
    const system = `Você é um médico esportivo experiente. Responda em PT-BR, direto e prático, máximo 250 palavras. Aponte 3-5 pontos de atenção concretos baseados nos dados, e uma recomendação acionável para o treino/dieta atual. Evite disclaimers médicos longos.`;
    const user = contextoSaude() + `\n# TAREFA\nAnalise os dados acima e me diga: 1) o que está bom, 2) pontos de atenção, 3) 1-2 ajustes práticos no meu treino/dieta atual.`;
    const resp = await callClaude(system, user, 1200);
    showIaOutput(resp);
  } catch (e) { showIaOutput('Erro: ' + e.message); }
  finally { setIaLoading(false); }
}

async function gerarTreino() {
  setIaLoading(true, 'Gerando novo treino baseado nos seus dados...');
  try {
    const system = `Você é um personal trainer especializado em hipertrofia masculina. Responda em PT-BR. Proponha uma divisão de 6 dias (ou 5 se os dados sugerirem recuperação limitada) adequada ao atleta, considerando bio e exames. Formato: para cada dia, título + 6-10 exercícios com séries e descanso. Máximo 400 palavras. Não repita a divisão atual cegamente — justifique UMA mudança importante no começo.`;
    const user = contextoSaude() + `\n# DIVISÃO ATUAL\n${state.split === '6d' ? 'PUSH/PULL/LEGS A/OMB/BRAÇO/LEGS B (6 dias)' : 'PUSH/PULL/OMB/BRAÇO/LEGS FULL (5 dias)'}\n\n# TAREFA\nProponha um novo plano de treino semanal otimizado para meus dados. Comece com UMA justificativa curta baseada em algum marcador específico dos exames ou da bio.`;
    const resp = await callClaude(system, user, 2000);
    showIaOutput(resp);
  } catch (e) { showIaOutput('Erro: ' + e.message); }
  finally { setIaLoading(false); }
}

async function gerarDieta() {
  setIaLoading(true, 'Gerando nova dieta...');
  try {
    const system = `Você é um nutricionista esportivo. Responda em PT-BR. Proponha um plano alimentar de 5 refeições adaptado aos dados (especial atenção a marcadores metabólicos se existirem). Calcule kcal e macros totais realistas para o atleta. Formato: target diário + 5 refeições com horário, itens e macros. Máximo 400 palavras. Comece com UMA linha justificando o calórico escolhido.`;
    const user = contextoSaude() + `\n# DIETA ATUAL\n3000kcal · 180g proteína · 375g carbo · 80g gordura\n\n# TAREFA\nProponha nova dieta otimizada. Justifique o ajuste calórico com base em algo concreto dos dados (ex: gordura subindo, massa parada, colesterol, glicemia, etc).`;
    const resp = await callClaude(system, user, 2000);
    showIaOutput(resp);
  } catch (e) { showIaOutput('Erro: ' + e.message); }
  finally { setIaLoading(false); }
}

// ---------- SAÚDE WIRING --------------------------------------------
document.getElementById('btnEntrar').onclick = handleEntrar;
document.getElementById('btnLogout').onclick = handleSair;

// Bio form
document.getElementById('btnNovaBio').onclick = abrirFormBio;
document.getElementById('btnCancelarBio').onclick = fecharFormBio;
document.getElementById('formBio').addEventListener('submit', handleSalvarBio);

// Exame upload
document.getElementById('btnNovoExame').onclick = () => {
  document.getElementById('exameFileInput').click();
};
document.getElementById('exameFileInput').addEventListener('change', (ev) => {
  const f = ev.target.files?.[0];
  if (f) handleUploadExame(f);
});
document.getElementById('authSenha').addEventListener('keydown', e => { if (e.key === 'Enter') handleEntrar(); });

const iaKeyInput = document.getElementById('iaKey');
const iaKeyStatus = document.getElementById('iaKeyStatus');

async function loadKeyFromSupabase() {
  if (!ironUserId) { iaKeyInput.placeholder = 'Faça login primeiro'; return; }
  const k = await getClaudeKey();
  if (k) {
    iaKeyInput.value = '••••••••••••••••' + k.slice(-4);
    iaKeyInput.dataset.saved = '1';
    if (iaKeyStatus) iaKeyStatus.textContent = 'Chave carregada do Supabase';
  } else {
    iaKeyInput.value = '';
    iaKeyInput.placeholder = 'sk-ant-...';
    if (iaKeyStatus) iaKeyStatus.textContent = '';
  }
}

iaKeyInput.addEventListener('focus', () => {
  if (iaKeyInput.dataset.saved) {
    iaKeyInput.value = '';
    iaKeyInput.dataset.saved = '';
    iaKeyInput.placeholder = 'cole a nova chave';
  }
});

document.getElementById('btnSalvarKey').onclick = async () => {
  const btn = document.getElementById('btnSalvarKey');
  const raw = iaKeyInput.value.trim();
  if (!raw || raw.startsWith('•')) { if (iaKeyStatus) iaKeyStatus.textContent = 'Cole uma chave primeiro'; return; }
  if (!ironUserId) { if (iaKeyStatus) iaKeyStatus.textContent = 'Faça login antes de salvar'; return; }
  const orig = btn.textContent;
  btn.textContent = '...';
  try {
    await setClaudeKey(raw);
    btn.textContent = 'SALVO';
    if (iaKeyStatus) iaKeyStatus.textContent = 'Salvo no Supabase (RLS protegido)';
    iaKeyInput.value = '••••••••••••••••' + raw.slice(-4);
    iaKeyInput.dataset.saved = '1';
  } catch (e) {
    btn.textContent = 'ERRO';
    if (iaKeyStatus) iaKeyStatus.textContent = 'Erro: ' + e.message;
  }
  setTimeout(() => btn.textContent = orig, 1800);
};

document.getElementById('btnAnalisarSaude').onclick = analisarSaude;
document.getElementById('btnGerarTreino').onclick = gerarTreino;
document.getElementById('btnGerarDieta').onclick = gerarDieta;
document.getElementById('btnLimparIA').onclick = () => {
  document.getElementById('iaOutput').classList.remove('show');
  document.getElementById('iaOutput').textContent = '';
};

initSupabase();
