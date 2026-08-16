import { useEffect, useRef } from 'react';

function easeOutCubic(p) {
  return 1 - Math.pow(1 - p, 3);
}

// Anima un elemento de forma continua a medida que entra en el viewport
// (en vez de un simple "aparece una vez"), imitando transiciones ligadas
// al scroll. Escribe directamente en el DOM en cada frame para no generar
// re-renders de React.
export default function useScrollReveal({ distance = 44, blur = 10 } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    let frameId;

    function update() {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;

      // progress 0 -> el todavía no entró; 1 -> ya terminó de revelarse.
      const start = vh * 0.92;
      const end = vh * 0.5;
      const raw = (start - rect.top) / (start - end);
      const p = Math.min(Math.max(raw, 0), 1);
      const eased = easeOutCubic(p);

      el.style.opacity = eased;
      el.style.transform = `translateY(${(1 - eased) * distance}px)`;
      el.style.filter = eased > 0.98 ? 'none' : `blur(${(1 - eased) * blur}px)`;

      frameId = requestAnimationFrame(update);
    }

    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, [distance, blur]);

  return ref;
}
