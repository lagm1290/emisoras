import { useCallback, useEffect } from 'react';
import { useRadio } from '../context/RadioContext';

export function useAudio() {
  const {
    emisoras,
    currentIndex,
    setCurrentIndex,
    isPlaying,
    setIsPlaying,
    audioRef,
    progressIntervalRef,
    startTimeRef,
    setElapsedTime,
    showToast,
    volume,
    isMuted,
    setIsMuted,
  } = useRadio();

  const stopProgress = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, [progressIntervalRef]);

  const startProgress = useCallback(() => {
    stopProgress();
    startTimeRef.current = Date.now() - parseTime(document.getElementById('npTime')?.textContent || '0:00') * 1000;
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const mins = Math.floor(elapsed / 60);
      const secs = elapsed % 60;
      setElapsedTime(`${mins}:${secs.toString().padStart(2, '0')}`);
    }, 1000);
  }, [stopProgress, progressIntervalRef, startTimeRef, setElapsedTime]);

  const playStation = useCallback((index) => {
    if (index < 0 || index >= emisoras.length) return;
    const station = emisoras[index];
    const audio = audioRef.current;
    if (!audio) return;

    audio.src = station.url;
    audio.play().then(() => {
      setCurrentIndex(index);
      setIsPlaying(true);
      setElapsedTime('0:00');
      startProgress();
      showToast(`▶ Reproduciendo: ${station.titulo}`);
    }).catch((err) => {
      console.error('Error reproduciendo:', err);
      showToast('⚠️ Error al reproducir. Intenta otra emisora.');
    });
  }, [emisoras, audioRef, setCurrentIndex, setIsPlaying, setElapsedTime, startProgress, showToast]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || currentIndex === -1) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      stopProgress();
      showToast('⏸ Pausado');
    } else {
      audio.play();
      setIsPlaying(true);
      startProgress();
      showToast('▶ Reanudando');
    }
  }, [audioRef, currentIndex, isPlaying, setIsPlaying, stopProgress, startProgress, showToast]);

  const nextStation = useCallback(() => {
    if (currentIndex === -1 || emisoras.length === 0) return;
    let next = currentIndex + 1;
    if (next >= emisoras.length) next = 0;
    playStation(next);
  }, [currentIndex, emisoras.length, playStation]);

  const prevStation = useCallback(() => {
    if (currentIndex === -1 || emisoras.length === 0) return;
    let prev = currentIndex - 1;
    if (prev < 0) prev = emisoras.length - 1;
    playStation(prev);
  }, [currentIndex, emisoras.length, playStation]);

  const setVolumeLevel = useCallback((pct) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = pct;
  }, [audioRef]);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setIsMuted(audio.muted);
  }, [audioRef, setIsMuted]);

  // Initialize volume on mount
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [audioRef, volume]);

  return {
    playStation,
    togglePlay,
    nextStation,
    prevStation,
    setVolumeLevel,
    toggleMute,
  };
}

function parseTime(t) {
  if (!t || t === 'Live') return 0;
  const parts = t.split(':');
  return parseInt(parts[0] || 0) * 60 + parseInt(parts[1] || 0);
}
