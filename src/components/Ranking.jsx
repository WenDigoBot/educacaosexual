import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, Star, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Ranking = ({ rankings, currentPlayer, onClose, onRestart }) => {
  const getRankIcon = (position) => {
    switch (position) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Trophy className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <Star className="w-5 h-5 text-blue-400" />;
    }
  };

  const getRankColor = (position) => {
    switch (position) {
      case 1:
        return 'from-yellow-400 to-yellow-600';
      case 2:
        return 'from-gray-300 to-gray-500';
      case 3:
        return 'from-amber-500 to-amber-700';
      default:
        return 'from-blue-400 to-blue-600';
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 w-full max-w-md max-h-[80vh] overflow-y-auto"
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
      >
        <div className="text-center mb-6">
          <motion.div
            className="flex justify-center mb-4"
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
            <Trophy className="w-12 h-12 text-yellow-400" />
          </motion.div>
          
          <h2 className="text-2xl font-bold text-white mb-2" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
            🏆 Ranking
          </h2>
          
          <p className="text-white/80" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
            Melhores pontuações
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {rankings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-white/60">Nenhuma pontuação registrada ainda</p>
            </div>
          ) : (
            rankings.map((player, index) => {
              const position = index + 1;
              const isCurrentPlayer = player.nickname === currentPlayer?.nickname && 
                                    player.score === currentPlayer?.score;
              
              return (
                <motion.div
                  key={`${player.nickname}-${player.timestamp}`}
                  className={`bg-white/5 rounded-xl p-4 border border-white/10 flex items-center gap-3 ${
                    isCurrentPlayer ? 'ring-2 ring-blue-400 bg-blue-500/10' : ''
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r ${getRankColor(position)}`}>
                    {getRankIcon(position)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-lg">
                        {position}º
                      </span>
                      <span className="text-white font-medium">
                        {player.nickname}
                      </span>
                      {isCurrentPlayer && (
                        <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
                          Você
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-white/70">
                      {player.score} {player.score === 1 ? 'ponto' : 'pontos'} • {player.total} {player.total === 1 ? 'pergunta' : 'perguntas'}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-bold text-white">
                      {player.score}
                    </div>
                    <div className="text-xs text-white/60">
                      {Math.round((player.score / player.total) * 100)}%
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        <div className="flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
          >
            Fechar
          </Button>
          <Button
            onClick={onRestart}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            Jogar Novamente
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Ranking;

