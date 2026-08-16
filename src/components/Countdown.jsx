import { useEffect, useState } from 'react';
import HudCorners from './HudCorners';
import useScrollReveal from '../hooks/useScrollReveal';
import './Countdown.css';

function getTimeLeft(targetDate) {
  const diff = Math.max(0, targetDate.getTime() - Date.now());
  return {
    total: diff,
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function pad(n) {
  return String(n).padStart(2, '0');
}

function Countdown({ event }) {
  const targetDate = new Date(event.dateISO);
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(targetDate));
  const ref = useScrollReveal();

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft(targetDate)), 1000);
    return () => clearInterval(id);
  }, [event.dateISO]);

  const units = [
    { value: timeLeft.days, label: event.labels.days },
    { value: timeLeft.hours, label: event.labels.hours },
    { value: timeLeft.minutes, label: event.labels.minutes },
    { value: timeLeft.seconds, label: event.labels.seconds },
  ];

  const formattedDate = targetDate.toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <section className="countdown" id="countdown">
      <div ref={ref} className="countdown__inner">
        <span className="hud-kicker">{event.kicker}</span>
        <h2 className="hud-heading countdown__heading">{event.heading}</h2>
        <p className="countdown__date">{formattedDate}</p>

        <div className="countdown__units">
          {units.map((unit) => (
            <div className="countdown__unit hud-panel" key={unit.label}>
              <HudCorners />
              <span className="countdown__value">
                {timeLeft.total > 0 ? pad(unit.value) : '00'}
              </span>
              <span className="countdown__label">{unit.label}</span>
            </div>
          ))}
        </div>

        {timeLeft.total <= 0 && <p className="countdown__over">¡Hoy es el gran día!</p>}
      </div>
    </section>
  );
}

export default Countdown;
