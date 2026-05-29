import { useRadio } from '../context/RadioContext';
import { stringToGradient } from '../utils/colors';
import { useAudio } from '../hooks/useAudio';

export default function StationCard({ station, index, featured = false, hidden = false }) {
  const { currentIndex } = useRadio();
  const { playStation } = useAudio();
  const isPlaying = currentIndex === index;
  const gradient = stringToGradient(station.cadena + station.ciudad);

  return (
    <div
      className={`station-card ${featured ? 'featured' : ''} ${isPlaying ? 'playing' : ''}`}
      data-index={index}
      onClick={() => playStation(index)}
      style={{ display: hidden ? 'none' : '' }}
    >
      <div className="playing-now">REPRODUCIENDO</div>
      <div
        className="card-image"
        style={{
          background: gradient,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ fontSize: featured ? '3rem' : '2rem', opacity: 0.7 }}>&#127897;</span>
        <div className="card-overlay">
          <div className="play-btn">
            <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </div>
        </div>
      </div>
      <div className="card-info">
        <div className="card-title">{station.titulo}</div>
        <div className="card-meta">
          <span className="live-indicator"><span className="dot"></span>EN VIVO</span>
          <span>{station.ciudad}</span>
        </div>
        <span className="genre-tag">{station.via === 'streamtheworld' ? 'StreamTheWorld' : 'Radio.Garden'}</span>
      </div>
    </div>
  );
}
