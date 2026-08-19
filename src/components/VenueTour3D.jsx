import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './VenueTour3D.css';

const PLACEHOLDER_SLOTS = 6;

// Carrusel 3D: las fotos quedan montadas como paneles en círculo, que
// se pueden arrastrar para rotar (como un configurador 3D de producto).
// Sin fotos todavía, muestra marcos vacíos girando lentamente.
function buildFrameEdges(width, height) {
  const shape = [
    new THREE.Vector3(-width / 2, -height / 2, 0.01),
    new THREE.Vector3(width / 2, -height / 2, 0.01),
    new THREE.Vector3(width / 2, height / 2, 0.01),
    new THREE.Vector3(-width / 2, height / 2, 0.01),
    new THREE.Vector3(-width / 2, -height / 2, 0.01),
  ];
  return new THREE.BufferGeometry().setFromPoints(shape);
}

function VenueTour3D({ photos = [] }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const hasPhotos = photos.length > 0;
    const count = hasPhotos ? photos.length : PLACEHOLDER_SLOTS;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0.2, 6.4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    mount.appendChild(renderer.domElement);

    const ring = new THREE.Group();
    scene.add(ring);

    const radius = 3.4;
    const planeWidth = 1.9;
    const planeHeight = 1.3;
    const frameGeometry = buildFrameEdges(planeWidth + 0.06, planeHeight + 0.06);
    const frameMaterial = new THREE.LineBasicMaterial({ color: '#3b6299', transparent: true, opacity: 0.7 });

    const textureLoader = hasPhotos ? new THREE.TextureLoader() : null;
    const planeGeometry = new THREE.PlaneGeometry(planeWidth, planeHeight);

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const group = new THREE.Group();
      group.position.set(Math.sin(angle) * radius, 0, Math.cos(angle) * radius);
      group.rotation.y = angle;

      let material;
      if (hasPhotos) {
        const frameAspect = planeWidth / planeHeight;
        const texture = textureLoader.load(photos[i].src, (tex) => {
          // Recorte tipo "cover" para que fotos horizontales y verticales
          // llenen el marco sin deformarse.
          const imgAspect = tex.image.width / tex.image.height;
          if (imgAspect > frameAspect) {
            const scale = frameAspect / imgAspect;
            tex.repeat.set(scale, 1);
            tex.offset.set((1 - scale) / 2, 0);
          } else {
            const scale = imgAspect / frameAspect;
            tex.repeat.set(1, scale);
            tex.offset.set(0, (1 - scale) / 2);
          }
          tex.needsUpdate = true;
        });
        if ('colorSpace' in texture) texture.colorSpace = THREE.SRGBColorSpace;
        material = new THREE.MeshBasicMaterial({ map: texture });
      } else {
        material = new THREE.MeshBasicMaterial({ color: '#eef3f8', transparent: true, opacity: 0.5 });
      }

      const plane = new THREE.Mesh(planeGeometry, material);
      group.add(plane);

      const frame = new THREE.LineLoop(frameGeometry, frameMaterial);
      group.add(frame);

      ring.add(group);
    }

    function resize() {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    resize();

    // Arrastrar para rotar el carrusel (mouse + touch vía Pointer Events).
    let isDragging = false;
    let lastX = 0;
    let dragVelocity = 0;
    let idleTimer = 0;

    function onPointerDown(e) {
      isDragging = true;
      lastX = e.clientX;
      mount.style.cursor = 'grabbing';
    }
    function onPointerMove(e) {
      if (!isDragging) return;
      const delta = e.clientX - lastX;
      lastX = e.clientX;
      ring.rotation.y += delta * 0.006;
      dragVelocity = delta * 0.006;
      idleTimer = 0;
    }
    function onPointerUp() {
      isDragging = false;
      mount.style.cursor = 'grab';
    }

    mount.style.cursor = 'grab';
    mount.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    const clock = new THREE.Clock();
    let frameId;

    function animate() {
      const dt = clock.getDelta();

      if (isDragging) {
        // sin autorrotación mientras se arrastra
      } else if (Math.abs(dragVelocity) > 0.0001) {
        ring.rotation.y += dragVelocity;
        dragVelocity *= 0.94;
      } else {
        idleTimer += dt;
        if (idleTimer > 0.6) {
          ring.rotation.y += dt * 0.12;
        }
      }

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      mount.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      planeGeometry.dispose();
      frameGeometry.dispose();
      frameMaterial.dispose();
      ring.children.forEach((group) => {
        group.children.forEach((child) => {
          if (child.material?.map) child.material.map.dispose();
          if (child.material) child.material.dispose();
        });
      });
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, [photos]);

  return (
    <div className="venue-tour" ref={mountRef} role="img" aria-label="Recorrido 3D del salón y sus alrededores">
      {photos.length === 0 && (
        <p className="venue-tour__hint">Arrastrá para girar — muy pronto con fotos reales del lugar</p>
      )}
    </div>
  );
}

export default VenueTour3D;
