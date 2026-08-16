import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createNoise3D } from 'simplex-noise';
import scrollState from '../scrollState';
import './AuraScene.css';

// Textura de punto suave (círculo con falloff) generada en un canvas,
// usada como sprite para todas las partículas.
function makeDotTexture() {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.4, 'rgba(255,255,255,0.7)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

// Nube de partículas con forma de gema facetada (corona + pabellón,
// como un diamante de talla brillante), coloreada en degrade violeta
// -> magenta -> blanco, con destellos en los bordes de las facetas.
function buildGemCloud(noise3D) {
  const COUNT = 9000;
  const FACETS = 8;
  const positions = new Float32Array(COUNT * 3);
  const colors = new Float32Array(COUNT * 3);
  const seeds = new Float32Array(COUNT);

  const colorA = new THREE.Color('#3b1478'); // violeta oscuro
  const colorB = new THREE.Color('#a24bd6'); // magenta/violeta
  const colorC = new THREE.Color('#f7ecff'); // destello blanco/rosado

  // Alturas de referencia de la gema (corona angosta arriba, pabellón
  // largo y puntiagudo abajo, unidos por la faja/girdle en y = 0).
  const crownTop = 0.55;
  const tableY = 0.42;
  const tableRadius = 0.22;
  const pavilionTip = -1.7;

  for (let i = 0; i < COUNT; i++) {
    const theta = Math.random() * Math.PI * 2;
    const v = Math.random();

    let y;
    let baseRadius;
    if (v < 0.32) {
      // Table (la cara plana de arriba)
      y = tableY + Math.random() * (crownTop - tableY) * 0.15;
      baseRadius = Math.random() * tableRadius;
    } else if (v < 0.55) {
      // Corona: de la faja hacia la tabla
      const f = Math.random();
      y = f * tableY;
      baseRadius = 1 - f * (1 - tableRadius);
    } else {
      // Pabellón: de la faja hasta la punta inferior
      const f = Math.random();
      y = f * pavilionTip;
      baseRadius = 1 - f;
    }

    // Modulación angular para simular facetas planas + brillos en los bordes.
    const facetWave = Math.cos(theta * FACETS);
    const radius = baseRadius * (0.9 + 0.1 * facetWave);

    const jitter = 1 + noise3D(Math.cos(theta) * 2, y * 2, Math.sin(theta) * 2) * 0.04;

    positions[i * 3] = Math.cos(theta) * radius * jitter;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = Math.sin(theta) * radius * jitter;

    // Color: más claro cerca de la faja y en los filos de las facetas (brillos).
    const girdleGlow = 1 - Math.min(Math.abs(y) / 0.9, 1);
    const facetGlow = Math.max(facetWave, 0);
    const mix = Math.min(girdleGlow * 0.6 + facetGlow * 0.5, 1);

    const c = colorA.clone().lerp(colorB, 0.4 + mix * 0.4);
    if (mix > 0.55) c.lerp(colorC, (mix - 0.55) / 0.45);

    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;

    seeds[i] = Math.random() * Math.PI * 2;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.userData.basePositions = positions.slice();
  geometry.userData.seeds = seeds;

  return geometry;
}

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
    const noise3D = createNoise3D();

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 9);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    mount.appendChild(renderer.domElement);

    const dotTexture = makeDotTexture();

    // --- Nube de partículas (aura) ---
    const cloudGroup = new THREE.Group();
    const cloudGeometry = buildGemCloud(noise3D);
    const cloudMaterial = new THREE.PointsMaterial({
      size: 0.04,
      map: dotTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    const cloud = new THREE.Points(cloudGeometry, cloudMaterial);
    cloudGroup.add(cloud);
    cloudGroup.scale.setScalar(1.3);
    cloudGroup.position.set(2.6, 0.2, -1);
    scene.add(cloudGroup);

    // --- Estrellas ---
    const starGeometry = buildStarfield(900, { x: 26, y: 16, z: 10 });
    const starMaterial = new THREE.PointsMaterial({
      size: 0.045,
      map: dotTexture,
      color: '#ffffff',
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    stars.position.z = -3;
    scene.add(stars);

    // --- Anillos concéntricos punteados ---
    const ringGroup = new THREE.Group();
    ringGroup.position.set(2.2, -0.2, -2);
    const ringMaterial = new THREE.LineDashedMaterial({
      color: '#ffffff',
      transparent: true,
      opacity: 0.16,
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

      // Reposiciona la nube/anillos hacia el ~62% del ancho, igual que el diseño original.
      const targetX = ((0.62 - 0.5) * 2) * Math.tan((camera.fov * Math.PI) / 360) * camera.aspect * camera.position.z;
      cloudGroup.position.x = targetX;
      ringGroup.position.x = targetX * 0.85;
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    resize();

    const clock = new THREE.Clock();
    const baseScale = 1.3;
    let smoothScroll = 0;
    let frameId;

    function animate() {
      const t = clock.getElapsedTime();

      // Suaviza el progreso de scroll (con un poco de inercia propia)
      // para que la escena "responda" al scroll en vez de saltar.
      smoothScroll += (scrollState.progress - smoothScroll) * 0.06;
      const s = smoothScroll;

      cloudGroup.rotation.y = t * (0.15 + s * 0.35);
      cloudGroup.rotation.x = s * 0.18;
      cloudGroup.position.y = 0.2 + Math.sin(t * 0.3) * 0.08 - s * 0.6;
      cloudGroup.scale.setScalar(baseScale - s * 0.35);

      const posAttr = cloudGeometry.getAttribute('position');
      const base = cloudGeometry.userData.basePositions;
      const seeds = cloudGeometry.userData.seeds;
      for (let i = 0; i < posAttr.count; i++) {
        const ix = i * 3;
        const breathe = 1 + Math.sin(t * 0.6 + seeds[i]) * 0.015;
        posAttr.array[ix] = base[ix] * breathe;
        posAttr.array[ix + 1] = base[ix + 1] * breathe;
        posAttr.array[ix + 2] = base[ix + 2] * breathe;
      }
      posAttr.needsUpdate = true;

      // Se atenúa a medida que se avanza por la página para no competir
      // con el contenido de las secciones (countdown, form, galería).
      const fade = 1 - s * 0.6;
      cloudMaterial.opacity = 0.95 * fade;
      starMaterial.opacity = 0.8 * fade;
      ringMaterial.opacity = 0.16 * fade;

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
      cloudGeometry.dispose();
      starGeometry.dispose();
      cloudMaterial.dispose();
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
