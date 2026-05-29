import { useMemo } from 'react';
import { useRadio } from '../context/RadioContext';
import { useAudio } from '../hooks/useAudio';

export default function Hero({ emisoras }) {
  const { setSearchQuery } = useRadio();
  const { playStation } = useAudio();

  const featured = useMemo(() => {
    const idx = emisoras.findIndex((e) => e.titulo === 'Olímpica Stereo Bogotá');
    return idx !== -1 ? { station: emisoras[idx], index: idx } : null;
  }, [emisoras]);

  const gradient = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)';

  return (
    <section
      className="relative h-[450px] md:h-[500px] bg-cover bg-center flex items-end"
      style={{ background: gradient }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

      <div className="relative z-10 p-6 md:p-10 max-w-2xl">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <p className="uppercase text-red-500 font-semibold text-sm tracking-wider">
            En vivo ahora
          </p>
        </div>

        <h2 className="text-5xl md:text-6xl font-extrabold mb-4">
          {featured ? featured.station.titulo : 'RadioFlix Colombia'}
        </h2>
        <p className="text-zinc-300 text-lg mb-6 max-w-lg">
          Escucha las mejores emisoras colombianas en vivo. {emisoras.length} emisoras de diferentes cadenas y ciudades.
        </p>

        <div className="flex gap-4">
          <button
            onClick={() => featured && playStation(featured.index)}
            className="bg-white text-black px-6 py-3 rounded-xl font-bold hover:scale-105 transition flex items-center gap-2"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            Escuchar
          </button>

          <button
            onClick={() => setSearchQuery('')}
            className="bg-zinc-800/80 px-6 py-3 rounded-xl font-semibold hover:bg-zinc-700 transition"
          >
            Ver todas
          </button>
        </div>
      </div>
    </section>
  );
}
