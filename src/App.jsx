import { useEffect, useMemo } from 'react';
import { RadioProvider, useRadio } from './context/RadioContext';
import { useAudio } from './hooks/useAudio';
import { emisoras, ordenCadenas } from './data/stations';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StationCarousel from './components/StationCarousel';
import CategoryGrid from './components/CategoryGrid';
import NowPlaying from './components/NowPlaying';
import Toast from './components/Toast';
import './App.css';

function AppContent() {
  const { searchQuery } = useRadio();
  const { togglePlay, nextStation, prevStation } = useAudio();

  // Agrupar emisoras por cadena
  const porCadena = useMemo(() => {
    const map = {};
    emisoras.forEach((e, idx) => {
      const item = { ...e, index: idx };
      if (!map[e.cadena]) map[e.cadena] = [];
      map[e.cadena].push(item);
    });
    return map;
  }, []);

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
      <CategoryGrid />
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
