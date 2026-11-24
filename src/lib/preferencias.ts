import { NIVEIS, NIVEL_PADRAO, NIVEL_TOM_PADRAO, TIMERS, TONS, limitar, type Timer } from './luz';

// Tudo fica só no celular (localStorage). Sem login e sem internet.

export interface Preferencias {
  /** Nível de intensidade, de 1 a 24. */
  nivel: number;
  /** Nível de tom, de 1 a 9 (todos sem azul). */
  tom: number;
  /** Minutos até apagar sozinha (0 = nunca). */
  timer: Timer;
  /** Manter a tela acesa enquanto o app está aberto. */
  telaAcesa: boolean;
  dicaVista: boolean;
}

const CHAVE = 'app-luminaria-leitura:preferencias';

export const PADRAO: Preferencias = { nivel: NIVEL_PADRAO, tom: NIVEL_TOM_PADRAO, timer: 0, telaAcesa: true, dicaVista: false };

export function lerPreferencias(): Preferencias {
  let p: Partial<Preferencias> & { brilho?: number } = {};
  try {
    p = JSON.parse(localStorage.getItem(CHAVE) || '{}') || {};
  } catch {
    /* sem armazenamento: usa o padrão */
  }
  return {
    // Versão antiga guardava a intensidade de 1 a 100: converte para os 24 níveis
    nivel:
      typeof p.nivel === 'number'
        ? limitar(Math.round(p.nivel), 1, NIVEIS)
        : typeof p.brilho === 'number'
          ? limitar(Math.round((p.brilho / 100) * (NIVEIS - 1)) + 1, 1, NIVEIS)
          : PADRAO.nivel,
    tom: typeof p.tom === 'number' ? limitar(Math.round(p.tom), 1, TONS.length) : PADRAO.tom,
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
