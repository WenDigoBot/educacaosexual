import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';

const baseParticles = [
  { emoji: '💊', size: 'text-2xl md:text-3xl', weight: 3 }, 
  { emoji: '🩺', size: 'text-3xl md:text-4xl', weight: 2 }, 
  { emoji: '💉', size: 'text-2xl md:text-3xl', weight: 3 }, 
  { emoji: '🫀', size: 'text-3xl md:text-4xl', weight: 2 }, 
  { emoji: '🦠', size: 'text-xl md:text-2xl', weight: 3 }, 
  { emoji: '🔬', size: 'text-2xl md:text-3xl', weight: 1 }, 
  { emoji: '⚕️', size: 'text-3xl md:text-4xl', weight: 2 }, 
  { emoji: '🧬', size: 'text-2xl md:text-3xl', weight: 2 }, 
  { emoji: '🩹', size: 'text-2xl md:text-3xl', weight: 3 }, 
  { emoji: '❤️‍🩹', size: 'text-3xl md:text-4xl', weight: 2 },
  { emoji: '⚤', size: 'text-2xl md:text-3xl', weight: 1 }, 
  { emoji: '⚧️', size: 'text-3xl md:text-4xl', weight: 1 }, 
  { emoji: '🌈', size: 'text-3xl md:text-4xl', weight: 2 }, 
  { emoji: '🩸', size: 'text-2xl md:text-3xl', weight: 2 }, 
  { emoji: '🧑‍🏫', size: 'text-3xl md:text-4xl', weight: 1 }, 
  { emoji: '📖', size: 'text-2xl md:text-3xl', weight: 2 }, 
  { emoji: '💡', size: 'text-3xl md:text-4xl', weight: 1 }, 
  { emoji: '🛡️', size: 'text-2xl md:text-3xl', weight: 2 },
  { emoji: '🧠', size: 'text-3xl md:text-4xl', weight: 1 }, 
  { emoji: '🗣️', size: 'text-2xl md:text-3xl', weight: 1 }, 
  { emoji: '🫂', size: 'text-3xl md:text-4xl', weight: 1 }, 
  { emoji: '✅', size: 'text-xl md:text-2xl', weight: 1 }, 
  { emoji: '🚫', size: 'text-xl md:text-2xl', weight: 1 }, 
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
        xInitial: Math.random() * 100, // Posição inicial aleatória em toda a largura da tela
        yInitial: Math.random() * 100, // Posição inicial aleatória em toda a altura da tela
        duration: 25 + Math.random() * 35, // Duração mais longa para movimento mais suave
        delay: Math.random() * 20, // Maior variação no atraso para evitar sincronização
        driftX: (Math.random() - 0.5) * 120, // Maior amplitude de movimento horizontal
        driftY: (Math.random() - 0.5) * 120, // Maior amplitude de movimento vertical
        rotation: (Math.random() - 0.5) * 720,
        scaleMin: 0.7 + Math.random() * 0.4, // Escala mínima maior para melhor visibilidade
        scaleMax: 1.2 + Math.random() * 0.8, // Escala máxima maior para melhor visibilidade
        opacityMin: 0.08 + Math.random() * 0.12, // Opacidade mínima maior para melhor visibilidade
        opacityMax: 0.2 + Math.random() * 0.25,   // Opacidade máxima maior para melhor visibilidade
      };
    };
    
    // Aumentar o número de partículas para cobrir mais área da tela
    const initialParticles = Array.from({ length: 50 }, (_, i) => generateParticle(i));
    setParticleElements(initialParticles);

    const intervalId = setInterval(() => {
      setParticleElements(prevParticles => 
        prevParticles.map((_, i) => generateParticle(i + Date.now())) // Regenerate with new IDs
      );
    }, 30000); // Regenerar todas as partículas periodicamente (tempo aumentado para animação mais suave)

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
            // Curva de animação mais complexa para movimento mais natural e suave
            x: [
              0, 
              particle.driftX * 0.2, 
              particle.driftX * 0.5, 
              particle.driftX * 0.8, 
              particle.driftX, 
              particle.driftX * 0.8, 
              particle.driftX * 0.5, 
              particle.driftX * 0.2, 
              0
            ],
            y: [
              0, 
              particle.driftY * 0.2, 
              particle.driftY * 0.5, 
              particle.driftY * 0.8, 
              particle.driftY, 
              particle.driftY * 0.8, 
              particle.driftY * 0.5, 
              particle.driftY * 0.2, 
              0
            ],
            rotate: [
              0, 
              particle.rotation * 0.25, 
              particle.rotation * 0.5, 
              particle.rotation * 0.75, 
              particle.rotation, 
              particle.rotation * 0.75, 
              particle.rotation * 0.5, 
              particle.rotation * 0.25, 
              0
            ],
            scale: [
              particle.scaleMin, 
              particle.scaleMin * 1.2, 
              particle.scaleMax, 
              particle.scaleMax * 0.9, 
              particle.scaleMin * 1.1, 
              particle.scaleMax * 0.8, 
              particle.scaleMin * 1.3, 
              particle.scaleMax * 0.7, 
              particle.scaleMin
            ],
            opacity: [
              particle.opacityMin, 
              particle.opacityMax * 0.7, 
              particle.opacityMax, 
              particle.opacityMax * 0.8, 
              particle.opacityMin * 1.5, 
              particle.opacityMax * 0.9, 
              particle.opacityMin * 1.2, 
              particle.opacityMax * 0.6, 
              particle.opacityMin
            ],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut", // Mudança para easeInOut para movimento mais suave
          }}
        >
          {particle.emoji}
        </motion.div>
      ))}
    </div>
  );
};

export default ParticleSystem;

