"use client";
import { useEffect, useRef } from "react";
import { motion, useAnimationFrame } from "framer-motion";

export default function MeshBackground() {
  return (
    <div className="bg-mesh" aria-hidden="true">
      {/* Base gradient */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 120% 80% at 50% 0%, #12082A 0%, #06060F 60%)'
      }} />

      {/* Animated orbs */}
      <motion.div className="mesh-orb" style={{
        width: '60vw', height: '60vw',
        top: '-20%', left: '-15%',
        background: 'radial-gradient(circle, rgba(155,93,229,0.12) 0%, transparent 70%)',
      }} animate={{ x: [0, 40, -20, 0], y: [0, -30, 20, 0], scale: [1, 1.1, 0.95, 1] }}
      transition={{ duration: 22, repeat: Infinity, ease: "linear" }} />

      <motion.div className="mesh-orb" style={{
        width: '50vw', height: '50vw',
        bottom: '-10%', right: '-10%',
        background: 'radial-gradient(circle, rgba(229,41,61,0.09) 0%, transparent 70%)',
      }} animate={{ x: [0, -50, 30, 0], y: [0, 40, -25, 0], scale: [1, 0.9, 1.05, 1] }}
      transition={{ duration: 28, repeat: Infinity, ease: "linear" }} />

      <motion.div className="mesh-orb" style={{
        width: '30vw', height: '30vw',
        top: '30%', right: '20%',
        background: 'radial-gradient(circle, rgba(155,93,229,0.07) 0%, transparent 70%)',
      }} animate={{ x: [0, 30, -15, 0], y: [0, -20, 35, 0] }}
      transition={{ duration: 18, repeat: Infinity, ease: "linear" }} />

      {/* Subtle grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(155,93,229,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(155,93,229,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }} />

      {/* Scanline vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 50%, rgba(6,6,15,0.5) 100%)',
        pointerEvents: 'none',
      }} />
    </div>
  );
}
