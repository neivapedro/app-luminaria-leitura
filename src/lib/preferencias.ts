import { FAIXA_BRILHO, FAIXA_TOM, TIMERS, limitar, type Timer } from './luz';

// Tudo fica só no celular (localStorage). Sem login e sem internet.

export interface Preferencias {
  /** Intensidade da luz, de 1 a 100. */
  brilho: number;
  /** Tom da luz em Kelvin. Menor = mais alaranjado. */
  tom: number;
  /** Minutos até apagar sozinha (0 = nunca). */
  timer: Timer;
  /** Manter a tela acesa enquanto o app está aberto. */
  telaAcesa: boolean;
  dicaVista: boolean;
}

const CHAVE = 'app-luminaria-leitura:preferencias';

export const PADRAO: Preferencias = { brilho: 12, tom: 1900, timer: 0, telaAcesa: true, dicaVista: false };

export function lerPreferencias(): Preferencias {
  let p: Partial<Preferencias> = {};
  try {
    p = JSON.parse(localStorage.getItem(CHAVE) || '{}') || {};
  } catch {
    /* sem armazenamento: usa o padrão */
  }
  return {
    brilho: typeof p.brilho === 'number' ? limitar(Math.round(p.brilho), FAIXA_BRILHO.min, FAIXA_BRILHO.max) : PADRAO.brilho,
    tom: typeof p.tom === 'number' ? limitar(Math.round(p.tom / FAIXA_TOM.passo) * FAIXA_TOM.passo, FAIXA_TOM.min, FAIXA_TOM.max) : PADRAO.tom,
    timer: TIMERS.includes(p.timer as Timer) ? (p.timer as Timer) : 0,
    telaAcesa: p.telaAcesa !== false,
    dicaVista: p.dicaVista === true,
  };
}

export function salvarPreferencias(p: Preferencias): void {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(p));
  } catch {
    /* sem armazenamento: só não guarda */
  }
}
