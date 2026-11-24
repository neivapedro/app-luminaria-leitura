import { describe, expect, it } from 'vitest';
import { FATOR_MAX, corDaLuz, fatorBrilho, fatorTimer, kelvinParaRgb } from './luz';

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
  it('nunca passa do teto seguro e cresce sempre', () => {
    expect(fatorBrilho(100)).toBe(FATOR_MAX);
    expect(fatorBrilho(500)).toBe(FATOR_MAX);
    expect(fatorBrilho(50)).toBeGreaterThan(fatorBrilho(10));
    expect(fatorBrilho(1)).toBeGreaterThan(0);
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
  it('no máximo, é um âmbar escuro e sem azul', () => {
    const [r, g, b] = corDaLuz(100);
    expect(r).toBeLessThanOrEqual(64);
    expect(g).toBeLessThan(r);
    expect(b).toBe(0);
  });
  it('em qualquer intensidade não tem azul', () => {
    for (const i of [1, 30, 70, 100]) expect(corDaLuz(i)[2]).toBe(0);
  });
  it('timer em zero apaga', () => {
    expect(corDaLuz(80, 0)).toEqual([0, 0, 0]);
  });
});
