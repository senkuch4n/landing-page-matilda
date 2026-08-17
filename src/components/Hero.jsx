import CtaButton from './CtaButton';
import HudCorners from './HudCorners';
import FamilyPhoto from './FamilyPhoto';
import useCountdown from '../hooks/useCountdown';
import './Hero.css';

function pad(n) {
  return String(n).padStart(2, '0');
}

function Hero({ hero, bottom, event, familyPhotoSrc }) {
  const { timeLeft, targetDate } = useCountdown(event.dateISO);

  const formattedDate = targetDate.toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const startTime = targetDate.toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const units = [
    { value: timeLeft.days, label: event.labels.days },
    { value: timeLeft.hours, label: event.labels.hours },
    { value: timeLeft.minutes, label: event.labels.minutes },
    { value: timeLeft.seconds, label: event.labels.seconds },
  ];

  return (
    <main className="hero" id="hero">
      {familyPhotoSrc && <FamilyPhoto src={familyPhotoSrc} corner="bottom-right" rotate={-7} size={170} />}

      <p className="hero__side-note">{hero.sideNote}</p>

      <h1 className="hero__title">
        {hero.titleLines.map((line, i) => (
          <span className="hero__title-line" key={i}>
            {line}
          </span>
        ))}
      </h1>


      <div className="hero__countdown" id="countdown">
        <span className="hud-kicker">{event.kicker}</span>
        <p className="hero__countdown-date">
          {formattedDate} · {startTime}
          {event.endTimeLabel ? ` – ${event.endTimeLabel} hs` : ' hs'}
        </p>

        <div className="hero__countdown-units">
          {units.map((unit) => (
            <div className="hero__countdown-unit hud-panel" key={unit.label}>
              <HudCorners />
              <span className="hero__countdown-value">
                {timeLeft.total > 0 ? pad(unit.value) : '00'}
              </span>
              <span className="hero__countdown-label">{unit.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="hero__bottom">
        <div className="hero__intro">
          <span className="hero__kicker">{bottom.kicker}</span>
          <span className="hero__kicker-divider" aria-hidden="true" />
          <p className="hero__copy">{bottom.copy}</p>
        </div>

        <div className="hero__actions">
          <CtaButton href={bottom.primaryCta.href} variant="primary" showIcon>
            {bottom.primaryCta.label}
          </CtaButton>
          <CtaButton href={bottom.secondaryCta.href} variant="secondary">
            {bottom.secondaryCta.label}
          </CtaButton>
        </div>
      </div>
    </main>
  );
}

export default Hero;
