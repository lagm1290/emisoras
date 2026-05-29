import { useState, useEffect } from 'react';
import { useRadio } from '../context/RadioContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const { searchQuery, setSearchQuery } = useRadio();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-left">
        <div className="logo">RadioFlix</div>
        <ul className="nav-links">
          <li><a href="#inicio">Inicio</a></li>
          <li><a href="#emisoras">Emisoras</a></li>
          <li><a href="#ciudades">Ciudades</a></li>
          <li><a href="#cadenas">Cadenas</a></li>
          <li><a href="#favoritos">Favoritos</a></li>
        </ul>
      </div>
      <div className="nav-right">
        <div className="search-box">
          <input
            type="text"
            placeholder="Buscar emisoras..."
            className={searchActive ? 'active' : ''}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="search-icon" onClick={() => setSearchActive(!searchActive)}>&#128269;</span>
        </div>
        <div className="user-avatar">U</div>
      </div>
    </nav>
  );
}
