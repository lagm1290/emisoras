import { useRef, useMemo } from 'react';
import { useRadio } from '../context/RadioContext';
import { useAudio } from '../hooks/useAudio';
import { stringToGradient } from '../utils/colors';

function CarouselRow({ title, stations, currentIndex, favorites, onPlay, onFav }) {
  const rowRef = useRef(null);

  const scroll = (dir) => {
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: dir * rowRef.current.clientWidth * 0.8, behavior: 'smooth' });
    }
  };

  if (!stations || stations.length === 0) return null;

  return (
    <div className="mb-8 md:mb-12 group/row">
      <h3 className="text-lg md:text-xl font-bold text-white mb-3 px-4 md:px-12 flex items-center gap-2 cursor-pointer hover:text-gray-300 transition">
        {title}
        <span className="text-xs font-normal text-gray-500 bg-gray-800 px-2 py-0.5 rounded">
          {stations.length}
        </span>
        <span className="opacity-0 group-hover/row:opacity-100 transition-opacity text-sm">&#8250;</span>
      </h3>

      <div className="relative">
        {/* Botón izquierda */}
        <button
          onClick={() => scroll(-1)}
          className="absolute left-0 top-0 bottom-0 w-12 md:w-16 z-20 bg-black/50 hover:bg-black/70 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity"
        >
          <svg width="30" height="30" viewBox="0 0 24 24" fill="white"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
        </button>

        {/* Carrusel */}
        <div ref={rowRef} className="carousel-row px-4 md:px-12">
          {stations.map((station) => {
            const isPlaying = currentIndex === station.index;
            const isFav = favorites.includes(station.index);
            const gradient = stringToGradient(station.cadena + station.ciudad);

            return (
              <div
                key={station.id}
                className="netflix-card flex flex-col"
                onClick={() => onPlay(station.index)}
              >
                {/* Imagen / Gradient */}
                <div
                  className="w-full flex-1 flex items-center justify-center relative"
                  style={{ background: gradient }}
                >
                  <span className="text-4xl opacity-50">&#127897;</span>

                  {/* Badge reproduciendo */}
                  {isPlaying && (
                    <div className="absolute top-2 left-2 bg-[#E50914] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      REPRODUCIENDO
                    </div>
                  )}

                  {/* Overlay hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                    <div className="flex gap-2 mb-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); onPlay(station.index); }}
                        className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:bg-gray-200 transition"
                      >
                        {isPlaying ? (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                        ) : (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                        )}
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onFav(station.index); }}
                        className="w-8 h-8 rounded-full border border-gray-400 text-white flex items-center justify-center hover:border-white transition"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill={isFav ? '#E50914' : 'none'} stroke={isFav ? '#E50914' : 'currentColor'} strokeWidth="2">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                      </button>
                    </div>
                    <h4 className="text-sm font-bold truncate">{station.titulo}</h4>
                    <p className="text-xs text-gray-300">{station.ciudad}</p>
                    <span className="text-[10px] text-gray-400 mt-1">{station.via}</span>
                  </div>
                </div>

                {/* Info siempre visible */}
                <div className="bg-[#141414] px-1 pt-2 pb-1">
                  <h4 className="text-xs font-semibold text-white truncate leading-tight">{station.titulo}</h4>
                  <p className="text-[10px] text-gray-400 truncate">{station.ciudad}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Botón derecha */}
        <button
          onClick={() => scroll(1)}
          className="absolute right-0 top-0 bottom-0 w-12 md:w-16 z-20 bg-black/50 hover:bg-black/70 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity"
        >
          <svg width="30" height="30" viewBox="0 0 24 24" fill="white"><path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/></svg>
        </button>
      </div>
    </div>
  );
}

export default function StationGrid({ emisoras, cadenas }) {
  const { searchQuery, currentIndex, favorites, toggleFavorite } = useRadio();
  const { playStation } = useAudio();

  const porCadena = useMemo(() => {
    const map = {};
    emisoras.forEach((e, idx) => {
      if (!map[e.cadena]) map[e.cadena] = [];
      map[e.cadena].push({ ...e, index: idx });
    });
    return map;
  }, [emisoras]);

  const rows = useMemo(() => {
    let result = cadenas
      .map((c) => ({ cadena: c, stations: porCadena[c] || [] }))
      .filter((r) => r.stations.length > 0);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.cadena.toLowerCase().includes(q) ||
          r.stations.some((s) =>
            s.titulo.toLowerCase().includes(q) ||
            s.ciudad.toLowerCase().includes(q)
          )
      );
    }

    return result;
  }, [cadenas, porCadena, searchQuery]);

  return (
    <div className="relative z-10 -mt-16 md:-mt-24 pb-10">
      {rows.map((row) => (
        <CarouselRow
          key={row.cadena}
          title={row.cadena}
          stations={row.stations}
          currentIndex={currentIndex}
          favorites={favorites}
          onPlay={playStation}
          onFav={toggleFavorite}
        />
      ))}

      {rows.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          No se encontraron emisoras con ese criterio de búsqueda.
        </div>
      )}
    </div>
  );
}
