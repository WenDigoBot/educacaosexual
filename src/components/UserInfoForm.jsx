import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Users, Play, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const UserInfoForm = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [turma, setTurma] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && turma.trim()) {
      onSubmit({ name: name.trim(), turma: turma.trim() });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" 
         style={{
           background: 'linear-gradient(135deg, #4c1d95 0%, #1e3a8a 50%, #312e81 100%)'
         }}>
      
      {/* Partículas de fundo */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/10 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
          
          {/* Cabeçalho */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Heart className="w-10 h-10 text-white" />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-white mb-2"
            >
              Saúde Sexual
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-white/70 text-sm"
            >
              Vamos começar! Informe seus dados para participar do quiz
            </motion.p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Campo Nome */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-white/80 text-sm font-medium mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Seu Nome
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Digite seu nome completo"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
                required
              />
            </motion.div>

            {/* Campo Turma */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label className="block text-white/80 text-sm font-medium mb-2">
                <Users className="w-4 h-4 inline mr-2" />
                Sua Turma
              </label>
              <input
                type="text"
                value={turma}
                onChange={(e) => setTurma(e.target.value)}
                placeholder="Ex: 3º Ano A, Turma 2024, etc."
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
                required
              />
            </motion.div>

            {/* Botão Começar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Button
                type="submit"
                disabled={!name.trim() || !turma.trim()}
                className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <Play className="w-5 h-5 mr-2" />
                Começar Quiz
              </Button>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default UserInfoForm;

