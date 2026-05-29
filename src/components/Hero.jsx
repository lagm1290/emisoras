import { useMemo } from 'react';
import { useRadio } from '../context/RadioContext';
import { useAudio } from '../hooks/useAudio';

export default function Hero({ emisoras }) {
  const { playStation } = useAudio();

  const featured = useMemo(() => {
    const idx = emisoras.findIndex((e) => e.titulo === 'Olímpica Stereo Bogotá');
    return idx !== -1 ? { station: emisoras[idx], index: idx } : null;
  }, [emisoras]);

  return (
    <section className="relative h-[75vh] min-h-[500px] flex items-end">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='20' cy='20' r='2' fill='rgba(255,255,255,0.1)'/%3E%3Ccircle cx='80' cy='40' r='1.5' fill='rgba(255,255,255,0.08)'/%3E%3Ccircle cx='40' cy='80' r='1' fill='rgba(255,255,255,0.06)'/%3E%3Ccircle cx='70' cy='70' r='2.5' fill='rgba(255,255,255,0.05)'/%3E%3C/svg%3E")`,
            backgroundSize: '200px',
          }}
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#141414]/80 via-transparent to-transparent" />

      <div className="relative z-10 px-4 md:px-12 pb-16 md:pb-24 max-w-2xl">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
          <span className="uppercase text-red-500 font-bold text-sm tracking-widest">En Directo Ahora</span>
        </div>

        <h2 className="text-5xl md:text-7xl font-extrabold mb-4 leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '2px' }}>
          {featured ? featured.station.cadena.toUpperCase() : 'RADIOFLIX'}
        </h2>

        <p className="text-lg md:text-xl text-gray-300 mb-2 font-medium">
          {featured ? featured.station.titulo : 'La mejor radio de Colombia'}
        </p>

        <p className="text-gray-400 mb-8 max-w-lg text-sm md:text-base">
          Escucha las mejores emisoras colombianas en vivo. {emisoras.length} emisoras de diferentes cadenas y ciudades.
        </p>

        <div className="flex gap-4">
          <button
            onClick={() => featured && playStation(featured.index)}
            className="bg-white text-black px-8 py-3 rounded font-bold text-lg hover:bg-gray-200 transition flex items-center gap-2"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            Reproducir
          </button>
          <button
            className="bg-gray-500/30 backdrop-blur-sm text-white px-8 py-3 rounded font-bold text-lg hover:bg-gray-500/50 transition flex items-center gap-2"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
            Más información
          </button>
        </div>
      </div>

      {/* Visualizador */}
      <div className="absolute right-[8%] bottom-[15%] z-10 hidden md:flex items-end gap-1 h-[120px]">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="w-1.5 bg-gradient-to-t from-[#E50914] to-[#ff6b6b] rounded-full"
            style={{
              height: `${30 + Math.random() * 70}%`,
              animation: `equalize 1s ease-in-out infinite alternate`,
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes equalize {
          0% { height: 20%; }
          100% { height: 100%; }
        }
      `}</style>
    </section>
  );
}
