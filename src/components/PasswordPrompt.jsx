import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const PasswordPrompt = ({ onAuthenticate, onClose }) => {
  const [password, setPassword] = useState('');
  const correctPassword = "admin123"; // Senha definida

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === correctPassword) {
      onAuthenticate();
      onClose();
    } else {
      toast({
        title: "Erro de Autenticação",
        description: "Senha incorreta. Tente novamente.",
        variant: "destructive"
      });
      setPassword(''); // Limpa o campo da senha
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 w-full max-w-md text-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        <h2 className="text-2xl font-bold text-white mb-4">Acesso Restrito</h2>
        <p className="text-white/80 mb-6">Por favor, insira a senha para continuar.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Senha"
            required
          />
          <div className="flex gap-3 justify-center">
            <Button
              type="submit"
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
            >
              Entrar
            </Button>
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default PasswordPrompt;

