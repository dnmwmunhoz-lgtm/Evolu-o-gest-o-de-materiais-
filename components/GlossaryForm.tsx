import React, { useState, useEffect, useMemo } from 'react';
import type { GlossaryItem } from '../types';

interface GlossaryFormProps {
  item: Partial<GlossaryItem> | null;
  onSave: (item: GlossaryItem) => void;
  onCancel: () => void;
  allItems: GlossaryItem[];
}

const getEmptyItem = (type: 'practice' | 'risk'): Partial<GlossaryItem> => ({
    practice: '',
    type: type,
    level: 1,
    priority: 1,
    description: '',
    shortPractice: '',
    weight: 0,
    riskAssociated: '',
    mitigation: '',
    implementation: '',
    goalPossible: '',
    y: type === 'practice' ? 500 : 550,
    dataPrevista: '',
    areasEnvolvidas: 0,
    investimento: type === 'practice' ? 'Baixo' : 'Não se aplica',
    responsavel: '',
    actions: type === 'practice' ? [] : undefined,
});


export const GlossaryForm: React.FC<GlossaryFormProps> = ({ item, onSave, onCancel, allItems }) => {
  const [formData, setFormData] = useState<Partial<GlossaryItem>>(() => item ? { ...item } : getEmptyItem('practice'));

  useEffect(() => {
    if (item) {
        setFormData({ ...item });
    } else {
        setFormData(getEmptyItem('practice'));
    }
  }, [item]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    const isNumberField = ['level', 'x', 'y', 'areasEnvolvidas', 'weight', 'priority'].includes(name);
    const processedValue = isNumberField ? (value === '' ? undefined : parseFloat(value)) : value;

    setFormData(prev => {
        if (name === 'type') {
            const newType = value as 'practice' | 'risk';
            // Start with a clean slate for the new type, but preserve common fields
            const newDefaults = getEmptyItem(newType);
            return {
                ...newDefaults,
                id: prev.id,
                practice: prev.practice,
                description: prev.description,
                level: prev.level,
                type: newType,
            };
        }
        return { ...prev, [name]: processedValue };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.practice) {
        alert('O nome da prática/risco é obrigatório.');
        return;
    }
    
    const baseItem = getEmptyItem(formData.type || 'practice');
    
    const finalData: GlossaryItem = {
      ...baseItem,
      ...formData,
      id: formData.id || `new-${Date.now()}`,
    } as GlossaryItem;

    onSave(finalData);
  };
  
  const isRisk = formData.type === 'risk';
  const availableRisks = useMemo(() => allItems.filter(i => i.type === 'risk'), [allItems]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity duration-300" style={{'animation': 'fadeIn 0.3s ease-out'}}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto transform transition-all duration-300 scale-95" style={{'animation': 'scaleUp 0.3s ease-out forwards'}}>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="flex justify-between items-start">
              <h2 className="text-2xl font-bold text-gray-800 ">{item && item.id ? 'Editar Item' : 'Adicionar Novo Item'}</h2>
               <button type="button" onClick={onCancel} className="p-2 text-gray-400 hover:text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
               </button>
            </div>
          
          {/* General Info */}
          <div className="p-4 border rounded-lg bg-gray-50/50">
             <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Informações Gerais</h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                <div className="md:col-span-3">
                    <label htmlFor="practice" className="block text-sm font-medium text-gray-700">Nome da Prática / Risco</label>
                    <input type="text" name="practice" id="practice" value={formData.practice || ''} onChange={handleChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                </div>
                 <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700">Tipo</label>
                    <select name="type" id="type" value={formData.type || 'practice'} onChange={handleChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white">
                        <option value="practice">Prática</option>
                        <option value="risk">Risco</option>
                    </select>
                </div>
                 <div className="md:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descrição</label>
                    <textarea name="description" id="description" value={formData.description || ''} onChange={handleChange} rows={1} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                </div>
             </div>
          </div>
          
          {/* --- Practice-Specific Section --- */}
          {!isRisk && (
            <>
                <div className="p-4 border rounded-lg bg-gray-50/50">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Configuração do Diagnóstico e Gráfico</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                       <div>
                          <label htmlFor="shortPractice" className="block text-sm font-medium text-gray-700">Resumo (Gráfico)</label>
                          <input type="text" name="shortPractice" id="shortPractice" value={formData.shortPractice || ''} onChange={handleChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" placeholder="Texto curto para o gráfico" />
                       </div>
                        <div>
                           <label htmlFor="weight" className="block text-sm font-medium text-gray-700">Peso na Maturidade (%)</label>
                           <input type="number" name="weight" id="weight" value={formData.weight ?? ''} onChange={handleChange} min="0" max="100" className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                       </div>
                       <div>
                           <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Prioridade no Nível</label>
                           <input type="number" name="priority" id="priority" value={formData.priority ?? ''} onChange={handleChange} min="1" className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" placeholder="Ex: 1, 2, 3..." />
                       </div>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mt-4">
                        <div>
                           <label htmlFor="level" className="block text-sm font-medium text-gray-700">Nível de Maturidade</label>
                           <input type="number" name="level" id="level" value={formData.level ?? ''} onChange={handleChange} min="1" max="5" step="0.1" className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                       </div>
                       <div>
                           <label htmlFor="y" className="block text-sm font-medium text-gray-700">Posição Y (Gráfico)</label>
                           <input type="number" name="y" id="y" value={formData.y ?? ''} onChange={handleChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                       </div>
                    </div>
                </div>

                <div className="p-4 border rounded-lg bg-gray-50/50">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Detalhes Estratégicos da Prática</h3>
                     <div className="space-y-4">
                        <div>
                            <label htmlFor="riskAssociated" className="block text-sm font-medium text-gray-700">Risco Associado (Mitigado por esta prática)</label>
                             <select name="riskAssociated" id="riskAssociated" value={formData.riskAssociated || ''} onChange={handleChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white">
                                <option value="">Nenhum Risco Associado</option>
                                {availableRisks.map(r => <option key={r.id} value={r.practice}>{r.practice}</option>)}
                            </select>
                        </div>
                        <div>
                           <label htmlFor="mitigation" className="block text-sm font-medium text-gray-700">Como esta Prática Mitiga o Risco</label>
                           <textarea name="mitigation" id="mitigation" value={formData.mitigation || ''} onChange={handleChange} rows={2} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div>
                            <label htmlFor="implementation" className="block text-sm font-medium text-gray-700">Como Implementar</label>
                            <textarea name="implementation" id="implementation" value={formData.implementation || ''} onChange={handleChange} rows={3} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div>
                            <label htmlFor="goalPossible" className="block text-sm font-medium text-gray-700">Meta Aplicável / Benchmark</label>
                            <textarea name="goalPossible" id="goalPossible" value={formData.goalPossible || ''} onChange={handleChange} rows={3} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                     </div>
                </div>
                <div className="p-4 border rounded-lg bg-gray-50/50">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Planejamento Geral da Prática</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
                        <div>
                            <label htmlFor="dataPrevista" className="block text-sm font-medium text-gray-700">Data Prevista</label>
                            <input type="date" name="dataPrevista" id="dataPrevista" value={formData.dataPrevista || ''} onChange={handleChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                        </div>
                        <div>
                          <label htmlFor="responsavel" className="block text-sm font-medium text-gray-700">Responsável</label>
                          <input type="text" name="responsavel" id="responsavel" value={formData.responsavel || ''} onChange={handleChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                        </div>
                        <div>
                            <label htmlFor="areasEnvolvidas" className="block text-sm font-medium text-gray-700">Áreas Envolvidas (Qtd)</label>
                            <input type="number" name="areasEnvolvidas" id="areasEnvolvidas" value={formData.areasEnvolvidas ?? ''} onChange={handleChange} min="0" className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                        </div>
                        <div>
                            <label htmlFor="investimento" className="block text-sm font-medium text-gray-700">Investimento</label>
                            <select name="investimento" id="investimento" value={formData.investimento || 'Baixo'} onChange={handleChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white">
                                <option value="Não se aplica">Não se aplica</option>
                                <option value="Baixo">Baixo</option>
                                <option value="Médio">Médio</option>
                                <option value="Alto">Alto</option>
                            </select>
                        </div>
                    </div>
                </div>
            </>
            )}


          {/* Botões */}
          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 shadow-sm transition-colors"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};