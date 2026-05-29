import { emisoras, ordenCadenas, cadenaColors } from '../data/stations';

export default function CategoryGrid() {
  const porCadena = {};
  emisoras.forEach((e) => {
    if (!porCadena[e.cadena]) porCadena[e.cadena] = [];
    porCadena[e.cadena].push(e);
  });

  const scrollToSection = (cadena) => {
    const id = 'section-' + cadena.replace(/\s+/g, '-');
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <section className="content-section" id="cadenas-section">
        <div className="section-header">
          <h2 className="section-title">
            Explorar por Cadena
            <span className="explore-arrow">&#8594;</span>
          </h2>
        </div>
      </section>
      <div className="categories-grid">
        {ordenCadenas.map((cadena) => {
          if (!porCadena[cadena]) return null;
          const colors = cadenaColors[cadena] || ['#666', '#888'];
          return (
            <div
              key={cadena}
              className="category-card"
              style={{ '--c1': colors[0], '--c2': colors[1] }}
              onClick={() => scrollToSection(cadena)}
            >
              <div className="cat-bg"></div>
              <div className="cat-icon">&#127897;</div>
              <h3>{cadena}</h3>
              <span className="cat-count">{porCadena[cadena].length} emisoras</span>
            </div>
          );
        })}
      </div>
    </>
  );
}
