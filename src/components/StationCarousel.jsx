import { useRef } from 'react';
import StationCard from './StationCard';

export default function StationCarousel({ cadena, stations, searchQuery }) {
  const carouselRef = useRef(null);

  const scroll = (direction) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: direction * 300, behavior: 'smooth' });
    }
  };

  const sectionId = 'section-' + cadena.replace(/\s+/g, '-');
  const query = searchQuery.toLowerCase();

  return (
    <section className="content-section" id={sectionId}>
      <div className="section-header">
        <h2 className="section-title">
          {cadena}
          <span className="station-count">{stations.length} emisoras</span>
          <span className="explore-arrow">&#8594;</span>
        </h2>
      </div>
      <div className="carousel-container">
        <button className="carousel-nav prev" onClick={() => scroll(-1)}>&#8249;</button>
        <div className="carousel" ref={carouselRef}>
          {stations.map((s, i) => {
            const matches = !query ||
              s.titulo.toLowerCase().includes(query) ||
              s.ciudad.toLowerCase().includes(query) ||
              s.cadena.toLowerCase().includes(query);
            return (
              <StationCard
                key={s.index}
                station={s}
                index={s.index}
                featured={i === 0}
                hidden={!matches}
              />
            );
          })}
        </div>
        <button className="carousel-nav next" onClick={() => scroll(1)}>&#8250;</button>
      </div>
    </section>
  );
}
