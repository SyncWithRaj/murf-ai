'use client';
import { useEffect } from 'react';

export default function LiveBg() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/tsparticles@2/tsparticles.bundle.min.js";
    script.async = true;
    script.onload = () => {
      window.tsParticles.load("tsparticles", {
        fullScreen: { enable: true, zIndex: -1 },
        background: {
          color: { value: "#0f0f23" }
        },
        particles: {
          number: { value: 60 },
          color: { value: "#ffffff" },
          shape: { type: "circle" },
          opacity: { value: 0.4 },
          size: { value: 3 },
          move: { enable: true, speed: 1 }
        }
      });
    };
    document.body.appendChild(script);
  }, []);

  return <div id="tsparticles" className="fixed inset-0 z-[-1]" />;
}
