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
  const ui = `rgb(${Math.round(kr * 0.5)} ${Math.round(kg * 0.5)} ${Math.round(kb * 0.5)})`;

  useEffect(() => {
    document.documentElement.style.setProperty('--luz', css);
    document.documentElement.style.setProperty('--ui', ui);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', css);
  }, [css, ui]);

  const mudar = (extra: Partial<Preferencias>) => setP((a) => ({ ...a, ...extra }));
  const reacender = () => setInicio(Date.now());

  const tocarTela = () => {
    if (ocupado.current) return;
    if (apagada) return reacender();
    setP((a) => (a.dicaVista ? a : { ...a, dicaVista: true }));
    setPainel((v) => !v);
  };

  const minutos = Math.max(0, Math.ceil(restante / 60000));

  return (
    <div className="app">
      <div className="luz" onClick={tocarTela} role="button" aria-label="Mostrar ou esconder controles" />
      {!p.dicaVista && <p className="dica">Toque na tela para mostrar ou esconder os controles</p>}
      {apagada && <p className="dica">Luz apagada. Toque na tela para acender.</p>}

      <section className={`painel ${painel ? '' : 'fechado'}`} aria-hidden={!painel}>
        <div className="linha">
          <div className="rotulo">
            <label htmlFor="brilho">Intensidade</label>
            <span className="num">{p.brilho}%</span>
          </div>
          <input id="brilho" type="range" min={FAIXA_BRILHO.min} max={FAIXA_BRILHO.max} step={1} value={p.brilho} onChange={(e) => mudar({ brilho: +e.target.value })} />
        </div>

        <p className="aviso">Luz fixa em âmbar, sem azul, e com claridade limitada para não atrapalhar o sono. Deixe o brilho do iPhone no mínimo.</p>

        <div className="linha">
          <div className="rotulo">
            <span>Apagar sozinha</span>
            <span className="num">{p.timer && !apagada ? `em ${minutos} min` : ''}</span>
          </div>
          <div className="fichas">
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
          <input type="checkbox" checked={p.telaAcesa} onChange={(e) => mudar({ telaAcesa: e.target.checked })} />
          <span>Manter a tela acesa</span>
        </label>
      </section>
    </div>
  );
}
