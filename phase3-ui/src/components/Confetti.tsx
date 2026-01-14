'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ConfettiProps {
  trigger: boolean;
  duration?: number;
  particleCount?: number;
}

interface Particle {
  x: number;
  y: number;
  rotate: number;
  scale: number;
  delay: number;
  color: string;
}

const colors = ['#A87EFF', '#2DFFB3', '#FF8E64', '#FF6B96', '#D4C2FF', '#8FFFD4'];

export function Confetti({ trigger, duration = 0.8, particleCount = 20 }: ConfettiProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (trigger) {
      const newParticles: Particle[] = Array.from({ length: particleCount }).map((_, i) => ({
        x: Math.random() * 200 - 100,
        y: Math.random() * -150 - 50,
        rotate: Math.random() * 360,
        scale: Math.random() * 0.5 + 0.5,
        delay: i * 0.02,
        color: colors[Math.floor(Math.random() * colors.length)],
      }));

      setParticles(newParticles);
      setIsActive(true);

      setTimeout(() => {
        setIsActive(false);
      }, duration * 1000 + particleCount * 20);
    }
  }, [trigger, duration, particleCount]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
          animate={{
            x: particle.x,
            y: particle.y,
            opacity: 0,
            scale: particle.scale,
            rotate: particle.rotate,
          }}
          transition={{ duration, delay: particle.delay, ease: 'easeOut' }}
          className="absolute w-2 h-2 rounded-full"
          style={{
            backgroundColor: particle.color,
          }}
        />
      ))}
    </div>
  );
}

export function useConfetti() {
  const [trigger, setTrigger] = useState(false);

  const celebrate = () => {
    setTrigger(true);
    setTimeout(() => setTrigger(false), 100);
  };

  return { trigger, celebrate };
}
