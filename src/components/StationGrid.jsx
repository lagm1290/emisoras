import { useState, useMemo } from 'react';
import { useRadio } from '../context/RadioContext';
import { useAudio } from '../hooks/useAudio';
import { stringToGradient } from '../utils/colors';

export default function StationGrid({ emisoras, ciudades, cadenas }) {
  const { searchQuery } = useRadio();
  const { playStation } = useAudio();
  const { favorites, currentIndex } = useRadio();
  const [selectedCityFilter, setSelectedCityFilter] = useState('Todas');
  const [expandedCard, setExpandedCard] = useState(null);

  // Agrupar emisoras por cadena
  const porCadena = useMemo(() => {
    const map = {};
    emisoras.forEach((e, idx) => {
      if (!map[e.cadena]) {
        map[e.cadena] = {
          cadena: e.cadena,
          emisoras: [],
          ciudades: [],
        };
      }
      map[e.cadena].emisoras.push({ ...e, index: idx });
      map[e.cadena].ciudades.push(e.ciudad);
    });
    return map;
  }, [emisoras]);

  // Filtrar cadenas
  const filteredCadenas = useMemo(() => {
    let result = cadenas.map((c) => porCadena[c]).filter(Boolean);

    if (selectedCityFilter !== 'Todas') {
      result = result.filter((c) => c.ciudades.includes(selectedCityFilter));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.cadena.toLowerCase().includes(q) ||
          c.ciudades.some((ciu) => ciu.toLowerCase().includes(q))
      );
    }

    return result;
  }, [porCadena, cadenas, selectedCityFilter, searchQuery]);

  const gradientMap = {
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
  };

  return (
    <main className="px-6 md:px-10 py-10 space-y-10">
      {/* Filtros */}
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex items-center gap-3">
          <span className="text-zinc-400 text-sm">Ciudad:</span>
          <div className="relative">
            <select
              value={selectedCityFilter}
              onChange={(e) => setSelectedCityFilter(e.target.value)}
              className="appearance-none bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2 pr-10 text-sm text-white outline-none hover:border-red-500 transition cursor-pointer"
            >
              {ciudades.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none text-xs">▼</span>
          </div>
        </div>

        {selectedCityFilter !== 'Todas' && (
          <button
            onClick={() => setSelectedCityFilter('Todas')}
            className="text-red-500 text-sm hover:underline"
          >
            Ver todas las ciudades
          </button>
        )}
      </div>

      {/* Grid de Cadenas */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-2xl font-bold">Emisoras por Cadena</h3>
          <span className="text-zinc-500 text-sm">{filteredCadenas.length} cadenas</span>
        </div>

        {filteredCadenas.length === 0 ? (
          <p className="text-zinc-500 text-center py-10">No se encontraron emisoras con esos filtros.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCadenas.map((cadenaData) => {
              const isExpanded = expandedCard === cadenaData.cadena;
              const count = cadenaData.emisoras.length;
              const gradient = gradientMap[cadenaData.cadena] || 'from-zinc-700 to-zinc-500';

              return (
                <div
                  key={cadenaData.cadena}
                  className="group relative overflow-hidden rounded-3xl bg-zinc-900 hover:scale-[1.02] transition duration-300 shadow-2xl"
                >
                  {/* Header de tarjeta */}
                  <div
                    className={`h-48 w-full flex flex-col items-center justify-center bg-gradient-to-br ${gradient} relative p-5`}
                  >
                    <span className="text-5xl mb-2 opacity-80">&#127897;</span>
                    <h4 className="text-2xl font-bold text-center">{cadenaData.cadena}</h4>
                    <span className="text-sm opacity-90 mt-1">{count} ciudades</span>

                    {cadenaData.emisoras.some((e) => e.index === currentIndex) && (
                      <div className="absolute top-3 right-3 bg-white text-black text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                        REPRODUCIENDO
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    {/* Ciudades disponibles */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {cadenaData.emisoras.map((station) => (
                        <button
                          key={station.id}
                          onClick={() => playStation(station.index)}
                          className={`text-xs px-3 py-1.5 rounded-full transition font-medium ${
                            station.index === currentIndex
                              ? 'bg-red-600 text-white'
                              : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white'
                          }`}
                        >
                          {station.ciudad}
                        </button>
                      ))}
                    </div>

                    {/* Expandir lista */}
                    <button
                      onClick={() => setExpandedCard(isExpanded ? null : cadenaData.cadena)}
                      className="w-full text-center text-sm text-zinc-500 hover:text-white transition py-2"
                    >
                      {isExpanded ? 'Ocultar detalles ▲' : 'Ver ciudades ▼'}
                    </button>

                    {/* Lista expandida */}
                    {isExpanded && (
                      <div className="mt-3 space-y-2 border-t border-zinc-800 pt-3">
                        {cadenaData.emisoras.map((station) => {
                          const isFav = favorites.includes(station.index);
                          return (
                            <div
                              key={station.id}
                              className="flex items-center justify-between bg-zinc-800/50 rounded-xl px-3 py-2"
                            >
                              <div className="min-w-0">
                                <p className="text-sm font-semibold truncate">{station.titulo}</p>
                                <p className="text-xs text-zinc-500">{station.via}</p>
                              </div>
                              <div className="flex gap-2 shrink-0">
                                <button
                                  onClick={() => playStation(station.index)}
                                  className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1.5 rounded-lg font-medium transition"
                                >
                                  {station.index === currentIndex ? 'Pausar' : 'Escuchar'}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}


