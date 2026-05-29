import { useEffect, useMemo, useState } from 'react';
import { RadioProvider, useRadio } from './context/RadioContext';
import { useAudio } from './hooks/useAudio';
import { getEmisoras } from './services/api';
import { ordenCadenas } from './data/stations';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StationCarousel from './components/StationCarousel';
import CategoryGrid from './components/CategoryGrid';
import NowPlaying from './components/NowPlaying';
import Toast from './components/Toast';
import './App.css';

function AppContent() {
  const { emisoras, setEmisoras, searchQuery } = useRadio();
  const { togglePlay, nextStation, prevStation } = useAudio();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar emisoras desde la API
  useEffect(() => {
    getEmisoras()
      .then((data) => {
        setEmisoras(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error cargando emisoras:', err);
        setError('No se pudieron cargar las emisoras. ¿El backend está corriendo en http://localhost:8000?');
        setLoading(false);
      });
  }, [setEmisoras]);

  // Agrupar emisoras por cadena
  const porCadena = useMemo(() => {
    const map = {};
    emisoras.forEach((e, idx) => {
      const item = { ...e, index: idx };
      if (!map[e.cadena]) map[e.cadena] = [];
      map[e.cadena].push(item);
    });
    return map;
  }, [emisoras]);

  // Cadenas con conteo para CategoryGrid
  const cadenasData = useMemo(() => {
    return ordenCadenas
      .map((cadena) => ({
        cadena,
        count: porCadena[cadena]?.length || 0,
      }))
      .filter((c) => c.count > 0);
  }, [porCadena]);

  // Atajos de teclado
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'white', background: '#141414' }}>
        <p>Cargando emisoras...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'white', background: '#141414', padding: '0 20px', textAlign: 'center' }}>
        <p style={{ color: '#e50914', fontSize: '1.2rem', marginBottom: '10px' }}>⚠️ Error</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Hero />
      <div id="content-area">
        {ordenCadenas.map((cadena) => {
          const lista = porCadena[cadena];
          if (!lista || lista.length === 0) return null;
          return <StationCarousel key={cadena} cadena={cadena} stations={lista} searchQuery={searchQuery} />;
        })}
      </div>
      <CategoryGrid cadenas={cadenasData} />
      <NowPlaying />
      <Toast />
    </>
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
