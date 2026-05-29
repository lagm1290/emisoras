import { createContext, useContext, useState, useRef, useCallback } from 'react';

const RadioContext = createContext(null);

export function RadioProvider({ children }) {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('radioflix_favs') || '[]');
    } catch {
      return [];
    }
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  const [elapsedTime, setElapsedTime] = useState('0:00');
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const startTimeRef = useRef(0);

  const showToast = useCallback((message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  const toggleFavorite = useCallback((index) => {
    setFavorites((prev) => {
      const idx = prev.indexOf(index);
      let next;
      if (idx > -1) {
        next = prev.filter((i) => i !== index);
        showToast('💔 Eliminado de favoritos');
      } else {
        next = [...prev, index];
        showToast('❤️ Añadido a favoritos');
      }
      localStorage.setItem('radioflix_favs', JSON.stringify(next));
      return next;
    });
  }, [showToast]);

  const clearToast = useCallback(() => setToastMessage(null), []);

  const value = {
    currentIndex,
    setCurrentIndex,
    isPlaying,
    setIsPlaying,
    favorites,
    setFavorites,
    searchQuery,
    setSearchQuery,
    toastMessage,
    showToast,
    clearToast,
    elapsedTime,
    setElapsedTime,
    isMuted,
    setIsMuted,
    volume,
    setVolume,
    audioRef,
    progressIntervalRef,
    startTimeRef,
    toggleFavorite,
  };

  return (
    <RadioContext.Provider value={value}>
      {children}
    </RadioContext.Provider>
  );
}

export function useRadio() {
  const ctx = useContext(RadioContext);
  if (!ctx) throw new Error('useRadio must be used within RadioProvider');
  return ctx;
}
