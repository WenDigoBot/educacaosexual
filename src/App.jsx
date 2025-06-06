import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Heart, Shield, Brain } from 'lucide-react';
import CuriosityCard from '@/components/CuriosityCard';
import AdminPanel from '@/components/AdminPanel';
import ParticleSystem from '@/components/ParticleSystem';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';

const initialCuriosities = [
  {
    id: 1,
    text: "O preservativo masculino tem 98% de eficácia quando usado corretamente.",
    isTrue: true,
    revelation: "Isso mesmo! Quando usado de forma consistente e correta, o preservativo é altamente eficaz na prevenção da gravidez e ISTs."
  },
  {
    id: 2,
    text: "A pílula anticoncepcional protege contra todas as ISTs.",
    isTrue: false,
    revelation: "Na verdade, a pílula anticoncepcional é um método hormonal que previne a gravidez, mas não oferece proteção contra Infecções Sexualmente Transmissíveis (ISTs). Para proteção contra ISTs, o uso de preservativos é essencial."
  },
  {
    id: 3,
    text: "É possível engravidar durante a menstruação.",
    isTrue: true,
    revelation: "Isso mesmo! Embora menos provável, a ovulação pode ocorrer perto do período menstrual ou o espermatozoide pode sobreviver no corpo por alguns dias, tornando a gravidez possível."
  },
  {
    id: 4,
    text: "O HPV pode causar câncer de colo do útero.",
    isTrue: true,
    revelation: "Isso mesmo! Certos tipos de HPV são a principal causa de câncer de colo do útero. A vacinação e exames preventivos são importantes."
  },
  {
    id: 5,
    text: "Fazer xixi após a relação sexual previne 100% das infecções urinárias.",
    isTrue: false,
    revelation: "Na verdade, urinar após a relação sexual pode ajudar a eliminar bactérias da uretra, reduzindo o risco de infecção urinária, mas não garante 100% de prevenção. Outras medidas de higiene também são importantes."
  },
  {
    id: 6,
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

function App() {
  const [curiosities, setCuriosities] = useState(() => {
    const saved = localStorage.getItem('healthCuriosities');
    if (saved) {
      const parsedCuriosities = JSON.parse(saved);
      return parsedCuriosities.map(c => ({
        ...initialCuriosities.find(ic => ic.id === c.id) || { revelation: c.isTrue ? "Isso mesmo!" : "Na verdade..." }, 
        ...c 
      }));
    }
    return initialCuriosities;
  });
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewedCount, setViewedCount] = useState(0);
  const [showAdmin, setShowAdmin] = useState(false);
  const [backgroundIndex, setBackgroundIndex] = useState(0);
  const [showFinalMessage, setShowFinalMessage] = useState(false);

  useEffect(() => {
    localStorage.setItem('healthCuriosities', JSON.stringify(curiosities));
  }, [curiosities]);

  const handleNext = () => {
    if (currentIndex < curiosities.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setViewedCount(prev => prev + 1);
      setBackgroundIndex(prev => (prev + 1) % backgroundGradients.length);
    } else {
      setShowFinalMessage(true);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setViewedCount(0);
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

  return (
    <div className="min-h-screen relative overflow-hidden">
      <motion.div 
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${backgroundGradients[backgroundIndex][0]}, ${backgroundGradients[backgroundIndex][1]}, ${backgroundGradients[backgroundIndex][2]})`
        }}
        animate={{
          background: [
            `linear-gradient(135deg, ${backgroundGradients[backgroundIndex][0]}, ${backgroundGradients[backgroundIndex][1]}, ${backgroundGradients[backgroundIndex][2]})`,
            `linear-gradient(135deg, ${backgroundGradients[backgroundIndex][1]}, ${backgroundGradients[backgroundIndex][2]}, ${backgroundGradients[backgroundIndex][0]})`,
            `linear-gradient(135deg, ${backgroundGradients[backgroundIndex][2]}, ${backgroundGradients[backgroundIndex][0]}, ${backgroundGradients[backgroundIndex][1]})`,
            `linear-gradient(135deg, ${backgroundGradients[backgroundIndex][0]}, ${backgroundGradients[backgroundIndex][1]}, ${backgroundGradients[backgroundIndex][2]})`,
          ]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />
      
      <ParticleSystem />
      
      <div className="relative z-10 min-h-screen flex flex-col">
        <header className="p-6 flex justify-between items-center">
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Heart className="w-8 h-8 text-red-400" />
            <h1 className="text-2xl font-bold text-white">Saúde Sexual</h1>
          </motion.div>
          
          <div className="flex items-center gap-4">
            <motion.div 
              className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20"
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-white font-medium">
                Curiosidades vistas: {viewedCount}
              </span>
            </motion.div>
            
            <Button
              onClick={() => setShowAdmin(!showAdmin)}
              variant="outline"
              size="icon"
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-6">
          <AnimatePresence mode="wait">
            {showFinalMessage || curiosities.length === 0 ? (
              <motion.div
                key="final"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center max-w-2xl mx-auto"
              >
                <motion.div
                  className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20"
                  animate={{ 
                    boxShadow: [
                      '0 0 20px rgba(255,255,255,0.1)',
                      '0 0 40px rgba(255,255,255,0.2)',
                      '0 0 20px rgba(255,255,255,0.1)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="flex justify-center mb-6">
                    <div className="flex gap-4">
                      <Shield className="w-12 h-12 text-green-400" />
                      <Heart className="w-12 h-12 text-red-400" />
                      <Brain className="w-12 h-12 text-blue-400" />
                    </div>
                  </div>
                  
                  <h2 className="text-4xl font-bold text-white mb-6 glow-text">
                    {curiosities.length === 0 ? "Sem Curiosidades!" : "Parabéns! 🎉"}
                  </h2>
                  
                  {curiosities.length === 0 ? (
                    <p className="text-xl text-white/90 mb-8">
                      Adicione algumas curiosidades no painel de administração para começar!
                    </p>
                  ) : (
                    <div className="space-y-4 text-xl text-white/90 mb-8">
                      <p className="font-semibold text-green-400 glow-text">
                        "Educação é prevenção."
                      </p>
                      <p className="font-semibold text-blue-400 glow-text">
                        "Respeito é proteção."
                      </p>
                      <p className="font-semibold text-purple-400 glow-text">
                        "Informação é poder."
                      </p>
                    </div>
                  )}
                  
                  <Button
                    onClick={handleReset}
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold px-8 py-3 rounded-full animate-pulse-glow"
                  >
                    {curiosities.length === 0 ? "Adicionar Curiosidades" : "Recomeçar Jornada"}
                  </Button>
                </motion.div>
              </motion.div>
            ) : (
              <CuriosityCard
                key={curiosities[currentIndex]?.id || currentIndex}
                curiosity={curiosities[currentIndex]}
                onNext={handleNext}
                isLast={currentIndex === curiosities.length - 1}
              />
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
    </div>
  );
}

export default App;