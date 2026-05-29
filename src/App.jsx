import { useEffect, useMemo, useState } from 'react';
import { RadioProvider, useRadio } from './context/RadioContext';
import { useAudio } from './hooks/useAudio';
import { getEmisoras } from './services/api';
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

  const ciudades = useMemo(() => {
    const set = new Set(emisoras.map((e) => e.ciudad));
    return ['Todas', ...Array.from(set).sort()];
  }, [emisoras]);

  const cadenas = useMemo(() => {
    const set = new Set(emisoras.map((e) => e.cadena));
    return Array.from(set).sort();
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
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-xl">Cargando emisoras...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 text-center">
        <div>
          <p className="text-red-500 text-xl mb-2">⚠️ Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-28">
      <Header ciudades={ciudades} />
      <Hero emisoras={emisoras} />
      <StationGrid emisoras={emisoras} ciudades={ciudades} cadenas={cadenas} />
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
