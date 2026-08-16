import { useEffect } from 'react';
import Lenis from 'lenis';
import scrollState from '../scrollState';

// Scroll con inercia (estilo "premium") para toda la página, y guarda el
// progreso global en scrollState para que el fondo WebGL pueda reaccionar.
export default function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      touchMultiplier: 1.4,
    });

    lenis.on('scroll', ({ progress, velocity }) => {
      scrollState.progress = progress;
      scrollState.velocity = velocity;
    });

    let frameId;
    function raf(time) {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    }
    frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  }, []);
}
