import { useEffect, useState } from 'react';
import HudCorners from './HudCorners';
import useScrollReveal from '../hooks/useScrollReveal';
import './VenueGallery.css';

const PLACEHOLDER_SLOTS = 6;

function VenueGallery({ content }) {
  const ref = useScrollReveal();
  const [activeIndex, setActiveIndex] = useState(null);
  const hasPhotos = content.photos.length > 0;

  useEffect(() => {
    if (activeIndex === null) return undefined;
    function onKeyDown(e) {
      if (e.key === 'Escape') setActiveIndex(null);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeIndex]);

  return (
    <section className="gallery" id="gallery">
      <div ref={ref} className="gallery__inner">
        <span className="hud-kicker">{content.kicker}</span>
        <h2 className="hud-heading gallery__heading">{content.heading}</h2>
        <p className="gallery__description">{content.description}</p>

        <div className="gallery__grid">
          {hasPhotos
            ? content.photos.map((photo, i) => (
                <button
                  type="button"
                  key={photo.src}
                  className="gallery__tile"
                  onClick={() => setActiveIndex(i)}
                >
                  <HudCorners />
                  <img src={photo.src} alt={photo.alt} loading="lazy" />
                </button>
              ))
            : Array.from({ length: PLACEHOLDER_SLOTS }).map((_, i) => (
                <div className="gallery__tile gallery__tile--empty" key={i}>
                  <HudCorners dim />
                  <span>Próximamente</span>
                </div>
              ))}
        </div>
      </div>

      {activeIndex !== null && hasPhotos && (
        <div className="gallery__lightbox" onClick={() => setActiveIndex(null)}>
          <img src={content.photos[activeIndex].src} alt={content.photos[activeIndex].alt} />
        </div>
      )}
    </section>
  );
}

export default VenueGallery;
