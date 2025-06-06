import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';

const baseParticles = [
  { emoji: '💊', size: 'text-2xl', weight: 3 }, 
  { emoji: '🩺', size: 'text-3xl', weight: 2 }, 
  { emoji: '💉', size: 'text-2xl', weight: 3 }, 
  { emoji: '🫀', size: 'text-3xl', weight: 2 }, 
  { emoji: '🦠', size: 'text-xl', weight: 3 }, 
  { emoji: '🔬', size: 'text-2xl', weight: 1 }, 
  { emoji: '⚕️', size: 'text-3xl', weight: 2 }, 
  { emoji: '🧬', size: 'text-2xl', weight: 2 }, 
  { emoji: '🩹', size: 'text-2xl', weight: 3 }, 
  { emoji: '❤️‍🩹', size: 'text-3xl', weight: 2 },
  { emoji: '⚤', size: 'text-2xl', weight: 1 }, 
  { emoji: '⚧️', size: 'text-3xl', weight: 1 }, 
  { emoji: '🌈', size: 'text-3xl', weight: 2 }, 
  { emoji: '🩸', size: 'text-2xl', weight: 2 }, 
  { emoji: '🧑‍🏫', size: 'text-3xl', weight: 1 }, 
  { emoji: '📖', size: 'text-2xl', weight: 2 }, 
  { emoji: '💡', size: 'text-3xl', weight: 1 }, 
  { emoji: '🛡️', size: 'text-2xl', weight: 2 },
  { emoji: '🧠', size: 'text-3xl', weight: 1 }, // Cérebro (conhecimento)
  { emoji: '🗣️', size: 'text-2xl', weight: 1 }, // Pessoa falando (comunicação)
  { emoji: '🫂', size: 'text-3xl', weight: 1 }, // Abraço (apoio, respeito)
  { emoji: '✅', size: 'text-xl', weight: 1 }, // Check (consentimento)
  { emoji: '🚫', size: 'text-xl', weight: 1 }, // Proibido (limites)
];

const ParticleSystem = () => {
  const weightedParticles = useMemo(() => {
    const arr = [];
    baseParticles.forEach(p => {
      for (let i = 0; i < p.weight; i++) {
        arr.push(p);
      }
    });
    return arr;
  }, []);

  const [particleElements, setParticleElements] = useState([]);

  useEffect(() => {
    const generateParticle = (id) => {
      const particleType = weightedParticles[Math.floor(Math.random() * weightedParticles.length)];
      return {
        id: id + Math.random(), // Unique key for re-triggering animation
        emoji: particleType.emoji,
        size: particleType.size,
        xInitial: Math.random() * 100,
        yInitial: Math.random() * 100,
        duration: 20 + Math.random() * 25,
        delay: Math.random() * 15,
        driftX: (Math.random() - 0.5) * 80, // Increased drift
        driftY: (Math.random() - 0.5) * 80, // Increased drift
        rotation: (Math.random() - 0.5) * 720,
        scaleMin: 0.6 + Math.random() * 0.4, // Random initial scale
        scaleMax: 1.0 + Math.random() * 0.6, // Random max scale
        opacityMin: 0.03 + Math.random() * 0.07, // Random min opacity
        opacityMax: 0.1 + Math.random() * 0.15,   // Random max opacity
      };
    };
    
    const initialParticles = Array.from({ length: 30 }, (_, i) => generateParticle(i));
    setParticleElements(initialParticles);

    const intervalId = setInterval(() => {
      setParticleElements(prevParticles => 
        prevParticles.map((_, i) => generateParticle(i + Date.now())) // Regenerate with new IDs
      );
    }, 25000); // Regenerate all particles periodically

    return () => clearInterval(intervalId);
  }, [weightedParticles]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particleElements.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute ${particle.size}`}
          style={{
            left: `${particle.xInitial}%`,
            top: `${particle.yInitial}%`,
            willChange: 'transform, opacity', 
          }}
          initial={{ 
            opacity: 0,
            scale: particle.scaleMin,
            rotate: 0,
            x: 0,
            y: 0,
          }}
          animate={{
            x: [0, particle.driftX / 2, particle.driftX, particle.driftX / 2, 0],
            y: [0, particle.driftY / 2, particle.driftY, particle.driftY / 2, 0],
            rotate: [0, particle.rotation / 2, particle.rotation, particle.rotation / 2, 0],
            scale: [particle.scaleMin, particle.scaleMax, particle.scaleMin, particle.scaleMax * 0.8, particle.scaleMin],
            opacity: [particle.opacityMin, particle.opacityMax, particle.opacityMin, particle.opacityMax * 0.7, particle.opacityMin],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "linear", 
          }}
        >
          {particle.emoji}
        </motion.div>
      ))}
    </div>
  );
};

export default ParticleSystem;