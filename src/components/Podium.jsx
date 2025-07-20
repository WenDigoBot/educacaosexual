import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, Crown, Star, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Podium = ({ rankings, currentPlayer, onClose, onRestart }) => {
  const topThree = rankings.slice(0, 3);
  const currentPlayerRank = rankings.findIndex(
    player => player.nickname === currentPlayer?.nickname && 
              player.score === currentPlayer?.score &&
              player.total === currentPlayer?.total
  ) + 1;

  const getPodiumHeight = (position) => {
    switch (position) {
      case 1: return 'h-32';
      case 2: return 'h-24';
      case 3: return 'h-20';
      default: return 'h-16';
    }
  };

  const getPodiumColor = (position) => {
    switch (position) {
      case 1: return 'from-yellow-400 to-yellow-600';
      case 2: return 'from-gray-300 to-gray-500';
      case 3: return 'from-amber-500 to-amber-700';
      default: return 'from-blue-400 to-blue-600';
    }
  };

  const getRankIcon = (position) => {
    switch (position) {
      case 1:
        return <Crown className="w-8 h-8 text-yellow-400" />;
      case 2:
        return <Trophy className="w-7 h-7 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <Star className="w-5 h-5 text-blue-400" />;
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
        className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
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
            <div className="relative">
              <Trophy className="w-16 h-16 text-yellow-400" />
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{ 
                  scale: [1, 1.3, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Sparkles className="w-6 h-6 text-yellow-300" />
              </motion.div>
            </div>
          </motion.div>
          
          <h2 className="text-3xl font-bold text-white mb-2" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
            🏆 Pódio dos Campeões
          </h2>
          
          <p className="text-white/80 text-lg" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
            Os melhores do quiz de saúde sexual
          </p>
        </div>

        {/* Pódio Visual */}
        {topThree.length > 0 && (
          <div className="flex items-end justify-center gap-4 mb-8">
            {/* 2º Lugar */}
            {topThree[1] && (
              <motion.div
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="mb-2 text-center">
                  <div className="flex justify-center mb-1">
                    {getRankIcon(2)}
                  </div>
                  <div className="text-white font-bold text-sm">
                    {topThree[1].nickname}
                  </div>
                  <div className="text-white/70 text-xs">
                    {topThree[1].score}/{topThree[1].total}
                  </div>
                </div>
                <div className={`w-20 ${getPodiumHeight(2)} bg-gradient-to-t ${getPodiumColor(2)} rounded-t-lg flex items-end justify-center pb-2`}>
                  <span className="text-white font-bold text-xl">2º</span>
                </div>
              </motion.div>
            )}

            {/* 1º Lugar */}
            {topThree[0] && (
              <motion.div
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="mb-2 text-center">
                  <motion.div 
                    className="flex justify-center mb-1"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    {getRankIcon(1)}
                  </motion.div>
                  <div className="text-white font-bold">
                    {topThree[0].nickname}
                  </div>
                  <div className="text-white/70 text-sm">
                    {topThree[0].score}/{topThree[0].total}
                  </div>
                </div>
                <motion.div 
                  className={`w-24 ${getPodiumHeight(1)} bg-gradient-to-t ${getPodiumColor(1)} rounded-t-lg flex items-end justify-center pb-2 relative`}
                  animate={{ 
                    boxShadow: [
                      '0 0 20px rgba(255, 215, 0, 0.3)',
                      '0 0 40px rgba(255, 215, 0, 0.6)',
                      '0 0 20px rgba(255, 215, 0, 0.3)'
                    ]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity
                  }}
                >
                  <span className="text-white font-bold text-2xl">1º</span>
                </motion.div>
              </motion.div>
            )}

            {/* 3º Lugar */}
            {topThree[2] && (
              <motion.div
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="mb-2 text-center">
                  <div className="flex justify-center mb-1">
                    {getRankIcon(3)}
                  </div>
                  <div className="text-white font-bold text-sm">
                    {topThree[2].nickname}
                  </div>
                  <div className="text-white/70 text-xs">
                    {topThree[2].score}/{topThree[2].total}
                  </div>
                </div>
                <div className={`w-16 ${getPodiumHeight(3)} bg-gradient-to-t ${getPodiumColor(3)} rounded-t-lg flex items-end justify-center pb-2`}>
                  <span className="text-white font-bold">3º</span>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* Posição do Jogador Atual */}
        {currentPlayerRank > 0 && (
          <motion.div
            className="bg-blue-500/20 rounded-xl p-4 mb-6 border border-blue-400/30"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
          >
            <div className="text-center">
              <h3 className="text-white font-bold text-lg mb-2">
                🎯 Sua Posição
              </h3>
              <div className="flex items-center justify-center gap-3">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r ${getPodiumColor(currentPlayerRank)}`}>
                  <span className="text-white font-bold">
                    {currentPlayerRank}º
                  </span>
                </div>
                <div className="text-left">
                  <div className="text-white font-medium">
                    {currentPlayer?.nickname}
                  </div>
                  <div className="text-white/70 text-sm">
                    {currentPlayer?.score}/{currentPlayer?.total} pontos ({Math.round((currentPlayer?.score / currentPlayer?.total) * 100)}%)
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Lista Completa do Ranking */}
        <div className="mb-6">
          <h3 className="text-white font-bold text-lg mb-4 text-center">
            📊 Ranking Completo
          </h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {rankings.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-white/60">Nenhuma pontuação registrada ainda</p>
              </div>
            ) : (
              rankings.map((player, index) => {
                const position = index + 1;
                const isCurrentPlayer = player.nickname === currentPlayer?.nickname && 
                                      player.score === currentPlayer?.score &&
                                      player.total === currentPlayer?.total;
                
                return (
                  <motion.div
                    key={`${player.nickname}-${player.timestamp}`}
                    className={`bg-white/5 rounded-lg p-3 border border-white/10 flex items-center gap-3 ${
                      isCurrentPlayer ? 'ring-2 ring-blue-400 bg-blue-500/10' : ''
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.05 }}
                  >
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r ${getPodiumColor(position)} text-xs`}>
                      <span className="text-white font-bold">{position}</span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium text-sm">
                          {player.nickname}
                        </span>
                        {isCurrentPlayer && (
                          <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
                            Você
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-white/70">
                        {player.score} pontos • {Math.round((player.score / player.total) * 100)}%
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* Botões */}
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

export default Podium;

