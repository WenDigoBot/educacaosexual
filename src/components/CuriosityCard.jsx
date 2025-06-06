import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const emojis = ['🫢', '🤨', '😲', '😳', '😶', '🤔', '😮', '🧐'];

const CuriosityCard = ({ curiosity, onNext, isLast }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [randomEmoji, setRandomEmoji] = useState(emojis[0]);

  useEffect(() => {
    setRandomEmoji(emojis[Math.floor(Math.random() * emojis.length)]);
  }, [curiosity]);

  const handleFlip = () => {
    if (!isFlipped) {
      setIsFlipped(true);
    } else {
      onNext();
      // Não resetar isFlipped aqui, pois o componente será desmontado/remontado
      // e o estado de flip será resetado pela key no App.jsx
    }
  };
  
  // Garante que curiosity e curiosity.revelation existam
  const revelationContent = curiosity?.revelation || (curiosity?.isTrue ? "Isso mesmo!" : "Na verdade...");

  return (
    <div className="w-full max-w-lg mx-auto">
      <motion.div
        className="card-3d relative w-full h-[30rem]" 
        whileHover={{ 
          rotateY: isFlipped ? 0 : 3, 
          rotateX: isFlipped ? 0 : 3,
          scale: 1.01 
        }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <motion.div
          className="absolute inset-0 w-full h-full"
          initial={false}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.7, type: "spring", stiffness:150, damping:20 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front Face */}
          <div className="card-face absolute inset-0 w-full h-full bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 flex flex-col justify-between items-center text-center">
            <motion.div
              className="text-5xl"
              animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
              🏥
            </motion.div>
            
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">
                Curiosidade sobre Saúde Sexual
              </h2>
              <div className="bg-white/5 rounded-2xl p-5 border border-white/10 min-h-[120px] flex items-center justify-center">
                <p className="text-md text-white/90 leading-relaxed">
                  {curiosity?.text}
                </p>
              </div>
            </div>
            
            <div>
              <motion.div
                className="text-3xl mb-3"
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              >
                🤔
              </motion.div>
              <p className="text-sm text-white/70">
                Clique em "Revelar" para descobrir!
              </p>
            </div>
          </div>

          {/* Back Face */}
          <div className="card-face card-back absolute inset-0 w-full h-full bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 flex flex-col justify-between items-center text-center">
            <motion.div
              className="text-5xl"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
            >
              {randomEmoji}
            </motion.div>

            <div className="w-full">
              <motion.div
                className={`text-4xl font-bold mb-3 glow-text ${
                  curiosity?.isTrue ? 'text-green-400' : 'text-red-400'
                }`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, type: "spring" }}
              >
                {curiosity?.isTrue ? (
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-10 h-10" />
                    <span>VERDADE</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <XCircle className="w-10 h-10" />
                    <span>MITO</span>
                  </div>
                )}
              </motion.div>
              
              <motion.div
                className="bg-white/5 rounded-2xl p-5 border border-white/10 min-h-[120px] flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.45, type: "spring" }}
              >
                <p className="text-md text-white/90 leading-relaxed">
                  {revelationContent}
                </p>
              </motion.div>
            </div>
            
            <motion.p
              className="text-sm text-white/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {isLast ? 'Clique para finalizar!' : 'Clique para a próxima curiosidade!'}
            </motion.p>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="flex justify-center mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Button
          onClick={handleFlip}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-10 py-4 text-lg rounded-full flex items-center gap-2.5 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 animate-pulse-glow"
          whileTap={{ scale: 0.95 }}
        >
          {!isFlipped ? 'Revelar' : (isLast ? 'Finalizar' : 'Próxima')}
          <ChevronRight className="w-6 h-6" />
        </Button>
      </motion.div>
    </div>
  );
};

export default CuriosityCard;