import useScrollReveal from '../hooks/useScrollReveal';
import './DressCode.css';

function DressCode({ content }) {
  const ref = useScrollReveal();

  return (
    <section className="dress-code" id="dress-code">
      <div ref={ref} className="dress-code__inner">
        <svg className="dress-code__icon" viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <path
            d="M8 18L24 6L40 18L24 42L8 18Z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <path
            d="M8 18H40M17 18L24 6L31 18M17 18L24 42M31 18L24 42"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.55"
          />
        </svg>

        <span className="hud-kicker">{content.kicker}</span>
        <h2 className="hud-heading dress-code__heading">{content.heading}</h2>
        <p className="dress-code__note">{content.note}</p>
      </div>
    </section>
  );
}

export default DressCode;
