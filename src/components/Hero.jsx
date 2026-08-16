import CtaButton from './CtaButton';
import './Hero.css';

function Hero({ hero, bottom }) {
  return (
    <main className="hero">
      <p className="hero__side-note">{hero.sideNote}</p>

      <h1 className="hero__title">
        {hero.titleLines.map((line, i) => (
          <span className="hero__title-line" key={i}>
            {line}
          </span>
        ))}
      </h1>

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
