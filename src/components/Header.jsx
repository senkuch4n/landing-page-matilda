import './Header.css';

function Header({ brand, brandBadge, tagline }) {
  return (
    <header className="site-header">
      <a className="site-header__logo" href="/">
        {brand}
        {brandBadge && <span className="site-header__reg">{brandBadge}</span>}
      </a>

      <p className="site-header__tagline">{tagline}</p>
    </header>
  );
}

export default Header;
