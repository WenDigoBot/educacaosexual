import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NicknamePrompt = ({ onStart }) => {
  const [nickname, setNickname] = useState('');
  const [turma, setTurma] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nickname.trim() && turma.trim()) {
      onStart(nickname.trim(), turma.trim());
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-purple-800 via-blue-800 to-indigo-900 relative overflow-hidden">
      {/* Partículas de fundo */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, -100],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <motion.div
        className="relative z-10 w-full max-w-md mx-auto p-6"
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 text-center"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <motion.div
            className="flex justify-center mb-6"
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <User className="w-16 h-16 text-blue-400" />
          </motion.div>

          <h1 className="text-3xl font-bold text-white mb-2" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
            Bem-vindo!
          </h1>
          
          <p className="text-white/80 mb-6 text-lg" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
            Digite seu nickname para começar o quiz
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Seu nickname..."
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-center text-lg"
                maxLength={20}
                autoFocus
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <input
                type="text"
                value={turma}
                onChange={(e) => setTurma(e.target.value)}
                placeholder="Sua turma..."
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-center text-lg"
                maxLength={20}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                type="submit"
                disabled={!nickname.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-3 text-lg rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
                whileTap={{ scale: 0.95 }}
              >
                <Play className="w-5 h-5" />
                Começar Quiz
              </Button>
            </motion.div>
          </form>

          <motion.p
            className="text-white/60 text-sm mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}
          >
            Teste seus conhecimentos sobre saúde sexual!
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NicknamePrompt;

