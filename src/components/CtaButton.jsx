import HudCorners from './HudCorners';
import './CtaButton.css';

function CtaButton({
  href,
  children,
  variant = 'primary',
  showIcon = false,
  type = 'button',
  onClick,
  disabled = false,
}) {
  const className = `cta-button cta-button--${variant}`;
  const content = (
    <>
      <HudCorners dim={variant === 'secondary'} />
      <span className="cta-button__label">{children}</span>
      {showIcon && (
        <span className="cta-button__icon" aria-hidden="true">
          &gt;
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <a className={className} href={href}>
        {content}
      </a>
    );
  }

  return (
    <button className={className} type={type} onClick={onClick} disabled={disabled}>
      {content}
    </button>
  );
}

export default CtaButton;
