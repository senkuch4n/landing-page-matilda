import './FamilyPhoto.css';

// Foto decorativa tipo collage: semitransparente, rotada, apoyada en un
// costado de la sección. Puramente visual (alt vacío + aria-hidden) —
// no reemplaza contenido, sólo le da un aire de recuerdo de familia al
// fondo de cada sección. En mobile se ocultan para no tapar el texto.
function FamilyPhoto({ src, corner = 'top-left', rotate = -6, size = 170 }) {
  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      loading="lazy"
      className={`family-photo family-photo--${corner}`}
      style={{ '--photo-size': `${size}px`, '--photo-rotate': `${rotate}deg` }}
    />
  );
}

export default FamilyPhoto;
