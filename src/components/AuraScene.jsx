import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import scrollState from '../scrollState';
import { createDotTexture } from '../three/dotTexture';
import './AuraScene.css';

function buildStarfield(count, spread) {
  const positions = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * spread.x;
    positions[i * 3 + 1] = (Math.random() - 0.5) * spread.y;
    positions[i * 3 + 2] = (Math.random() - 0.5) * spread.z;
    seeds[i] = Math.random() * Math.PI * 2;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('seed', new THREE.BufferAttribute(seeds, 1));
  return geometry;
}

function buildRing(radius, segments) {
  const points = [];
  for (let i = 0; i <= segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, 0));
  }
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  return geometry;
}

function AuraScene() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 9);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    mount.appendChild(renderer.domElement);

    const dotTexture = createDotTexture();

    // --- Estrellas ---
    const starGeometry = buildStarfield(900, { x: 26, y: 16, z: 10 });
    const starMaterial = new THREE.PointsMaterial({
      size: 0.045,
      map: dotTexture,
      color: '#90bbd9',
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    stars.position.z = -3;
    scene.add(stars);

    // --- Anillos concéntricos punteados ---
    const ringGroup = new THREE.Group();
    ringGroup.position.set(2.2, -0.2, -2);
    const ringMaterial = new THREE.LineDashedMaterial({
      color: '#90bbd9',
      transparent: true,
      opacity: 0.3,
      dashSize: 0.05,
      gapSize: 0.09,
    });
    [2.8, 4.3].forEach((radius) => {
      const geo = buildRing(radius, 180);
      const line = new THREE.LineLoop(geo, ringMaterial);
      line.computeLineDistances();
      ringGroup.add(line);
    });
    scene.add(ringGroup);

    function resize() {
      const { clientWidth: w, clientHeight: h } = mount;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();

      // Reposiciona los anillos hacia el ~62% del ancho, igual que el diseño original.
      const targetX = ((0.62 - 0.5) * 2) * Math.tan((camera.fov * Math.PI) / 360) * camera.aspect * camera.position.z;
      ringGroup.position.x = targetX * 0.85;
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    resize();

    const clock = new THREE.Clock();
    let smoothScroll = 0;
    let frameId;

    function animate() {
      const t = clock.getElapsedTime();

      // Suaviza el progreso de scroll (con un poco de inercia propia)
      // para que la escena "responda" al scroll en vez de saltar.
      smoothScroll += (scrollState.progress - smoothScroll) * 0.06;
      const s = smoothScroll;

      // Se atenúa a medida que se avanza por la página para no competir
      // con el contenido de las secciones (countdown, form, galería).
      const fade = 1 - s * 0.6;
      starMaterial.opacity = 0.55 * fade;
      ringMaterial.opacity = 0.3 * fade;

      ringGroup.rotation.z = t * 0.02 + s * 0.4;
      camera.position.x = Math.sin(s * Math.PI) * 0.5;
      camera.lookAt(0, 0, 0);

      stars.rotation.y = t * 0.005 + s * 0.15;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      starGeometry.dispose();
      starMaterial.dispose();
      ringMaterial.dispose();
      dotTexture.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="aura-scene" aria-hidden="true" />;
}

export default AuraScene;
