import { useState, useEffect } from 'react';
import { useRadio } from '../context/RadioContext';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { searchQuery, setSearchQuery } = useRadio();
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 px-4 md:px-12 py-4 flex items-center justify-between transition-colors duration-500 ${
        scrolled ? 'bg-[#141414]' : 'bg-gradient-to-b from-black/70 to-transparent'
      }`}
    >
      <div className="flex items-center gap-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-wider text-[#E50914]" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
          RADIOFLIX
        </h1>
        <nav className="hidden md:flex items-center gap-5 text-sm">
          <a href="#" className="text-white hover:text-gray-300 transition font-medium">Inicio</a>
          <a href="#" className="text-gray-300 hover:text-white transition">Cadenas</a>
          <a href="#" className="text-gray-300 hover:text-white transition">Ciudades</a>
          <a href="#" className="text-gray-300 hover:text-white transition">Favoritos</a>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <div className={`flex items-center border ${searchOpen ? 'border-white bg-black/80' : 'border-transparent'} transition-all duration-300`}>
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 text-white hover:text-gray-300"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </button>
          <input
            type="text"
            placeholder="Títulos, cadenas, ciudades"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`bg-transparent text-white text-sm outline-none placeholder-gray-400 transition-all duration-300 ${
              searchOpen ? 'w-48 md:w-64 px-2 py-1 opacity-100' : 'w-0 px-0 py-1 opacity-0'
            }`}
          />
        </div>
        <div className="w-8 h-8 rounded bg-[#E50914] flex items-center justify-center text-sm font-bold cursor-pointer">
          U
        </div>
      </div>
    </header>
  );
}
