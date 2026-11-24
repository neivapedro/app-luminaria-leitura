import { describe, expect, it } from 'vitest';
import { corDaLuz, fatorBrilho, fatorTimer, kelvinParaRgb } from './luz';

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
  it('100% = 1 e cresce sempre', () => {
    expect(fatorBrilho(100)).toBe(1);
    expect(fatorBrilho(50)).toBeGreaterThan(fatorBrilho(10));
    expect(fatorBrilho(1)).toBeGreaterThan(0);
  });
  it('limita valores fora da faixa', () => {
    expect(fatorBrilho(500)).toBe(1);
    expect(fatorBrilho(-3)).toBe(fatorBrilho(1));
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
  it('a 1% fica bem fraca e sem azul no tom mais quente', () => {
    const c = corDaLuz(1500, 1);
    expect(c[2]).toBe(0);
    expect(c[0]).toBeLessThan(5);
  });
  it('timer em zero apaga', () => {
    expect(corDaLuz(1900, 80, 0)).toEqual([0, 0, 0]);
  });
});
