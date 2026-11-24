import { useEffect, useRef, useState } from 'react';
import { FAIXA_BRILHO, TIMERS, TOM_FIXO, corDaLuz, fatorTimer, kelvinParaRgb, rgb } from './lib/luz';
import { lerPreferencias, salvarPreferencias, type Preferencias } from './lib/preferencias';
import { manterTelaAcesa } from './lib/tela-acesa';

export function App() {
  const [p, setP] = useState<Preferencias>(lerPreferencias);
  const [painel, setPainel] = useState(false);
  const [agora, setAgora] = useState(Date.now());
  // Momento em que o timer foi armado (muda ao escolher outro tempo ou ao reacender)
  const [inicio, setInicio] = useState(Date.now());
  const ocupado = useRef(false);

  useEffect(() => salvarPreferencias(p), [p]);
  useEffect(() => manterTelaAcesa(p.telaAcesa), [p.telaAcesa]);
  useEffect(() => {
    const t = setInterval(() => setAgora(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const totalMs = p.timer * 60000;
  const restante = p.timer ? inicio + totalMs - agora : 1;
  const apagada = p.timer > 0 && restante <= 0;
  const cor = corDaLuz(p.brilho, p.timer ? fatorTimer(restante, totalMs) : 1);
  const css = rgb(cor);

  // Os controles usam o mesmo tom, num âmbar fixo e legível (não seguem a intensidade da luz)
  const [kr, kg, kb] = kelvinParaRgb(TOM_FIXO);
  // 75% do âmbar: contraste de 4,6:1 sobre o painel (mínimo recomendado: 4,5:1)
  const ui = `rgb(${Math.round(kr * 0.75)} ${Math.round(kg * 0.75)} ${Math.round(kb * 0.75)})`;
  const trilho = `rgb(${Math.round(kr * 0.25)} ${Math.round(kg * 0.25)} ${Math.round(kb * 0.25)})`;

  useEffect(() => {
    document.documentElement.style.setProperty('--luz', css);
    document.documentElement.style.setProperty('--ui', ui);
    document.documentElement.style.setProperty('--trilho', trilho);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', css);
  }, [css, ui, trilho]);

  const mudar = (extra: Partial<Preferencias>) => setP((a) => ({ ...a, ...extra }));
  const reacender = () => setInicio(Date.now());

  const tocarTela = () => {
    if (ocupado.current) return;
    if (apagada) return reacender();
    setP((a) => (a.dicaVista ? a : { ...a, dicaVista: true }));
    setPainel((v) => !v);
  };

  const minutos = Math.max(0, Math.ceil(restante / 60000));

  const pct = ((p.brilho - FAIXA_BRILHO.min) / (FAIXA_BRILHO.max - FAIXA_BRILHO.min)) * 100;

  return (
    <div className="app">
      <div className="luz" onClick={tocarTela} role="button" aria-label="Mostrar ou esconder controles" />
      {!p.dicaVista && (
        <div className="dica">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3Z" />
          </svg>
          <p>Toque para ver os controles</p>
        </div>
      )}
      {apagada && (
        <div className="dica">
          <p>Luz apagada. Toque para acender.</p>
        </div>
      )}

      <section className={`painel ${painel ? '' : 'fechado'}`} inert={!painel} aria-label="Controles da luz">
        <button className="alca" aria-label="Esconder controles" onClick={() => setPainel(false)} />

        <div className="linha">
          <div className="rotulo">
            <label htmlFor="brilho">Intensidade</label>
            <span className="valor num">{p.brilho}%</span>
          </div>
          <input
            id="brilho"
            type="range"
            min={FAIXA_BRILHO.min}
            max={FAIXA_BRILHO.max}
            step={1}
            value={p.brilho}
            style={{ '--pct': `${pct}%` } as React.CSSProperties}
            onChange={(e) => mudar({ brilho: +e.target.value })}
          />
        </div>

        <div className="linha">
          <div className="rotulo">
            <span id="rotulo-timer">Apagar sozinha</span>
            <span className="apoio num">{p.timer && !apagada ? `em ${minutos} min` : ''}</span>
          </div>
          <div className="fichas" role="group" aria-labelledby="rotulo-timer">
            {TIMERS.map((m) => (
              <button
                key={m}
                aria-pressed={p.timer === m}
                onClick={() => {
                  mudar({ timer: m });
                  reacender();
                }}
              >
                {m === 0 ? 'Nunca' : `${m} min`}
              </button>
            ))}
          </div>
        </div>

        <label className="chave">
          <span>Manter a tela acesa</span>
          <input type="checkbox" role="switch" checked={p.telaAcesa} onChange={(e) => mudar({ telaAcesa: e.target.checked })} />
        </label>

        <p className="aviso">Luz fixa, sem azul. Deixe o brilho do iPhone no mínimo.</p>
      </section>
    </div>
  );
}
