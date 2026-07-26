"use client";

import React, { useRef, useEffect } from "react";

interface WavyBackgroundProps {
  className?: string;
  colors?: string[];
  waveWidth?: number;
  backgroundFill?: string;
  blur?: number;
  speed?: "slow" | "fast";
  waveOpacity?: number;
}

export default function WavyBackground({
  className = "",
  colors = ["#064e3b", "#10b981", "#047857"],
  waveWidth = 1,
  backgroundFill = "#080d16",
  blur = 0,
  speed = "slow",
  waveOpacity = 0.12,
}: WavyBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getSpeed = () => {
    switch (speed) {
      case "slow":
        return 0.0006;
      case "fast":
        return 0.0015;
      default:
        return 0.0006;
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = canvas.parentElement?.offsetHeight || 400);

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = canvas.parentElement?.offsetHeight || 400;
    };
    window.addEventListener("resize", handleResize);

    let nt = 0;
    const drawWave = (n: number) => {
      nt += getSpeed();
      for (let i = 0; i < n; i++) {
        ctx.beginPath();
        ctx.lineWidth = waveWidth;
        ctx.strokeStyle = colors[i % colors.length];
        ctx.globalAlpha = waveOpacity;
        
        for (let x = 0; x < w; x += 8) {
          // Dynamic sine and cosine curves to mimic elegant flowing wavy strands
          const y =
            h * 0.45 +
            Math.sin(x * 0.0018 + nt + i * 0.65) * 55 * Math.sin(nt * 0.5 + i * 0.2) +
            Math.cos(x * 0.0009 - nt + i * 0.3) * 25;
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
        ctx.closePath();
      }
    };

    let animationId: number;
    const render = () => {
      ctx.fillStyle = backgroundFill;
      ctx.globalAlpha = 1;
      ctx.fillRect(0, 0, w, h);
      drawWave(6); // 6 flowing wavy strands
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [colors, waveWidth, backgroundFill, speed, waveOpacity]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 z-0 pointer-events-none ${className}`}
      style={{
        filter: blur > 0 ? `blur(${blur}px)` : undefined,
      }}
    />
  );
}
