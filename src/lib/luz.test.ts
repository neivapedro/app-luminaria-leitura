import { describe, expect, it } from 'vitest';
import { FATOR_MAX, FATOR_MIN, NIVEIS, NIVEL_TOM_PADRAO, TONS, corDaLuz, fatorBrilho, fatorTimer, kelvinDoNivel, kelvinParaRgb } from './luz';

describe('kelvinParaRgb', () => {
  it('tons muito quentes não têm azul', () => {
    expect(kelvinParaRgb(1500)[2]).toBe(0);
    expect(kelvinParaRgb(1800)[2]).toBe(0);
  });
  it('quanto mais frio, mais verde e azul', () => {
    const a = kelvinParaRgb(1900), b = kelvinParaRgb(2700);
    expect(b[1]).toBeGreaterThan(a[1]);
    expect(b[2]).toBeGreaterThan(a[2]);
    expect(a[0]).toBe(255);
  });
  it('1900 K fica num âmbar bem quente (255, ~132)', () => {
    const [r, g] = kelvinParaRgb(1900);
    expect(r).toBe(255);
    expect(g).toBeGreaterThan(120);
    expect(g).toBeLessThan(145);
  });
});

describe('fatorBrilho', () => {
  it('fica entre o piso e o teto seguros e cresce a cada nível', () => {
    expect(fatorBrilho(24)).toBeCloseTo(FATOR_MAX);
    expect(fatorBrilho(1)).toBeCloseTo(FATOR_MIN);
    expect(fatorBrilho(99)).toBeCloseTo(FATOR_MAX);
    expect(fatorBrilho(-3)).toBeCloseTo(FATOR_MIN);
    for (let n = 2; n <= NIVEIS; n++) expect(fatorBrilho(n)).toBeGreaterThan(fatorBrilho(n - 1));
  });
  it('os 24 níveis dão 24 cores diferentes', () => {
    const cores = new Set(Array.from({ length: NIVEIS }, (_, i) => corDaLuz(i + 1).join(',')));
    expect(cores.size).toBe(NIVEIS);
  });
  it('em nenhum nível o tom vira vermelho puro', () => {
    for (let n = 1; n <= NIVEIS; n++) expect(corDaLuz(n)[1]).toBeGreaterThan(0);
  });
});

describe('tons', () => {
  it('nenhum tom permitido tem azul', () => {
    for (const k of TONS) expect(kelvinParaRgb(k)[2]).toBe(0);
    for (let t = 1; t <= TONS.length; t++) for (const n of [1, 12, 24]) expect(corDaLuz(n, t)[2]).toBe(0);
  });
  it('o nível do tom cobre a faixa e o padrão é 1800 K', () => {
    expect(kelvinDoNivel(1)).toBe(1500);
    expect(kelvinDoNivel(99)).toBe(1900);
    expect(kelvinDoNivel(NIVEL_TOM_PADRAO)).toBe(1800);
  });
});

describe('fatorTimer', () => {
  const total = 60 * 60000;
  it('mantém a luz cheia até 60% do tempo', () => {
    expect(fatorTimer(total, total)).toBe(1);
    expect(fatorTimer(total * 0.4, total)).toBe(1);
  });
  it('cai até zero no fim', () => {
    expect(fatorTimer(total * 0.2, total)).toBeCloseTo(0.5);
    expect(fatorTimer(0, total)).toBe(0);
    expect(fatorTimer(-5, total)).toBe(0);
  });
  it('sem timer não mexe na luz', () => {
    expect(fatorTimer(0, 0)).toBe(1);
  });
});

describe('corDaLuz', () => {
  it('no teto, é um âmbar escuro (até 64 de 255) e sem azul', () => {
    const [r, g, b] = corDaLuz(NIVEIS, TONS.length);
    expect(r).toBeLessThanOrEqual(64);
    expect(g).toBeLessThan(r);
    expect(b).toBe(0);
  });
  it('timer em zero apaga', () => {
    expect(corDaLuz(20, 5, 0)).toEqual([0, 0, 0]);
  });
});
