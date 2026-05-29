import { useEffect, useMemo, useState } from 'react';
import { RadioProvider, useRadio } from './context/RadioContext';
import { useAudio } from './hooks/useAudio';
import { getEmisoras } from './services/api';
import { ordenCadenas } from './data/stations';
import Header from './components/Header';
import Hero from './components/Hero';
import StationGrid from './components/StationGrid';
import PlayerBar from './components/PlayerBar';
import './index.css';

function AppContent() {
  const { emisoras, setEmisoras } = useRadio();
  const { togglePlay, nextStation, prevStation } = useAudio();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getEmisoras()
      .then((data) => {
        setEmisoras(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error cargando emisoras:', err);
        setError('No se pudieron cargar las emisoras.');
        setLoading(false);
      });
  }, [setEmisoras]);

  const cadenas = useMemo(() => {
    const presentes = new Set(emisoras.map((e) => e.cadena));
    return ordenCadenas.filter((c) => presentes.has(c));
  }, [emisoras]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'SELECT') {
        e.preventDefault();
        togglePlay();
      }
      if (e.code === 'ArrowRight' && e.ctrlKey) {
        e.preventDefault();
        nextStation();
      }
      if (e.code === 'ArrowLeft' && e.ctrlKey) {
        e.preventDefault();
        prevStation();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [togglePlay, nextStation, prevStation]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141414] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400">Cargando emisoras...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#141414] text-white flex items-center justify-center px-4 text-center">
        <div>
          <p className="text-red-500 text-xl mb-2">⚠️ Error</p>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141414] text-white pb-24">
      <Header />
      <Hero emisoras={emisoras} />
      <StationGrid emisoras={emisoras} cadenas={cadenas} />
      <PlayerBar />
    </div>
  );
}

function App() {
  return (
    <RadioProvider>
      <AppContent />
    </RadioProvider>
  );
}

export default App;
