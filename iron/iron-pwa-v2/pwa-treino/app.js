// ====================================================================
// IRON — PROTOCOLO HIPERTROFIA · FOCO SUPERIOR · v2
// Dados salvos em localStorage. Zera treino/dieta todo dia 00h.
// Readiness e semana persistem.
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
    duration: '60-70min',
    volume: '23 séries',
    exercises: [
      { name: 'Barra fixa (pegada aberta)', sets: '4xAMRAP', detail: 'Descanso 90s · Alternativa: puxada 4x8-10' },
      { name: 'Remada curvada barra', sets: '4x8-10', detail: 'Descanso 90s · Pegada pronada' },
      { name: 'Remada cavalinho (T-bar)', sets: '4x10-12', detail: 'Descanso 75s · Pegada neutra' },
      { name: 'Puxada frente fechada', sets: '3x12', detail: 'Descanso 60s · Pegada neutra/supinada' },
      { name: 'Remada unilateral halter', sets: '3x10-12 cada', detail: 'Descanso 60s · Foco contração' },
      { name: 'Pullover polia alta', sets: '3x15', detail: 'Descanso 45s · Alongamento máximo' },
      { name: 'Rosca direta barra W', sets: '4x8-10', detail: 'Descanso 75s · Sem balançar' },
      { name: 'Rosca alternada halteres', sets: '3x10-12', detail: 'Descanso 60s · Supinação completa' },
      { name: 'Rosca martelo', sets: '3x12', detail: 'Descanso 45s · Braquial + antebraço' }
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
    duration: '60min',
    volume: '22 séries',
    exercises: [
      { name: 'Desenvolvimento militar barra', sets: '4x8-10', detail: 'Descanso 90s' },
      { name: 'Desenvolvimento halteres', sets: '4x10-12', detail: 'Descanso 75s · Sentado' },
      { name: 'Elevação lateral halteres', sets: '4x12-15', detail: 'Descanso 45s · Controle descida' },
      { name: 'Elevação lateral cabo (uni)', sets: '3x12 cada', detail: 'Descanso 45s' },
      { name: 'Elevação frontal halter/anilha', sets: '3x12', detail: 'Descanso 45s' },
      { name: 'Crucifixo invertido (peck deck)', sets: '4x12-15', detail: 'Descanso 60s · Deltoide posterior' },
      { name: 'Encolhimento halteres', sets: '4x12-15', detail: 'Descanso 60s · Pausa 1s topo' },
      { name: 'Remada alta cabo', sets: '3x12', detail: 'Descanso 45s · Pegada fechada' }
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
const MEALS = [
  {
    name: 'CAFÉ DA MANHÃ', time: '07:00',
    items: [
      '4 ovos inteiros + 3 claras mexidos',
      '80g aveia com 1 banana e canela',
      '1 colher (sopa) pasta de amendoim integral',
      '1 xícara café preto'
    ],
    macros: { kcal: 680, p: 42, c: 75, g: 20 }
  },
  {
    name: 'LANCHE 1', time: '10:30',
    items: [
      '1 scoop whey (30g) com 300ml água',
      '50g castanhas (pará/caju/amêndoa)',
      '1 fruta (maçã, pera ou mamão)'
    ],
    macros: { kcal: 480, p: 28, c: 35, g: 24 }
  },
  {
    name: 'ALMOÇO', time: '13:00',
    items: [
      '180g peito de frango grelhado (ou patinho/tilápia)',
      '150g arroz integral cozido + 1 concha feijão',
      'Salada verde à vontade + 1 colher azeite',
      '100g batata-doce ou legumes cozidos'
    ],
    macros: { kcal: 780, p: 50, c: 95, g: 18 }
  },
  {
    name: 'PRÉ-TREINO', time: '16:30',
    items: [
      '2 fatias pão integral ou 1 tapioca (3 col. sopa)',
      '100g peito de peru ou frango desfiado',
      '1 banana com mel (1 col. chá)',
      'Café preto ou cafeína 200mg'
    ],
    macros: { kcal: 520, p: 32, c: 80, g: 8 }
  },
  {
    name: 'JANTAR (pós-treino)', time: '20:30',
    items: [
      '200g carne vermelha magra ou salmão',
      '150g arroz branco ou batata-doce',
      'Legumes no vapor (brócolis, abobrinha, cenoura)',
      '1 colher azeite de oliva extravirgem'
    ],
    macros: { kcal: 740, p: 48, c: 80, g: 22 }
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
    meals: {},
    selectedDay: getTodayIndex(),
    readiness: {}          // { '2026-04-20': { sleep:4, energy:3, soreness:2, mood:4, score:78 } }
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
      parsed.date = todayKey();
      parsed.exercises = {};
      parsed.meals = {};
      parsed.selectedDay = getTodayIndex();
      // increment week number every Monday
      if (getTodayIndex() === 1 && parsed.lastWeekIncrement !== todayKey()) {
        parsed.weekNumber++;
        parsed.lastWeekIncrement = todayKey();
      }
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
function renderMeals() {
  const container = document.getElementById('mealsContainer');
  container.innerHTML = MEALS.map((m, idx) => {
    const done = state.meals[idx];
    const items = m.items.map(i => `<li>${i}</li>`).join('');
    return `
      <div class="meal-card ${done ? 'done' : ''}" data-idx="${idx}">
        <div class="meal-header">
          <div class="meal-name">${m.name}</div>
          <div class="meal-time">${m.time}</div>
        </div>
        <ul class="meal-items">${items}</ul>
        <div class="meal-macros">
          <span>${m.macros.kcal}kcal</span>
          <span>P ${m.macros.p}g</span>
          <span>C ${m.macros.c}g</span>
          <span>G ${m.macros.g}g</span>
        </div>
      </div>
    `;
  }).join('');

  container.querySelectorAll('.meal-card').forEach(el => {
    el.onclick = () => {
      const idx = el.dataset.idx;
      state.meals[idx] = !state.meals[idx];
      el.classList.toggle('done');
      saveState();
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

  const mealsDone = Object.values(state.meals).filter(Boolean).length;
  const mealsPct = (mealsDone / MEALS.length) * 100;
  document.getElementById('barDieta').style.width = mealsPct + '%';
  document.getElementById('valDieta').textContent = `${mealsDone} / ${MEALS.length}`;

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
