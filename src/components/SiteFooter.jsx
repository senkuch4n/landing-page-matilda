import './SiteFooter.css';

function SiteFooter({ event, credits }) {
  const year = new Date(event.dateISO).getFullYear();
  const { links } = credits;

  return (
    <footer className="site-footer">
      <span className="site-footer__item">
        © {year} — {event.eventTitle || 'Mis Quince Años'}
      </span>

      <span className="site-footer__item site-footer__item--center">
        Sitio por{' '}
        <a className="site-footer__link" href={links.github} target="_blank" rel="noreferrer">
          {credits.nameLines.join(' ')}
        </a>
      </span>

      <span className="site-footer__links">
        <a className="site-footer__link" href={links.github} target="_blank" rel="noreferrer">
          GitHub
        </a>
        <a className="site-footer__link" href={links.linkedin} target="_blank" rel="noreferrer">
          LinkedIn
        </a>
        <a className="site-footer__link" href={`mailto:${links.email}`}>
          Email
        </a>
      </span>
    </footer>
  );
}

export default SiteFooter;
