import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createNoise3D } from 'simplex-noise';
import scrollState from '../scrollState';
import { createDotTexture } from '../three/dotTexture';
import './AuraScene.css';

// Pseudo-random determinístico a partir de un número (para asignarle a
// cada faceta de la bola de disco un brillo fijo, no uno nuevo cada frame).
function hash(n) {
  const s = Math.sin(n) * 43758.5453123;
  return s - Math.floor(s);
}

// Nube de partículas con forma de bola de espejos: una esfera dividida
// en facetas cuadradas (como una grilla de latitud/longitud), cada una
// con un brillo distinto, más una zona iluminada por una "luz" virtual
// que simula el spot que hace destellar la bola en una fiesta.
function buildDiscoBallCloud(noise3D) {
  const COUNT = 14000;
  const AZ_CELLS = 26; // facetas alrededor del ecuador
  const INC_CELLS = 13; // facetas de polo a polo
  const GROOVE = 0.05; // ancho de la ranura entre facetas

  const positions = new Float32Array(COUNT * 3);
  const colors = new Float32Array(COUNT * 3);
  const seeds = new Float32Array(COUNT);

  const colorGroove = new THREE.Color('#2e3c48'); // ranura oscura entre espejos
  const colorDark = new THREE.Color('#7c8a99'); // faceta en sombra
  const colorMid = new THREE.Color('#c7d3dd'); // faceta plateada
  // Destellos de color, como reflejos de las luces de la fiesta —
  // blanco puro se pierde contra el fondo claro del sitio.
  const glintColors = [
    new THREE.Color('#ffffff'),
    new THREE.Color('#c9a962'), // dorado
    new THREE.Color('#164a7e'), // azul marino oscuro
  ];

  // "Foco" virtual que ilumina una zona de la bola, como en una fiesta real.
  const lightDir = new THREE.Vector3(0.5, 0.65, 0.35).normalize();
  const dir = new THREE.Vector3();

  for (let i = 0; i < COUNT; i++) {
    // Fibonacci sphere para una distribución uniforme sobre la esfera.
    const t = i / COUNT;
    const inclination = Math.acos(1 - 2 * t);
    const rawAzimuth = Math.PI * (1 + Math.sqrt(5)) * i;
    const azimuth = ((rawAzimuth % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);

    dir.set(
      Math.sin(inclination) * Math.cos(rawAzimuth),
      Math.cos(inclination),
      Math.sin(inclination) * Math.sin(rawAzimuth),
    );

    // A qué faceta de la grilla pertenece esta partícula.
    const azCell = (azimuth / (Math.PI * 2)) * AZ_CELLS;
    const incCell = (inclination / Math.PI) * INC_CELLS;
    const azFrac = azCell - Math.floor(azCell);
    const incFrac = incCell - Math.floor(incCell);
    const inGroove = azFrac < GROOVE || azFrac > 1 - GROOVE || incFrac < GROOVE || incFrac > 1 - GROOVE;

    const cellId = Math.floor(azCell) * 1000 + Math.floor(incCell);
    const cellGlint = hash(cellId * 12.9898);

    const facing = Math.max(dir.dot(lightDir), 0);
    let brightness = facing * (0.45 + 0.55 * cellGlint);
    if (cellGlint > 0.88) brightness = Math.min(1, brightness + 0.5);

    let radius = inGroove ? 0.965 : 1;
    const n = noise3D(dir.x * 3, dir.y * 3, dir.z * 3);
    radius *= 1 + n * 0.006;

    positions[i * 3] = dir.x * radius;
    positions[i * 3 + 1] = dir.y * radius;
    positions[i * 3 + 2] = dir.z * radius;

    let c;
    if (inGroove) {
      c = colorGroove.clone();
    } else {
      c = colorDark.clone().lerp(colorMid, Math.min(brightness * 1.3, 1));
      if (brightness > 0.78) {
        const glintColor = glintColors[Math.floor(cellGlint * 97) % glintColors.length];
        c.lerp(glintColor, (brightness - 0.78) / 0.22);
      }
    }

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

    const dotTexture = createDotTexture();

    // --- Nube de partículas (bola de disco) ---
    const cloudGroup = new THREE.Group();
    const cloudGeometry = buildDiscoBallCloud(noise3D);
    const cloudMaterial = new THREE.PointsMaterial({
      size: 0.052,
      map: dotTexture,
      vertexColors: true,
      transparent: true,
      alphaTest: 0.4,
      opacity: 0.95,
      depthWrite: true,
      blending: THREE.NormalBlending,
      sizeAttenuation: true,
    });
    const cloud = new THREE.Points(cloudGeometry, cloudMaterial);
    cloudGroup.add(cloud);
    cloudGroup.scale.setScalar(1.7);
    cloudGroup.position.set(2.6, 0.2, -1);
    scene.add(cloudGroup);

    // --- Estrellas ---
    const starGeometry = buildStarfield(900, { x: 26, y: 16, z: 10 });
    const starMaterial = new THREE.PointsMaterial({
      size: 0.045,
      map: dotTexture,
      color: '#9db3c7',
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
      color: '#3b6299',
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

      // Reposiciona la nube/anillos hacia el ~62% del ancho, igual que el diseño original.
      const targetX = ((0.62 - 0.5) * 2) * Math.tan((camera.fov * Math.PI) / 360) * camera.aspect * camera.position.z;
      cloudGroup.position.x = targetX;
      ringGroup.position.x = targetX * 0.85;
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    resize();

    const clock = new THREE.Clock();
    const baseScale = 1.7;
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
