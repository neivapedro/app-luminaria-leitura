// Contas da luz: tom (Kelvin) -> cor, intensidade -> brilho e timer de apagar.

/** 24 níveis de intensidade, como o controle de brilho do Kindle (níveis relativos, sem valor absoluto). */
export const NIVEIS = 24;
/** 9 tons, todos sem nenhum azul (de 1500 K a 1900 K). O tom mais frio permitido é o 1900 K. */
export const TONS = [1500, 1550, 1600, 1650, 1700, 1750, 1800, 1850, 1900] as const;
export const NIVEL_TOM_PADRAO = 7; // 1800 K
export const NIVEL_PADRAO = 10;
/** Piso e teto de claridade (fração do máximo da tela). No teto, a cor é um âmbar escuro (código 64 de 255). O piso evita o tom virar vermelho por arredondamento. */
export const FATOR_MIN = 10 / 255;
export const FATOR_MAX = 0.25;
export const TIMERS = [0, 15, 30, 60] as const;
export type Timer = (typeof TIMERS)[number];

export function limitar(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

/** Kelvin -> RGB (aproximação de Tanner Helland, faixa quente). Até 1900 K o azul é zero. */
export function kelvinParaRgb(k: number): [number, number, number] {
  const t = limitar(k, 1000, 6600) / 100;
  const g = limitar(99.4708 * Math.log(t) - 161.1196, 0, 255);
  const b = t <= 19 ? 0 : limitar(138.5177 * Math.log(t - 10) - 305.0448, 0, 255);
  return [255, Math.round(g), Math.round(b)];
}

/** Nível (1 a 24) -> fator de brilho, entre o piso e o teto seguros. Passos iguais no código de cor, que já é aproximadamente perceptual (curvas mais fortes juntam os níveis baixos na mesma cor, por causa dos 8 bits). */
export function fatorBrilho(nivel: number): number {
  const n = limitar(Math.round(nivel), 1, NIVEIS);
  return FATOR_MIN + (FATOR_MAX - FATOR_MIN) * (n - 1) / (NIVEIS - 1);
}

/** Nível de tom (1 a 9) -> Kelvin. */
export function kelvinDoNivel(nivel: number): number {
  return TONS[limitar(Math.round(nivel), 1, TONS.length) - 1];
}

/** Quanto da luz sobra com o timer: 1 até 60% do tempo, depois cai até 0 no fim. */
export function fatorTimer(restanteMs: number, totalMs: number): number {
  if (totalMs <= 0) return 1;
  if (restanteMs <= 0) return 0;
  return Math.min(1, restanteMs / (totalMs * 0.4));
}

/** Cor final da tela (com o fator do timer aplicado). */
export function corDaLuz(nivel: number, nivelTom = NIVEL_TOM_PADRAO, timer = 1): [number, number, number] {
  const [r, g, b] = kelvinParaRgb(kelvinDoNivel(nivelTom));
  const f = fatorBrilho(nivel) * limitar(timer, 0, 1);
  return [Math.round(r * f), Math.round(g * f), Math.round(b * f)];
}

export const rgb = (c: [number, number, number]) => `rgb(${c[0]} ${c[1]} ${c[2]})`;
