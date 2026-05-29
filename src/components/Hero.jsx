import { useMemo } from 'react';
import { useRadio } from '../context/RadioContext';
import { useAudio } from '../hooks/useAudio';

export default function Hero() {
  const { emisoras } = useRadio();
  const { playStation } = useAudio();

  const olimpicaIndex = useMemo(() => {
    return emisoras.findIndex((e) => e.titulo === 'Olímpica Stereo Bogotá');
  }, [emisoras]);

  return (
    <section className="hero">
      <div className="hero-bg"></div>
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <div className="hero-badge">
          <span className="live-dot"></span>
          En Directo Ahora
        </div>
        <h1 className="hero-title">OLIMPICA STEREO</h1>
        <p className="hero-subtitle">La radio más popular de Colombia</p>
        <p className="hero-description">
          Escucha las mejores emisoras colombianas en vivo. {emisoras.length} emisoras de 10 cadenas diferentes,
          desde Bogotá hasta Cartagena, desde Pop hasta Vallenato.
        </p>
        <div className="hero-buttons">
          <button className="btn btn-primary" onClick={() => olimpicaIndex !== -1 && playStation(olimpicaIndex)}>
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            Reproducir Olímpica Bogotá
          </button>
          <button className="btn btn-secondary" onClick={() => document.getElementById('cadenas-section')?.scrollIntoView({ behavior: 'smooth' })}>
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
            Ver Todas
          </button>
        </div>
      </div>
      <div className="hero-visualizer">
        <div className="bar"></div><div className="bar"></div><div className="bar"></div><div className="bar"></div>
        <div className="bar"></div><div className="bar"></div><div className="bar"></div><div className="bar"></div>
        <div className="bar"></div><div className="bar"></div><div className="bar"></div><div className="bar"></div>
      </div>
    </section>
  );
}
