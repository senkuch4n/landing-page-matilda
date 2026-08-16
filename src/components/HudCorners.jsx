function HudCorners({ dim = false }) {
  return (
    <span className={`hud-corners${dim ? ' hud-corners--dim' : ''}`} aria-hidden="true">
      <span className="hud-corner hud-corner--tl" />
      <span className="hud-corner hud-corner--br" />
    </span>
  );
}

export default HudCorners;
