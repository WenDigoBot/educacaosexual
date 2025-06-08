import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Heart, Shield, Brain } from 'lucide-react';
import CuriosityCard from '@/components/CuriosityCard';
import AdminPanel from '@/components/AdminPanel';
import ParticleSystem from '@/components/ParticleSystem';
import WelcomePage from '@/components/WelcomePage';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';

const API_BASE_URL = '/.netlify/functions';

const initialCuriosities = [
  {
    id: 'initial-1',
    text: "O preservativo masculino tem 98% de eficácia quando usado corretamente.",
    isTrue: true,
    revelation: "Isso mesmo! Quando usado de forma consistente e correta, o preservativo é altamente eficaz na prevenção da gravidez e ISTs."
  },
  {
    id: 'initial-2',
    text: "A pílula anticoncepcional protege contra todas as ISTs.",
    isTrue: false,
    revelation: "Na verdade, a pílula anticoncepcional é um método hormonal que previne a gravidez, mas não oferece proteção contra Infecções Sexualmente Transmissíveis (ISTs). Para proteção contra ISTs, o uso de preservativos é essencial."
  },
  {
    id: 'initial-3',
    text: "É possível engravidar durante a menstruação.",
    isTrue: true,
    revelation: "Isso mesmo! Embora menos provável, a ovulação pode ocorrer perto do período menstrual ou o espermatozoide pode sobreviver no corpo por alguns dias, tornando a gravidez possível."
  },
  {
    id: 'initial-4',
    text: "O HPV pode causar câncer de colo do útero.",
    isTrue: true,
    revelation: "Isso mesmo! Certos tipos de HPV são a principal causa de câncer de colo do útero. A vacinação e exames preventivos são importantes."
  },
  {
    id: 'initial-5',
    text: "Fazer xixi após a relação sexual previne 100% das infecções urinárias.",
    isTrue: false,
    revelation: "Na verdade, urinar após a relação sexual pode ajudar a eliminar bactérias da uretra, reduzindo o risco de infecção urinária, mas não garante 100% de prevenção. Outras medidas de higiene também são importantes."
  },
  {
    id: 'initial-6',
    text: "A camisinha feminina é tão eficaz quanto a masculina.",
    isTrue: true,
    revelation: "Isso mesmo! Quando usada corretamente, a camisinha feminina oferece um nível de proteção similar à masculina contra gravidez e ISTs."
  }
];

const backgroundGradients = [
  ['#4c1d95', '#1e3a8a', '#312e81'], 
  ['#831843', '#991b1b', '#b45309'], 
  ['#064e3b', '#0f766e', '#0891b2'], 
  ['#312e81', '#4c1d95', '#831843'], 
  ['#1e3a8a', '#312e81', '#4c1d95'], 
  ['#0f766e', '#064e3b', '#059669']  
];

const cardVariants = {
  enter: (direction) => {
    return {
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8
    };
  },
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  },
  exit: (direction) => {
    return {
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.5,
        ease: "easeIn"
      }
    };
  }
};

function App() {
  const [currentView, setCurrentView] = useState('welcome'); // 'welcome', 'curiosities', 'admin'
  const [curiosities, setCuriosities] = useState(initialCuriosities);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewedCount, setViewedCount] = useState(1);
  const [backgroundIndex, setBackgroundIndex] = useState(0);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [direction, setDirection] = useState(1);
  
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [prevBackgroundIndex, setPrevBackgroundIndex] = useState(0);
  const [nextBackgroundIndex, setNextBackgroundIndex] = useState(0);
  const [transitionProgress, setTransitionProgress] = useState(0);

  const fetchCuriosities = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/curiosities`);
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          setCuriosities(data);
        } else {
          setCuriosities(initialCuriosities); // Fallback para curiosidades iniciais se o banco estiver vazio
        }
      } else {
        console.error('Erro ao buscar curiosidades:', response.statusText);
        setCuriosities(initialCuriosities); // Fallback em caso de erro na requisição
      }
    } catch (error) {
      console.error('Erro ao buscar curiosidades:', error);
      setCuriosities(initialCuriosities); // Fallback em caso de erro de rede/parsing
    }
  };

  useEffect(() => {
    fetchCuriosities();
  }, []);

  const handleStartJourney = () => {
    setCurrentView('curiosities');
  };

  const handleOpenAdmin = () => {
    setCurrentView('admin');
  };

  const handleCloseAdmin = () => {
    setCurrentView('curiosities');
  };

  const handleNext = () => {
    if (currentIndex < curiosities.length - 1) {
      setDirection(1);
      setIsTransitioning(true);
      
      setPrevBackgroundIndex(backgroundIndex);
      const nextIndex = (backgroundIndex + 1) % backgroundGradients.length;
      setNextBackgroundIndex(nextIndex);
      
      let progress = 0;
      const animationInterval = setInterval(() => {
        progress += 0.05;
        setTransitionProgress(progress);
        
        if (progress >= 1) {
          clearInterval(animationInterval);
          setBackgroundIndex(nextIndex);
          setTimeout(() => {
            setIsTransitioning(false);
            setTransitionProgress(0);
          }, 100);
        }
      }, 20);
      
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setViewedCount(newIndex + 1);

    } else {
      setShowFinalMessage(true);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setViewedCount(1);
    setBackgroundIndex(0);
    setShowFinalMessage(false);
    if (curiosities.length === 0) {
      setCurrentView('admin');
    }
  };

  const addCuriosity = async (newCuriosity) => {
    try {
      const response = await fetch(`${API_BASE_URL}/curiosities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCuriosity),
      });

      if (response.ok) {
        const data = await response.json();
        setCuriosities(prev => [...prev, { id: data.id, ...newCuriosity }]);
        if (showFinalMessage && curiosities.length === 0) {
          setShowFinalMessage(false);
        }
        fetchCuriosities(); // Recarrega as curiosidades para garantir consistência
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao adicionar curiosidade');
      }
    } catch (error) {
      console.error('Erro ao adicionar curiosidade:', error);
    }
  };

  const editCuriosity = async (id, updatedCuriosity) => {
    try {
      const response = await fetch(`${API_BASE_URL}/curiosities?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCuriosity),
      });

      if (response.ok) {
        setCuriosities(prev => 
          prev.map(c => c.id === id ? { ...c, ...updatedCuriosity } : c)
        );
        fetchCuriosities(); // Recarrega as curiosidades para garantir consistência
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao editar curiosidade');
      }
    } catch (error) {
      console.error('Erro ao editar curiosidade:', error);
    }
  };

  const deleteCuriosity = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/curiosities?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const newCuriosities = curiosities.filter(c => c.id !== id);
        setCuriosities(newCuriosities);
        
        if (newCuriosities.length === 0) {
          setCurrentIndex(0);
          setShowFinalMessage(true); 
        } else if (currentIndex >= newCuriosities.length) {
          setCurrentIndex(Math.max(0, newCuriosities.length - 1));
        }
        fetchCuriosities(); // Recarrega as curiosidades para garantir consistência
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao deletar curiosidade');
      }
    } catch (error) {
      console.error('Erro ao deletar curiosidade:', error);
    }
  };

  const interpolateColors = (colorA, colorB, factor) => {
    const hexToRgb = (hex) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return [r, g, b];
    };
    
    const lerp = (a, b, factor) => Math.round(a + (b - a) * factor);
    
    const rgbToHex = (r, g, b) => `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    
    const rgbA = hexToRgb(colorA);
    const rgbB = hexToRgb(colorB);
    
    const r = lerp(rgbA[0], rgbB[0], factor);
    const g = lerp(rgbA[1], rgbB[1], factor);
    const b = lerp(rgbA[2], rgbB[2], factor);
    
    return rgbToHex(r, g, b);
  };

  const getCurrentGradient = () => {
    if (!isTransitioning) {
      return `linear-gradient(135deg, ${backgroundGradients[backgroundIndex][0]}, ${backgroundGradients[backgroundIndex][1]}, ${backgroundGradients[backgroundIndex][2]})`;
    }
    
    const color1 = interpolateColors(
      backgroundGradients[prevBackgroundIndex][0], 
      backgroundGradients[nextBackgroundIndex][0], 
      transitionProgress
    );
    
    const color2 = interpolateColors(
      backgroundGradients[prevBackgroundIndex][1], 
      backgroundGradients[nextBackgroundIndex][1], 
      transitionProgress
    );
    
    const color3 = interpolateColors(
      backgroundGradients[prevBackgroundIndex][2], 
      backgroundGradients[nextBackgroundIndex][2], 
      transitionProgress
    );
    
    return `linear-gradient(135deg, ${color1}, ${color2}, ${color3})`;
  };

  if (currentView === 'welcome') {
    return <WelcomePage onStart={handleStartJourney} />;
  }

  if (currentView === 'admin') {
    return (
      <AdminPanel 
        isOpen={true} 
        onClose={handleCloseAdmin} 
        curiosities={curiosities} 
        addCuriosity={addCuriosity} 
        editCuriosity={editCuriosity} 
        deleteCuriosity={deleteCuriosity}
      />
    );
  }

  return (
    <div className="h-screen w-screen relative overflow-hidden">
      <div 
        className="absolute inset-0 transition-all duration-500"
        style={{
          background: getCurrentGradient(),
          transition: "background 0.5s ease-in-out"
        }}
      />
      
      <ParticleSystem />
      
      <div className="relative z-10 h-full w-full flex flex-col">
        <header className="p-3 sm:p-4 flex flex-wrap justify-between items-center">
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" />
            <h1 className="text-lg sm:text-xl font-bold text-white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Saúde Sexual</h1>
          </motion.div>
          
          <div className="flex items-center gap-2">
            <motion.div 
              className="bg-white/10 backdrop-blur-sm rounded-full px-2 py-1 sm:px-3 sm:py-1 border border-white/20"
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-xs sm:text-sm text-white font-medium" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                Curiosidades vistas: {viewedCount}
              </span>
            </motion.div>
            
            <Button
              onClick={handleOpenAdmin}
              variant="outline"
              size="icon"
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 w-8 h-8"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-2 sm:p-4">
          <AnimatePresence mode="wait" custom={direction}>
            {showFinalMessage || curiosities.length === 0 ? (
              <motion.div
                key="final"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center w-full max-w-2xl mx-auto"
              >
                <motion.div
                  className="bg-white/10 backdrop-blur-lg rounded-3xl p-4 sm:p-6 md:p-8 border border-white/20"
                  animate={{
                    y: [0, -10, 0],
                    boxShadow: [
                      '0 0 20px rgba(255,255,255,0.1)',
                      '0 0 40px rgba(255,255,255,0.2)',
                      '0 0 20px rgba(255,255,255,0.1)'
                    ]
                  }}
                  transition={{ 
                    y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                    boxShadow: { duration: 2, repeat: Infinity }
                  }}
                >
                  <div className="flex justify-center mb-3 sm:mb-4">
                    <div className="flex gap-2 sm:gap-3">
                      <Shield className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-green-400" />
                      <Heart className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-red-400" />
                      <Brain className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-blue-400" />
                    </div>
                  </div>
                  
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                    {curiosities.length === 0 ? "Sem Curiosidades!" : "Parabéns! 🎉"}
                  </h2>
                  
                  {curiosities.length === 0 ? (
                    <p className="text-sm sm:text-base md:text-lg text-white/90 mb-4 sm:mb-6" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
                      Adicione algumas curiosidades no painel de administração para começar!
                    </p>
                  ) : (
                    <motion.div 
                      className="space-y-2 sm:space-y-3 text-sm sm:text-base md:text-lg text-white/90 mb-4 sm:mb-6"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <p className="font-semibold text-green-400" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}>
                        "Educação é prevenção."
                      </p>
                      <p className="font-semibold text-blue-400" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}>
                        "Respeito é proteção."
                      </p>
                      <p className="font-semibold text-purple-400" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}>
                        "Informação é poder."
                      </p>
                    </motion.div>
                  )}
                  
                  <Button
                    onClick={handleReset}
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold px-4 py-2 sm:px-6 sm:py-2 rounded-full animate-pulse-glow text-sm sm:text-base"
                  >
                    {curiosities.length === 0 ? "Adicionar Curiosidades" : "Recomeçar Jornada"}
                  </Button>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={cardVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full"
              >
                <CuriosityCard
                  curiosity={curiosities[currentIndex]}
                  onNext={handleNext}
                  isLast={currentIndex === curiosities.length - 1}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <footer className="p-3 sm:p-4 text-center text-white/70 text-xs sm:text-sm" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
          Desenvolvido com ❤️ por Jociel
        </footer>
      </div>
      
      {currentView === 'admin' && (
        <AdminPanel
          isOpen={true}
          onClose={handleCloseAdmin}
          curiosities={curiosities}
          addCuriosity={addCuriosity}
          editCuriosity={editCuriosity}
          deleteCuriosity={deleteCuriosity}
        />
      )}
      <Toaster />
    </div>
  );
}

export default App;


