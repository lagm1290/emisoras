import { useState, useMemo } from 'react';
import { useRadio } from '../context/RadioContext';
import { useAudio } from '../hooks/useAudio';
import { stringToGradient } from '../utils/colors';

export default function StationGrid({ emisoras, ciudades, cadenas }) {
  const { searchQuery } = useRadio();
  const { playStation, toggleFavorite } = useAudio();
  const { favorites, currentIndex } = useRadio();
  const [selectedCity, setSelectedCity] = useState('Todas');
  const [selectedCadena, setSelectedCadena] = useState(null);

  const filtered = useMemo(() => {
    let result = emisoras.map((e, idx) => ({ ...e, index: idx }));

    if (selectedCity !== 'Todas') {
      result = result.filter((s) => s.ciudad === selectedCity);
    }

    if (selectedCadena) {
      result = result.filter((s) => s.cadena === selectedCadena);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.titulo.toLowerCase().includes(q) ||
          s.ciudad.toLowerCase().includes(q) ||
          s.cadena.toLowerCase().includes(q)
      );
    }

    return result;
  }, [emisoras, selectedCity, selectedCadena, searchQuery]);

  return (
    <main className="px-6 md:px-10 py-10 space-y-10">
      {/* Filtros */}
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex items-center gap-3">
          <span className="text-zinc-400 text-sm">Ciudad:</span>
          <div className="relative">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="appearance-none bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2 pr-10 text-sm text-white outline-none hover:border-red-500 transition cursor-pointer"
            >
              {ciudades.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none text-xs">▼</span>
          </div>
        </div>

        {selectedCadena && (
          <button
            onClick={() => setSelectedCadena(null)}
            className="text-red-500 text-sm hover:underline"
          >
            Limpiar filtro: {selectedCadena}
          </button>
        )}
      </div>

      {/* Grid */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-2xl font-bold">{selectedCadena || 'Todas las emisoras'}</h3>
          <span className="text-zinc-500 text-sm">{filtered.length} resultados</span>
        </div>

        {filtered.length === 0 ? (
          <p className="text-zinc-500 text-center py-10">No se encontraron emisoras con esos filtros.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((station) => {
              const isPlaying = currentIndex === station.index;
              const isFav = favorites.includes(station.index);
              const gradient = stringToGradient(station.cadena + station.ciudad);

              return (
                <div
                  key={station.id}
                  className="group relative overflow-hidden rounded-3xl bg-zinc-900 hover:scale-[1.02] transition duration-300 shadow-2xl cursor-pointer"
                  onClick={() => playStation(station.index)}
                >
                  <div
                    className="h-64 w-full flex items-center justify-center relative"
                    style={{ background: gradient }}
                  >
                    <span className="text-5xl opacity-60">&#127897;</span>
                    {isPlaying && (
                      <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                        REPRODUCIENDO
                      </div>
                    )}
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                  <div className="absolute bottom-0 p-5 w-full">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs bg-red-600 px-3 py-1 rounded-full font-medium">
                        {station.cadena}
                      </span>
                      <span className="text-xs bg-green-500 px-2 py-1 rounded-full font-bold animate-pulse">
                        LIVE
                      </span>
                    </div>

                    <h4 className="text-xl font-bold mb-1 truncate">{station.titulo}</h4>

                    <div className="flex items-center justify-between text-sm text-zinc-300 mb-4">
                      <span>&#128205; {station.ciudad}</span>
                      <span>{station.via === 'streamtheworld' ? 'StreamTheWorld' : 'Radio.Garden'}</span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          playStation(station.index);
                        }}
                        className="flex-1 bg-red-600 hover:bg-red-700 py-2.5 rounded-xl font-semibold transition shadow-lg shadow-red-600/30 text-sm"
                      >
                        {isPlaying ? 'Pausar' : 'Escuchar ahora'}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(station.index);
                        }}
                        className="w-10 h-10 rounded-xl bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition"
                        title={isFav ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill={isFav ? '#e50914' : 'none'} stroke={isFav ? '#e50914' : 'currentColor'} strokeWidth="2">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Categorías (Cadenas) */}
      <section>
        <h3 className="text-2xl font-bold mb-5">Cadenas</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {cadenas.map((cadena) => {
            const count = emisoras.filter((e) => e.cadena === cadena).length;
            const colors = {
              'Olímpica Stereo': 'from-red-600 to-red-400',
              'La FM': 'from-orange-600 to-orange-400',
              'Radio Uno': 'from-green-600 to-green-400',
              'La Mega': 'from-purple-600 to-purple-400',
              'Mix Radio': 'from-cyan-600 to-cyan-400',
              'Radio Tiempo': 'from-yellow-600 to-yellow-400',
              'Alerta': 'from-pink-600 to-pink-400',
              'El Sol': 'from-amber-600 to-amber-400',
              'La Reina': 'from-teal-600 to-teal-400',
              'Emisora Atlántico': 'from-indigo-600 to-indigo-400',
            }[cadena] || 'from-zinc-700 to-zinc-500';

            return (
              <button
                key={cadena}
                onClick={() => setSelectedCadena(selectedCadena === cadena ? null : cadena)}
                className={`bg-gradient-to-br ${colors} hover:opacity-90 transition rounded-2xl p-6 text-center font-bold text-lg cursor-pointer ${selectedCadena === cadena ? 'ring-2 ring-white' : ''}`}
              >
                <div className="text-2xl mb-1">&#127897;</div>
                <div>{cadena}</div>
                <div className="text-xs opacity-80 mt-1">{count} emisoras</div>
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
}
