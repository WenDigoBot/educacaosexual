import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft, CheckCircle, XCircle, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Arrays de emojis para cada posição
const hospitalEmojis = ['🏥', '💉', '💊', '🩺', '🧬', '👨‍⚕️', '🧼', '🩹', '🚑', '⚕️'];
const curiosityEmojis = ['🤔', '🤓', '🧠', '💭', '🔍', '👀', '❓', '📚', '😐', '🧐'];
const reactionEmojis = ['🫢', '🤨', '😲', '😳', '😶', '😮', '🤯', '😬', '😵', '😯'];

const CuriosityCard = ({ curiosity, onNext, onPrevious, currentIndex, isLast, direction, cardVariants, onAnswer, isAnswered = false }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [userAnswer, setUserAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [topEmoji, setTopEmoji] = useState('');
  const [bottomEmoji, setBottomEmoji] = useState('');
  const [reactionEmoji, setReactionEmoji] = useState('');

  // Selecionar emojis aleatórios quando o componente é montado ou quando a curiosidade muda
  useEffect(() => {
    setTopEmoji(hospitalEmojis[Math.floor(Math.random() * hospitalEmojis.length)]);
    setBottomEmoji(curiosityEmojis[Math.floor(Math.random() * curiosityEmojis.length)]);
    setReactionEmoji(reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)]);
    
    // Resetar estados quando a curiosidade muda
    setIsFlipped(false);
    setUserAnswer(null);
    setShowResult(false);
    
    // Se a questão já foi respondida, mostrar o resultado
    if (isAnswered) {
      setShowResult(true);
      setUserAnswer('answered'); // Marcar como respondida
    }
  }, [curiosity.id, isAnswered]);

  const handleAnswer = (answer) => {
    // Não permitir resposta se a questão já foi respondida
    if (isAnswered || userAnswer !== null) {
      return;
    }
    
    setUserAnswer(answer);
    setShowResult(true);
    
    // Verificar se a resposta está correta
    const isCorrect = answer === curiosity.isTrue;
    
    // Chamar callback para atualizar pontuação
    onAnswer(isCorrect);
    
    // Aguardar 2 segundos antes de permitir avançar
    setTimeout(() => {
      setIsFlipped(true);
    }, 2000);
  };

  const handleFlip = () => {
    if (!isFlipped) {
      setIsFlipped(true);
    } else {
      onNext(); // This will trigger the parent to change curiosity, unmounting/remounting this card
    }
  };
  
  // Garante que curiosity e curiosity.revelation existam
  const revelationContent = curiosity?.revelation || (curiosity?.isTrue ? "Isso mesmo!" : "Na verdade...");

  return (
    <div className="w-full max-w-lg mx-auto px-2 sm:px-0">
      <motion.div
        className="card-3d relative w-full h-[calc(100vh-180px)] max-h-[500px]"
        variants={cardVariants}
        initial="enter"
        animate="center"
        exit="exit"
        custom={direction}
        whileHover={{
          rotateY: isFlipped ? 0 : 3,
          rotateX: isFlipped ? 0 : 3,
          scale: 1.01
        }}
      >
        <motion.div
          className="absolute inset-0 w-full h-full"
          initial={false}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.7, type: "spring", stiffness:150, damping:20 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front Face */}
          <div className="card-face absolute inset-0 w-full h-full bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-4 sm:p-6 flex flex-col justify-between items-center text-center">
            <motion.div
              className="text-4xl sm:text-5xl pt-2"
              animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
              {topEmoji}
            </motion.div>
            
            <div className="w-full flex-1 flex flex-col justify-center">
              <h2 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
                Curiosidade sobre Saúde Sexual
              </h2>
              <div className="bg-white/5 rounded-2xl p-3 sm:p-4 border border-white/10 flex items-center justify-center flex-1 min-h-0">
                <p className="text-base sm:text-lg text-white/90 leading-relaxed" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>
                  {curiosity?.text}
                </p>
              </div>
            </div>
            
            <div className="pt-2">
              <motion.div
                className="text-2xl sm:text-3xl mb-1 sm:mb-2"
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              >
                {bottomEmoji}
              </motion.div>
              
              {!showResult ? (
                <div className="space-y-3">
                  <p className="text-xs sm:text-sm text-white/70" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>
                    Esta afirmação é verdadeira ou falsa?
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button
                      onClick={() => handleAnswer(true)}
                      disabled={isAnswered || userAnswer !== null}
                      className={`font-bold px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg ${
                        isAnswered || userAnswer !== null 
                          ? 'bg-gray-500 cursor-not-allowed opacity-50' 
                          : 'bg-green-600 hover:bg-green-700'
                      } text-white`}
                      whileTap={isAnswered || userAnswer !== null ? {} : { scale: 0.95 }}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      Verdadeiro
                    </Button>
                    <Button
                      onClick={() => handleAnswer(false)}
                      disabled={isAnswered || userAnswer !== null}
                      className={`font-bold px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg ${
                        isAnswered || userAnswer !== null 
                          ? 'bg-gray-500 cursor-not-allowed opacity-50' 
                          : 'bg-red-600 hover:bg-red-700'
                      } text-white`}
                      whileTap={isAnswered || userAnswer !== null ? {} : { scale: 0.95 }}
                    >
                      <ThumbsDown className="w-4 h-4" />
                      Falso
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`text-lg font-bold ${
                      (userAnswer === curiosity?.isTrue) ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {(userAnswer === curiosity.isTrue) ? '✅ Certo!' : '❌ Errado!'}
                  </motion.div>
                  <p className="text-xs sm:text-sm text-white/70" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>
                    Aguarde a revelação...
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Back Face */}
          <div className="card-face card-back absolute inset-0 w-full h-full bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-4 sm:p-6 flex flex-col justify-between items-center text-center">
            <motion.div
              className="text-4xl sm:text-5xl pt-2"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
            >
              {reactionEmoji}
            </motion.div>

            <div className="w-full flex-1 flex flex-col justify-center">
              <motion.div
                className={`text-2xl sm:text-3xl font-bold mb-2 ${
                  curiosity?.isTrue ? 'text-green-400 glow-verdade' : 'text-red-400 glow-mito'
                }`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, type: "spring" }}
              >
                {curiosity?.isTrue ? (
                  <div className="flex items-center justify-center gap-1 sm:gap-2">
                    <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8" />
                    <span>VERDADE</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-1 sm:gap-2">
                    <XCircle className="w-6 h-6 sm:w-8 sm:h-8" />
                    <span>MITO</span>
                  </div>
                )}
              </motion.div>
              
              <motion.div
                className="bg-white/5 rounded-2xl p-3 sm:p-4 border border-white/10 flex items-center justify-center flex-1 min-h-0"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.45, type: "spring" }}
              >
                <p className="text-base sm:text-lg text-white/90 leading-relaxed" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>
                  {revelationContent}
                </p>
              </motion.div>
            </div>
            
            <motion.p
              className="text-xs sm:text-sm text-white/70 pt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}
            >
              {isLast ? 'Clique para finalizar!' : 'Clique para a próxima curiosidade!'}
            </motion.p>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="flex justify-center items-center gap-2 mt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {currentIndex > 0 && (
          <motion.div
            variants={cardVariants}
            initial="enter"
            animate="center"
            exit="exit"
            custom={direction}
          >
            <Button
              onClick={onPrevious}
              variant="outline"
              size="icon"
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 w-10 h-10 sm:w-12 sm:h-12"
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </Button>
          </motion.div>
        )}
        
        <motion.div
          variants={cardVariants}
          initial="enter"
          animate="center"
          exit="exit"
          custom={direction}
        >
          <Button
            onClick={handleFlip}
            disabled={!showResult}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg rounded-full flex items-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50"
            whileTap={{ scale: 0.95 }}
          >
            {!showResult ? 'Responda primeiro' : (isLast ? 'Finalizar' : 'Próxima')}
            <ChevronRight className="w-5 h-5" />
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CuriosityCard;

