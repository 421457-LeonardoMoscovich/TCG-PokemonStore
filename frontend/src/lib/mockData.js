// Mock data for Battle Pass, Missions, and Leaderboard
// All state is frontend-only; this data is purely decorative/demo

export const BATTLE_PASS_NODES = [
  { id: 1, icon: '💰', reward: '50 Monedas', state: 'unlocked' },
  { id: 2, icon: '⚡', reward: '+1 Energía', state: 'unlocked' },
  { id: 3, icon: '🎴', reward: 'Carta Común', state: 'unlocked' },
  { id: 4, icon: '💰', reward: '100 Monedas', state: 'current' },
  { id: 5, icon: '✨', reward: '+2 Energía', state: 'locked' },
  { id: 6, icon: '⚡', reward: 'Energía Máxima', state: 'locked' },
  { id: 7, icon: '🎴', reward: 'Carta Épica', state: 'locked' },
  { id: 8, icon: '💰', reward: '500 Monedas', state: 'locked' },
  { id: 9, icon: '🏆', reward: 'Trofeo Temporal', state: 'locked' },
  { id: 10, icon: '👑', reward: 'Grand Prize', state: 'locked', special: true },
];

export const MISSIONS = [
  {
    type: 'Diaria',
    title: 'Juega Adivina el Pokémon',
    description: 'Completa 3 rondas del juego de adivinanza',
    progress: 1,
    target: 3,
    xpReward: 50,
    barColor: 'purple',
  },
  {
    type: 'Semanal',
    title: 'Mantén tu racha',
    description: 'Reclama tu bonificación diaria 7 días seguidos',
    progress: 1,
    target: 7,
    xpReward: 200,
    extra: 'Carta foil',
    barColor: 'orange',
  },
  {
    type: 'Especial',
    title: 'Acierta Legendarios',
    description: 'Advina 5 Pokémon de tipo legendario',
    progress: 0,
    target: 5,
    xpReward: 500,
    extra: 'Carta legendaria',
    barColor: 'gold',
    special: true,
  },
];

export const LEADERBOARD_DATA = {
  amigos: [
    {
      rank: 1,
      name: 'MistyKing',
      xp: 2840,
      avatar: 'MK',
      color: 'from-red-500 to-pink-500',
      isCurrent: false,
    },
    {
      rank: 2,
      name: 'AshFan99',
      xp: 2210,
      avatar: 'AF',
      color: 'from-orange-500 to-red-500',
      isCurrent: false,
    },
    {
      rank: 3,
      name: 'Brock_R',
      xp: 1980,
      avatar: 'BR',
      color: 'from-yellow-500 to-orange-500',
      isCurrent: false,
    },
    {
      rank: 7,
      name: 'Tú (Raspador)',
      xp: 620,
      avatar: 'RP',
      color: 'from-purple-500 to-indigo-500',
      isCurrent: true,
    },
  ],
  global: [
    {
      rank: 1,
      name: 'ChandelureKing',
      xp: 12450,
      avatar: 'CK',
      color: 'from-red-500 to-pink-500',
      isCurrent: false,
    },
    {
      rank: 2,
      name: 'DragontypeGod',
      xp: 11800,
      avatar: 'DG',
      color: 'from-indigo-500 to-purple-500',
      isCurrent: false,
    },
    {
      rank: 3,
      name: 'SwordMaster92',
      xp: 11200,
      avatar: 'SM',
      color: 'from-blue-500 to-cyan-500',
      isCurrent: false,
    },
    {
      rank: 4521,
      name: 'Tú (Raspador)',
      xp: 620,
      avatar: 'RP',
      color: 'from-purple-500 to-indigo-500',
      isCurrent: true,
    },
  ],
  semana: [
    {
      rank: 1,
      name: 'LuckyStrike',
      xp: 2100,
      avatar: 'LS',
      color: 'from-green-500 to-emerald-500',
      isCurrent: false,
    },
    {
      rank: 2,
      name: 'NovaRise',
      xp: 1950,
      avatar: 'NR',
      color: 'from-cyan-500 to-blue-500',
      isCurrent: false,
    },
    {
      rank: 3,
      name: 'PhoenixFlare',
      xp: 1800,
      avatar: 'PF',
      color: 'from-red-500 to-orange-500',
      isCurrent: false,
    },
    {
      rank: 12,
      name: 'Tú (Raspador)',
      xp: 620,
      avatar: 'RP',
      color: 'from-purple-500 to-indigo-500',
      isCurrent: true,
    },
  ],
};

export const LOOT_TABLE = [
  { label: 'Monedas', percentage: 30, color: '#e8b800' },
  { label: 'Energía', percentage: 25, color: '#ddb7ff' },
  { label: 'Carta Rara', percentage: 15, color: '#2196F3' },
  { label: 'Carta Épica', percentage: 8, color: '#9C27B0' },
  { label: 'Legendaria', percentage: 2, color: '#FF6B6B' },
];

export const HINT_DATA = {
  tipo: { label: 'Tipo', active: true, hint: 'Fuego / Volador' },
  gen: { label: 'Gen', active: true, hint: 'Generación 1' },
  inicial: { label: 'Inicial', active: false, hint: null },
  bloqueada: { label: 'Pista bloqueada', active: false, hint: null, cost: 1 },
};
