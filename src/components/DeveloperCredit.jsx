import useScrollReveal from '../hooks/useScrollReveal';
import './DeveloperCredit.css';

function DeveloperCredit({ content }) {
  const ref = useScrollReveal();
  const { links } = content;

  return (
    <section className="credit" id="credit">
      <div ref={ref} className="credit__inner">
        <span className="hud-kicker">{content.kicker}</span>

        <div className="credit__split">
          <h2 className="credit__name">
            {content.nameLines.map((line) => (
              <span className="credit__name-line" key={line}>
                {line}
              </span>
            ))}
          </h2>

          <p className="credit__bio">{content.bio}</p>
        </div>

        <div className="credit__meta">
          <span className="credit__meta-item">{content.role}</span>
          <span className="credit__meta-item">{content.location}</span>

          <a className="credit__meta-item credit__link" href={links.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a className="credit__meta-item credit__link" href={links.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a className="credit__meta-item credit__link" href={`mailto:${links.email}`}>
            {links.email}
          </a>
          <a className="credit__meta-item credit__link" href={`tel:${links.phone}`}>
            {links.phoneLabel}
          </a>
        </div>
      </div>
    </section>
  );
}

export default DeveloperCredit;
