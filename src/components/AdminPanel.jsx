import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Edit, Trash2, Save, Undo as Cancel } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import PasswordPrompt from './PasswordPrompt'; // Importar o componente de senha

const AdminPanel = ({ curiosities, onAdd, onEdit, onDelete, onClose }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ text: '', isTrue: true, revelation: '' });
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false); // Estado para controlar o prompt de senha
  const [actionToPerform, setActionToPerform] = useState(null); // Armazena a ação a ser executada após a senha

  useEffect(() => {
    if (editingId) {
      const currentCuriosity = curiosities.find(c => c.id === editingId);
      if (currentCuriosity) {
        setFormData({ 
          text: currentCuriosity.text, 
          isTrue: currentCuriosity.isTrue,
          revelation: currentCuriosity.revelation || (currentCuriosity.isTrue ? "Isso mesmo! " : "Na verdade... ")
        });
      }
    } else {
      setFormData(prev => ({ ...prev, revelation: prev.isTrue ? "Isso mesmo! " : "Na verdade... " }));
    }
  }, [editingId, curiosities]);

  useEffect(() => {
    if (!editingId) { 
        setFormData(prev => ({
            ...prev,
            revelation: prev.isTrue ? "Isso mesmo! " : "Na verdade... "
        }));
    }
  }, [formData.isTrue, editingId]);

  const handleAuthenticate = () => {
    setShowPasswordPrompt(false);
    if (actionToPerform) {
      actionToPerform();
      setActionToPerform(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.text.trim() || !formData.revelation.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos: texto da curiosidade e revelação.",
        variant: "destructive"
      });
      return;
    }

    // Armazena a ação e exibe o prompt de senha
    setActionToPerform(() => async () => {
      if (editingId) {
        onEdit(editingId, formData);
        toast({
          title: "Sucesso!",
          description: "Curiosidade editada com sucesso!"
        });
        setEditingId(null);
      } else {
        onAdd(formData);
        toast({
          title: "Sucesso!",
          description: "Nova curiosidade adicionada!"
        });
        setShowAddForm(false);
      }
      setFormData({ text: '', isTrue: true, revelation: 'Isso mesmo! ' });

      // Após salvar localmente, tentar atualizar no GitHub automaticamente
      try {
        const updatedCuriosities = editingId 
          ? curiosities.map(c => c.id === editingId ? { ...c, ...formData } : c)
          : [...curiosities, { id: Date.now(), ...formData }];

        const response = await fetch('/.netlify/functions/update-github', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            curiosities: updatedCuriosities,
            password: 'admin123'
          })
        });

        const result = await response.json();

        if (response.ok) {
          toast({
            title: "GitHub Atualizado!",
            description: "As alterações foram enviadas para o GitHub automaticamente.",
          });
        } else {
          throw new Error(result.error || 'Erro desconhecido');
        }
      } catch (error) {
        console.error('Erro ao atualizar GitHub:', error);
        toast({
          title: "Aviso",
          description: "Alteração salva localmente, mas não foi possível atualizar o GitHub automaticamente.",
          variant: "destructive"
        });
      }
    });
    setShowPasswordPrompt(true);
  };

  const handleEdit = (curiosity) => {
    setEditingId(curiosity.id);
    setShowAddForm(false); 
  };

  const handleDelete = async (id) => {
    // Armazena a ação e exibe o prompt de senha
    setActionToPerform(() => async () => {
      onDelete(id);
      toast({
        title: "Removido",
        description: "Curiosidade removida com sucesso!"
      });

      // Após deletar localmente, tentar atualizar no GitHub automaticamente
      try {
        const updatedCuriosities = curiosities.filter(c => c.id !== id);

        const response = await fetch('/.netlify/functions/update-github', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            curiosities: updatedCuriosities,
            password: 'admin123'
          })
        });

        const result = await response.json();

        if (response.ok) {
          toast({
            title: "GitHub Atualizado!",
            description: "A remoção foi enviada para o GitHub automaticamente.",
          });
        } else {
          throw new Error(result.error || 'Erro desconhecido');
        }
      } catch (error) {
        console.error('Erro ao atualizar GitHub:', error);
        toast({
          title: "Aviso",
          description: "Remoção feita localmente, mas não foi possível atualizar o GitHub automaticamente.",
          variant: "destructive"
        });
      }
    });
    setShowPasswordPrompt(true);
  };

  const handleCancel = () => {
    setFormData({ text: '', isTrue: true, revelation: 'Isso mesmo! ' });
    setEditingId(null);
    setShowAddForm(false);
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        <div className="p-6 border-b border-white/20 flex justify-between items-center flex-shrink-0">
          <h2 className="text-2xl font-bold text-white">Gerenciar Curiosidades</h2>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto flex-grow">
          <div className="mb-6">
            {!showAddForm && !editingId && (
              <Button
                onClick={() => {
                  setShowAddForm(true);
                  setFormData({ text: '', isTrue: true, revelation: 'Isso mesmo! ' }); 
                }}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Nova Curiosidade
              </Button>
            )}

            {(showAddForm || editingId) && (
              <motion.form
                onSubmit={handleSubmit}
                className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3 className="text-lg font-semibold text-white mb-4">
                  {editingId ? 'Editar Curiosidade' : 'Nova Curiosidade'}
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/80 mb-2 text-sm">Texto da Curiosidade</label>
                    <textarea
                      value={formData.text}
                      onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                      className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                      rows="3"
                      placeholder="Ex: O uso de dois preservativos aumenta a proteção."
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 mb-2 text-sm">Revelação Personalizada</label>
                    <textarea
                      value={formData.revelation}
                      onChange={(e) => setFormData({ ...formData, revelation: e.target.value })}
                      className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                      rows="4"
                      placeholder="Ex: Na verdade, usar dois preservativos pode causar atrito e aumentar o risco de rompimento."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/80 mb-2 text-sm">Classificação</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 text-white cursor-pointer p-2 rounded-md hover:bg-white/10 transition-colors">
                        <input
                          type="radio"
                          name="isTrue"
                          checked={formData.isTrue === true}
                          onChange={() => setFormData({ ...formData, isTrue: true })}
                          className="form-radio h-4 w-4 text-green-500 bg-white/20 border-white/30 focus:ring-green-500"
                        />
                        <span className="text-green-400">Verdade</span>
                      </label>
                      <label className="flex items-center gap-2 text-white cursor-pointer p-2 rounded-md hover:bg-white/10 transition-colors">
                        <input
                          type="radio"
                          name="isTrue"
                          checked={formData.isTrue === false}
                          onChange={() => setFormData({ ...formData, isTrue: false })}
                          className="form-radio h-4 w-4 text-red-500 bg-white/20 border-white/30 focus:ring-red-500"
                        />
                        <span className="text-red-400">Mito</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 pt-2">
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {editingId ? 'Salvar Alterações' : 'Adicionar Curiosidade'}
                    </Button>
                    <Button
                      type="button"
                      onClick={handleCancel}
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <Cancel className="w-4 h-4 mr-2" />
                      Cancelar
                    </Button>
                  </div>
                </div>
              </motion.form>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-2">Curiosidades Existentes ({curiosities.length})</h3>
            {curiosities.length === 0 && (
              <p className="text-white/70 text-center py-4">Nenhuma curiosidade cadastrada ainda.</p>
            )}
            {curiosities.map((curiosity, index) => (
              <motion.div
                key={curiosity.id}
                className="bg-white/5 rounded-2xl p-4 border border-white/10"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <p className="text-white/90 mb-1 font-medium">{curiosity.text}</p>
                    <p className="text-white/70 text-sm mb-2 italic">Revelação: {curiosity.revelation}</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      curiosity.isTrue 
                        ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                        : 'bg-red-500/20 text-red-300 border border-red-500/30'
                    }`}>
                      {curiosity.isTrue ? 'Verdade' : 'Mito'}
                    </span>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
                    <Button
                      onClick={() => handleEdit(curiosity)}
                      size="sm"
                      variant="outline"
                      className="border-blue-500/30 text-blue-300 hover:bg-blue-500/10"
                    >
                      <Edit className="w-3.5 h-3.5 mr-1 sm:mr-0" /> <span className="sm:hidden">Editar</span>
                    </Button>
                    <Button
                      onClick={() => handleDelete(curiosity.id)}
                      size="sm"
                      variant="outline"
                      className="border-red-500/30 text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1 sm:mr-0" /> <span className="sm:hidden">Excluir</span>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {showPasswordPrompt && (
          <PasswordPrompt
            onAuthenticate={handleAuthenticate}
            onClose={() => setShowPasswordPrompt(false)}
          />
        )}
      </motion.div>
    </motion.div>
  );
};

export default AdminPanel;

