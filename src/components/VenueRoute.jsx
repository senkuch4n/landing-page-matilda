import CtaButton from './CtaButton';
import HudCorners from './HudCorners';
import VenueTour3D from './VenueTour3D';
import useScrollReveal from '../hooks/useScrollReveal';
import './VenueRoute.css';

function VenueRoute({ venue }) {
  const ref = useScrollReveal();

  return (
    <section className="venue flat-section" id="venue">
      <div ref={ref} className="venue__inner">
        <span className="hud-kicker">{venue.kicker}</span>
        <h2 className="hud-heading venue__heading">{venue.heading}</h2>
        <p className="venue__name">{venue.name}</p>
        <p className="venue__address">{venue.address}</p>

        <VenueTour3D photos={venue.photos} />

        <div className="venue__actions">
          <CtaButton href={venue.directionsHref} variant="primary" showIcon external>
            {venue.directionsLabel}
          </CtaButton>
        </div>

        <div className="venue__map hud-panel">
          <HudCorners />
          <iframe
            className="venue__map-frame"
            title={venue.name}
            src={venue.mapEmbedSrc}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}

export default VenueRoute;
