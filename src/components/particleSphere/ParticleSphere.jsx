import React, { useEffect, useRef } from "react";

const POINT_COUNT = 1250;
const COLORS = ["#2dd4bf", "#5eead4", "#14b8a6", "#99f6e4", "#0d9488"];

const buildPoints = () => {
  const points = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < POINT_COUNT; i += 1) {
    const y = 1 - (i / (POINT_COUNT - 1)) * 2;
    const radius = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = goldenAngle * i;

    points.push({
      x: Math.cos(theta) * radius,
      y,
      z: Math.sin(theta) * radius,
      phase: Math.random() * Math.PI * 2,
      speed: 0.6 + Math.random() * 1.4,
      size: 0.55 + Math.random() * 0.85,
      color: COLORS[i % COLORS.length],
      drift: Math.random() * 0.16,
    });
  }

  return points;
};

const makeSprite = (color) => {
  const size = 34;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  );
  gradient.addColorStop(0, `${color}`);
  gradient.addColorStop(0.35, `${color}cc`);
  gradient.addColorStop(1, `${color}00`);
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.fill();
  return canvas;
};

const ParticleSphere = ({ className = "" }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    const points = buildPoints();
    const sprites = COLORS.map(makeSprite);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let width = 0;
    let height = 0;
    let radius = 0;
    let frameId = 0;
    let visible = true;
    let start = performance.now();

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      width = rect?.width || window.innerWidth;
      height = rect?.height || window.innerHeight;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      radius = Math.min(width, height) * 0.44;
    };

    const draw = (time) => {
      const t = (time - start) / 1000;
      const angle = prefersReducedMotion ? 0.6 : t * 0.16;

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      const tilt = -0.28;
      const cosT = Math.cos(tilt);
      const sinT = Math.sin(tilt);

      for (let i = 0; i < points.length; i += 1) {
        const p = points[i];

        const bob =
          Math.sin(t * p.speed + p.phase) * p.drift;
        const px = p.x * (1 + bob * 0.05);
        const py = p.y * (1 + bob * 0.05);
        const pz = p.z * (1 + bob * 0.05);

        const rx = px * cosA - pz * sinA;
        const rz = px * sinA + pz * cosA;

        const ry = py * cosT - rz * sinT;
        const rz2 = py * sinT + rz * cosT;

        const perspective = 2.4 / (2.4 + rz2);
        const sx = cx + rx * radius * perspective;
        const sy = cy + ry * radius * perspective;

        const depth = (rz2 + 1) / 2;
        const alpha = 0.12 + depth * 0.88;
        const size = (0.75 + depth * 2.1) * p.size * perspective * 9.5;

        ctx.globalAlpha = alpha;
        ctx.drawImage(
          sprites[i % sprites.length],
          sx - size / 2,
          sy - size / 2,
          size,
          size,
        );
      }

      ctx.globalAlpha = 1;
    };

    const loop = (time) => {
      if (!visible) return;
      draw(time);
      frameId = window.requestAnimationFrame(loop);
    };

    const onVisibility = () => {
      visible = !document.hidden;
      if (visible) {
        start = performance.now();
        frameId = window.requestAnimationFrame(loop);
      } else {
        window.cancelAnimationFrame(frameId);
      }
    };

    resize();

    if (prefersReducedMotion) {
      draw(start);
    } else {
      frameId = window.requestAnimationFrame(loop);
    }

    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`particle-sphere ${className}`}
      aria-hidden="true"
    />
  );
};

export default ParticleSphere;
