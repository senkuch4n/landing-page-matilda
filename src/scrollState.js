// Estado de scroll compartido y mutable (fuera de React) para que el
// fondo WebGL pueda leer el progreso en su propio loop de animación
// sin provocar un re-render de React en cada frame.
const scrollState = {
  progress: 0, // 0 al tope de la página, 1 al final
  velocity: 0,
};

export default scrollState;
