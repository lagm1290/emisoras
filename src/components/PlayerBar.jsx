import { useRef, useCallback } from 'react';
import { useRadio } from '../context/RadioContext';
import { useAudio } from '../hooks/useAudio';

export default function PlayerBar() {
  const {
    emisoras,
    currentIndex,
    isPlaying,
    elapsedTime,
    favorites,
    toggleFavorite,
    isMuted,
    volume,
    setVolume,
    audioRef,
  } = useRadio();
  const { togglePlay, nextStation, prevStation, toggleMute, setVolumeLevel } = useAudio();
  const volSliderRef = useRef(null);

  const station = currentIndex !== -1 ? emisoras[currentIndex] : null;
  const isFav = currentIndex !== -1 && favorites.includes(currentIndex);

  const handleVolumeClick = useCallback((e) => {
    if (!volSliderRef.current) return;
    const rect = volSliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, x / rect.width));
    setVolume(pct);
    setVolumeLevel(pct);
  }, [setVolume, setVolumeLevel]);

  if (!station) {
    return (
      <>
        <div className="fixed bottom-0 left-0 right-0 h-20 bg-zinc-900/95 backdrop-blur-md border-t border-zinc-800 flex items-center justify-between px-6 md:px-10 z-50 translate-y-full transition-transform duration-300">
          <span className="text-zinc-500 text-sm">Selecciona una emisora</span>
        </div>
        <audio ref={audioRef} preload="none" />
      </>
    );
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-zinc-900/95 backdrop-blur-md border-t border-zinc-800 flex items-center justify-between px-4 md:px-10 z-50">
        {/* Info */}
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-xl shrink-0">
            &#127897;
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-semibold truncate">{station.titulo}</h4>
            <p className="text-xs text-zinc-400 truncate">{station.cadena} - {station.ciudad}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-1 flex-1 max-w-md mx-4">
          <div className="flex items-center gap-4">
            <button onClick={prevStation} className="text-zinc-400 hover:text-white transition">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
            </button>
            <button
              onClick={togglePlay}
              className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center hover:bg-red-500 hover:text-white transition"
            >
              {isPlaying ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              )}
            </button>
            <button onClick={nextStation} className="text-zinc-400 hover:text-white transition">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
            </button>
          </div>
          <div className="w-full flex items-center gap-2 text-xs text-zinc-500">
            <span className="w-10 text-right">{elapsedTime}</span>
            <div className="flex-1 h-1 bg-zinc-700 rounded-full">
              <div className="h-full bg-red-600 rounded-full w-0" />
            </div>
            <span className="w-10">Live</span>
          </div>
        </div>

        {/* Volume + Fav */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => toggleFavorite(currentIndex)}
            className="text-zinc-400 hover:text-red-500 transition"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill={isFav ? '#e50914' : 'none'} stroke={isFav ? '#e50914' : 'currentColor'} strokeWidth="2">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </button>
          <button onClick={toggleMute} className="text-zinc-400 hover:text-white transition">
            {isMuted ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73 4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
            )}
          </button>
          <div className="w-20 h-1 bg-zinc-700 rounded-full relative cursor-pointer" ref={volSliderRef} onClick={handleVolumeClick}>
            <div className="h-full bg-white rounded-full" style={{ width: `${volume * 100}%` }} />
          </div>
        </div>
      </div>
      <audio ref={audioRef} preload="none" />
    </>
  );
}
