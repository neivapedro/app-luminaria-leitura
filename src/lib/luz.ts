// Contas da luz: tom (Kelvin) -> cor, intensidade -> brilho e timer de apagar.

/** Tom fixo: 1800 K não tem nenhum azul (o Kindle Paperwhite vai até ~2700 K no mais quente). Não é ajustável. */
export const TOM_FIXO = 1800;
/** Teto de claridade: a cor mais forte possível é um âmbar escuro (código 64 de 255), bem abaixo da tela cheia. */
export const FATOR_MAX = 0.25;
export const FAIXA_BRILHO = { min: 1, max: 100 };
export const TIMERS = [0, 15, 30, 60] as const;
export type Timer = (typeof TIMERS)[number];

export function limitar(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

/** Kelvin -> RGB (aproximação de Tanner Helland, faixa quente). Abaixo de ~1900 K o azul é zero. */
export function kelvinParaRgb(k: number): [number, number, number] {
  const t = limitar(k, 1000, 6600) / 100;
  const g = limitar(99.4708 * Math.log(t) - 161.1196, 0, 255);
  const b = t <= 19 ? 0 : limitar(138.5177 * Math.log(t - 10) - 305.0448, 0, 255);
  return [255, Math.round(g), Math.round(b)];
}

/** Intensidade (1 a 100) -> fator de brilho, sempre dentro do teto seguro. */
export function fatorBrilho(intensidade: number): number {
  return FATOR_MAX * Math.pow(limitar(intensidade, FAIXA_BRILHO.min, FAIXA_BRILHO.max) / 100, 1.5);
}

/** Quanto da luz sobra com o timer: 1 até 60% do tempo, depois cai até 0 no fim. */
export function fatorTimer(restanteMs: number, totalMs: number): number {
  if (totalMs <= 0) return 1;
  if (restanteMs <= 0) return 0;
  return Math.min(1, restanteMs / (totalMs * 0.4));
}

/** Cor final da tela (com o fator do timer aplicado). */
export function corDaLuz(intensidade: number, timer = 1, tom = TOM_FIXO): [number, number, number] {
  const [r, g, b] = kelvinParaRgb(tom);
  const f = fatorBrilho(intensidade) * limitar(timer, 0, 1);
  return [Math.round(r * f), Math.round(g * f), Math.round(b * f)];
}

export const rgb = (c: [number, number, number]) => `rgb(${c[0]} ${c[1]} ${c[2]})`;
