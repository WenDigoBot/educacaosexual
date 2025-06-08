import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Shield, Brain, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ParticleSystem from '@/components/ParticleSystem';

const WelcomePage = ({ onStart }) => {
  return (
    <div className="h-screen w-screen relative overflow-hidden">
      {/* Fundo com gradiente animado entre roxo e azul */}
      <motion.div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #4c1d95, #1e40af, #312e81)'
        }}
        animate={{
          background: [
            'linear-gradient(135deg, #4c1d95, #1e40af, #312e81)',
            'linear-gradient(135deg, #1e40af, #312e81, #4c1d95)',
            'linear-gradient(135deg, #312e81, #4c1d95, #1e40af)',
            'linear-gradient(135deg, #4c1d95, #1e40af, #312e81)',
          ]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Sistema de partículas */}
      <ParticleSystem />
      
      {/* Conteúdo principal */}
      <div className="relative z-10 h-full w-full flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto flex flex-col h-full justify-center"
        >
          {/* Ícones animados */}
          <motion.div 
            className="flex justify-center mb-4 sm:mb-6 gap-3 sm:gap-6"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Shield className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 text-green-400" />
            <Heart className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 text-red-400" />
            <Brain className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 text-blue-400" />
          </motion.div>
          
          {/* Título principal */}
          <motion.h1 
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-4 text-shadow-sm"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
          >
            Saúde Sexual
          </motion.h1>
          
          {/* Subtítulo */}
          <motion.p 
            className="text-base sm:text-lg md:text-xl text-white/90 mb-4 sm:mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
          >
            É assunto sério!
          </motion.p>
          
          {/* Card com frases - Adicionada sombra aos textos */}
          <motion.div
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-4 sm:p-6 md:p-8 border border-white/20 mb-4 sm:mb-6 max-h-[40vh] overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              y: [0, -10, 0],
              rotate: [0, 0.5, 0, -0.5, 0]
            }}
            transition={{ 
              opacity: { delay: 0.5, duration: 0.8 },
              scale: { delay: 0.5, duration: 0.8 },
              y: { delay: 1, duration: 3, repeat: Infinity, ease: "easeInOut" },
              rotate: { delay: 1, duration: 5, repeat: Infinity, ease: "easeInOut" }
            }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="space-y-2 sm:space-y-3 text-sm sm:text-base md:text-lg">
              <motion.p 
                className="font-semibold text-green-400 text-xl sm:text-2xl md:text-3xl"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                style={{ textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}
              >
                ❤️
              </motion.p>
              <p 
                className="font-semibold text-blue-400 text-lg sm:text-xl md:text-2xl"
                style={{ textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}
              >
                Descubra curiosidades importantes sobre saúde sexual e bem-estar. Teste seus conhecimentos e aprenda de forma interativa!
              </p>
              <motion.p 
                className="font-semibold text-purple-400 text-xl sm:text-2xl md:text-3xl"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                style={{ textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}
              >
                💜
              </motion.p>
            </div>
          </motion.div>
          
          {/* Botão de início - Centralizado */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex justify-center w-full"
          >
            <Button
              onClick={onStart}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-6 sm:px-8 py-2 sm:py-4 text-base sm:text-lg rounded-full flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 animate-pulse-glow"
              whileTap={{ scale: 0.95 }}
            >
              Começar Jornada
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default WelcomePage;

