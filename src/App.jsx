import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Heart, Shield, Brain, Download } from 'lucide-react';
import CuriosityCard from '@/components/CuriosityCard';
import AdminPanel from '@/components/AdminPanel';
import ParticleSystem from '@/components/ParticleSystem';
import WelcomePage from '@/components/WelcomePage';
import PasswordPrompt from '@/components/PasswordPrompt'; // Importar o componente de senha
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { toast } from '@/components/ui/use-toast';

// Não importar mais as curiosidades diretamente, vamos buscá-las via fetch
// import initialCuriositiesData from '@/data/curiosities.json';

const backgroundGradients = [
  ['#4c1d95', '#1e3a8a', '#312e81'], 
  ['#831843', '#991b1b', '#b45309'], 
  ['#064e3b', '#0f766e', '#0891b2'], 
  ['#312e81', '#4c1d95', '#831843'], 
  ['#1e3a8a', '#312e81', '#4c1d95'], 
  ['#0f766e', '#064e3b', '#059669']  
];

// Variantes de animação para o cartão
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
  const [showWelcome, setShowWelcome] = useState(true);
  const [curiosities, setCuriosities] = useState([]);
  const [isLoadingCuriosities, setIsLoadingCuriosities] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewedCount, setViewedCount] = useState(1);
  const [backgroundIndex, setBackgroundIndex] = useState(0);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [direction, setDirection] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionProgress, setTransitionProgress] = useState(0);
  const [prevBackgroundIndex, setPrevBackgroundIndex] = useState(0);
  const [nextBackgroundIndex, setNextBackgroundIndex] = useState(0);
  const [isCardTransitioning, setIsCardTransitioning] = useState(false);
  const [showDownloadPassword, setShowDownloadPassword] = useState(false);
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  useEffect(() => {
    const fetchCuriosities = async () => {
      try {
        // Adiciona um timestamp para cache-busting
        const response = await fetch(`/data/curiosities.json?v=${Date.now()}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const fetchedCuriosities = await response.json();

        // Tenta carregar do localStorage e mesclar
        const saved = localStorage.getItem("healthCuriosities");
        if (saved) {
          const parsedSavedCuriosities = JSON.parse(saved);
          // Mescla as curiosidades do GitHub com as do localStorage
          // Prioriza as do localStorage se houver conflito de ID, ou adiciona novas
          const mergedCuriosities = fetchedCuriosities.map(fc => {
            const savedC = parsedSavedCuriosities.find(psc => psc.id === fc.id);
            return savedC ? { ...fc, ...savedC } : fc;
          });
          // Adiciona curiosidades que só existem no localStorage
          const newFromLocalStorage = parsedSavedCuriosities.filter(psc => 
            !fetchedCuriosities.some(fc => fc.id === psc.id)
          );
          setCuriosities([...mergedCuriosities, ...newFromLocalStorage]);
        } else {
          setCuriosities(fetchedCuriosities);
        }
      } catch (error) {
        console.error("Erro ao carregar curiosidades:", error);
        toast({
          title: "Erro ao Carregar Curiosidades",
          description: "Não foi possível carregar as curiosidades. Verifique sua conexão ou tente novamente.",
          variant: "destructive"
        });
        // Fallback para localStorage se a busca falhar
        const saved = localStorage.getItem("healthCuriosities");
        if (saved) {
          setCuriosities(JSON.parse(saved));
        }
      } finally {
        setIsLoadingCuriosities(false);
      }
    };

    fetchCuriosities();
  }, []); // Executa apenas uma vez ao montar o componente

  useEffect(() => {
    // Salva no localStorage sempre que as curiosidades mudam
    localStorage.setItem("healthCuriosities", JSON.stringify(curiosities));
  }, [curiosities]);

  const handleStart = () => {
    setShowWelcome(false);
  };

  const handleNext = () => {
    if (currentIndex < curiosities.length - 1) {
      setDirection(1);
      setIsCardTransitioning(true);
      setIsTransitioning(true);
      
      setPrevBackgroundIndex(backgroundIndex);
      const nextIndex = (backgroundIndex + 1) % backgroundGradients.length;
      setNextBackgroundIndex(nextIndex);
      
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setViewedCount(newIndex + 1);
      
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
            setIsCardTransitioning(false);
          }, 100);
        }
      }, 20);
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
      setShowAdmin(true);
    }
  };

  const addCuriosity = (newCuriosity) => {
    const curiosity = {
      id: Date.now(),
      ...newCuriosity
    };
    setCuriosities(prev => [...prev, curiosity]);
    if (showFinalMessage && curiosities.length === 0) {
      setShowFinalMessage(false);
    }
  };

  const editCuriosity = (id, updatedCuriosity) => {
    setCuriosities(prev => 
      prev.map(c => c.id === id ? { ...c, ...updatedCuriosity } : c)
    );
  };

  const deleteCuriosity = (id) => {
    const newCuriosities = curiosities.filter(c => c.id !== id);
    setCuriosities(newCuriosities);
    
    if (newCuriosities.length === 0) {
      setCurrentIndex(0);
      setShowFinalMessage(true); 
    } else if (currentIndex >= newCuriosities.length) {
      setCurrentIndex(Math.max(0, newCuriosities.length - 1));
    }
  };

  const handleDownloadClick = () => {
    setShowDownloadPassword(true);
  };

  const handleDownloadAuthenticate = async () => {
    try {
      // Enviar dados para a Netlify Function
      const response = await fetch('/.netlify/functions/update-github', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          curiosities: curiosities,
          password: 'admin123' // A senha será validada na Netlify Function
        })
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Sucesso!",
          description: "Curiosidades atualizadas no GitHub automaticamente! O site será atualizado em breve.",
        });
      } else {
        throw new Error(result.error || 'Erro desconhecido');
      }
    } catch (error) {
      console.error('Erro ao atualizar GitHub:', error);
      toast({
        title: "Erro na Atualização",
        description: `Erro ao atualizar o GitHub: ${error.message}. Fazendo download local como alternativa.`,
        variant: "destructive"
      });
      
      // Fallback para download local
      downloadUpdatedFile();
    }
    
    setShowDownloadPassword(false);
  };

  const downloadUpdatedFile = () => {
    try {
      const dataStr = JSON.stringify(curiosities, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = 'curiosities.json';
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast({
        title: "Download Concluído!",
        description: "Arquivo curiosities.json baixado com sucesso. Substitua o arquivo no seu repositório GitHub.",
      });
    } catch (error) {
      toast({
        title: "Erro no Download",
        description: "Ocorreu um erro ao gerar o arquivo. Tente novamente.",
        variant: "destructive"
      });
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

  if (showWelcome) {
    return <WelcomePage onStart={handleStart} />;
  }

  if (isLoadingCuriosities) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-purple-800 via-blue-800 to-indigo-900 text-white text-2xl font-bold">
        Carregando Curiosidades...
      </div>
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
              onClick={handleDownloadClick} // Chama a função que exibe o prompt de senha
              variant="outline"
              size="icon"
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 w-8 h-8"
              title="Baixar arquivo atualizado"
            >
              <Download className="w-4 h-4" />
            </Button>
            
            <Button
              onClick={() => setShowAdmin(!showAdmin)}
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

        <AnimatePresence>
          {showAdmin && (
            <AdminPanel
              curiosities={curiosities}
              onAdd={addCuriosity}
              onEdit={editCuriosity}
              onDelete={deleteCuriosity}
              onClose={() => setShowAdmin(false)}
            />
          )}
        </AnimatePresence>
      </div>
      
      <Toaster />

      {showDownloadPassword && (
        <PasswordPrompt
          onAuthenticate={handleDownloadAuthenticate}
          onClose={() => setShowDownloadPassword(false)}
        />
      )}
    </div>
  );
}

export default App;


