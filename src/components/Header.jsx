import { useState } from 'react';
import './Header.css';

function Header({ brand, brandBadge, tagline, soundOnLabel, soundOffLabel }) {
  const [soundOn, setSoundOn] = useState(true);

  return (
    <header className="site-header">
      <a className="site-header__logo" href="/">
        {brand}
        {brandBadge && <span className="site-header__reg">{brandBadge}</span>}
      </a>

      <p className="site-header__tagline">{tagline}</p>

      <button
        type="button"
        className="site-header__sound"
        onClick={() => setSoundOn((v) => !v)}
        aria-pressed={soundOn}
      >
        <span className={soundOn ? 'is-active' : ''}>{soundOnLabel}</span>
        {' / '}
        <span className={!soundOn ? 'is-active' : ''}>{soundOffLabel}</span>
      </button>
    </header>
  );
}

export default Header;
