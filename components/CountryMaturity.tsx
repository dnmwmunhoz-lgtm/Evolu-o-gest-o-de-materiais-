import React, { useState, useMemo } from 'react';
import { countries } from '../data/countries';
import type { GlossaryItem, CountryAnswers } from '../types';
import { GlossaryForm } from './GlossaryForm';

interface CountryMaturityProps {
  practices: GlossaryItem[];
  answers: CountryAnswers;
  onAnswerChange: (countryCode: string, practiceId: string | number, answer: boolean) => void;
  onSavePractice: (item: GlossaryItem) => void;
  onDeletePractice: (id: string | number) => void;
  allItems: GlossaryItem[];
}

export const CountryMaturity: React.FC<CountryMaturityProps> = ({ practices, answers, onAnswerChange, onSavePractice, onDeletePractice, allItems }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GlossaryItem | null>(null);

  const totalWeight = useMemo(() => {
    return practices.reduce((sum, p) => sum + (p.weight || 0), 0);
  }, [practices]);

  const handleAddNew = () => {
    setEditingItem(null); 
    setIsModalOpen(true);
  };

  const handleEdit = (item: GlossaryItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };
  
  const handleSaveAndClose = (item: GlossaryItem) => {
    const itemToSave = { ...item, type: 'practice' as 'practice' };
    onSavePractice(itemToSave);
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handlePriorityChange = (item: GlossaryItem, newPriority: number) => {
    onSavePractice({ ...item, priority: newPriority });
  };
  
  const sortedPractices = useMemo(() => {
    return [...practices].sort((a, b) => {
        if (a.level !== b.level) {
            return a.level - b.level;
        }
        return (a.priority || 0) - (b.priority || 0);
    });
  }, [practices]);

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Diagnóstico de Maturidade por País</h2>
            <p className="text-gray-600">
              Avalie cada prática, edite os pesos e prioridades para customizar o roadmap. A soma dos pesos deve ser 100%.
            </p>
          </div>
          <button
            onClick={handleAddNew}
            className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out shadow-sm flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Adicionar Prática
          </button>
        </div>
      <div className="border border-gray-200 rounded-lg overflow-auto" style={{ maxHeight: '70vh' }}>
        <table className="min-w-full divide-y divide-gray-200 table-fixed">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th scope="col" className="px-2 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider bg-gray-100" style={{ width: '5%' }}>
                Nível
              </th>
               <th scope="col" className="px-2 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider bg-gray-100" style={{ width: '5%' }}>
                Prioridade
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider bg-gray-100" style={{ width: '25%' }}>
                Prática de Diagnóstico
              </th>
               <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider bg-gray-100" style={{ width: '15%' }}>
                Resumo (Gráfico)
              </th>
               <th scope="col" className="px-2 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider bg-gray-100" style={{ width: '5%' }}>
                Peso (%)
              </th>
              {countries.map(country => (
                <th key={country.code} scope="col" className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap bg-gray-100" style={{ width: '8%' }}>
                  <div className="flex items-center justify-center">
                     <country.Icon className="w-5 h-5 mr-2 rounded-full" />
                     <span>{country.name}</span>
                  </div>
                </th>
              ))}
              <th scope="col" className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider bg-gray-100" style={{ width: '10%' }}>Controles</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedPractices.map((practice) => (
              <tr key={practice.id}>
                <td className="px-2 py-4 whitespace-nowrap text-center">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800`}>
                    {practice.level}
                  </span>
                </td>
                 <td className="px-2 py-4 whitespace-nowrap text-center text-sm">
                    <input 
                      type="number"
                      value={practice.priority || ''}
                      onBlur={(e) => handlePriorityChange(practice, parseInt(e.target.value, 10) || 0)}
                      onChange={(e) => { /* State is handled on blur to avoid re-renders on every key press */ }}
                      className="w-16 text-center border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </td>
                <td className="px-4 py-4 whitespace-normal text-sm font-medium text-gray-800">
                  {practice.practice}
                </td>
                 <td className="px-4 py-4 whitespace-normal text-sm text-gray-600 italic">
                  {practice.shortPractice}
                </td>
                <td className="px-2 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-800">
                   {practice.weight || 0}
                </td>
                {countries.map(country => (
                  <td key={country.code} className="px-4 py-4 whitespace-nowrap text-center">
                    <div className="flex justify-center items-center space-x-3">
                       <label className="flex items-center cursor-pointer p-1 rounded-md hover:bg-green-50">
                          <input
                            type="radio"
                            name={`q-${practice.id}-${country.code}`}
                            checked={answers[country.code]?.[practice.id] === true}
                            onChange={() => onAnswerChange(country.code, practice.id, true)}
                            className="form-radio h-4 w-4 text-green-600 transition duration-150 ease-in-out focus:ring-green-500"
                          />
                          <span className="ml-1.5 text-sm text-green-700 font-medium">Sim</span>
                      </label>
                       <label className="flex items-center cursor-pointer p-1 rounded-md hover:bg-red-50">
                          <input
                            type="radio"
                            name={`q-${practice.id}-${country.code}`}
                            checked={answers[country.code]?.[practice.id] === false || answers[country.code]?.[practice.id] === undefined}
                            onChange={() => onAnswerChange(country.code, practice.id, false)}
                             className="form-radio h-4 w-4 text-red-600 transition duration-150 ease-in-out focus:ring-red-500"
                          />
                           <span className="ml-1.5 text-sm text-red-700 font-medium">Não</span>
                      </label>
                    </div>
                  </td>
                ))}
                 <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleEdit(practice)} className="text-indigo-600 hover:text-indigo-900 mr-3 font-semibold">Editar</button>
                    <button onClick={() => onDeletePractice(practice.id)} className="text-red-600 hover:text-red-900 font-semibold">Excluir</button>
                 </td>
              </tr>
            ))}
          </tbody>
           <tfoot className="bg-gray-200 font-bold sticky bottom-0">
              <tr>
                <td colSpan={5} className="px-4 py-3 text-right text-sm text-gray-700">Total Pesos:</td>
                <td className={`px-2 py-3 text-center text-sm ${totalWeight !== 100 ? 'text-red-600 animate-pulse' : 'text-green-700'}`}>
                    {totalWeight}%
                </td>
                <td colSpan={countries.length + 1}>
                    {totalWeight !== 100 && <span className="text-xs text-red-500 font-normal italic ml-4">A soma dos pesos deve ser 100%.</span>}
                </td>
              </tr>
           </tfoot>
        </table>
      </div>
       {isModalOpen && (
          <GlossaryForm
            item={editingItem}
            allItems={allItems}
            onSave={handleSaveAndClose}
            onCancel={() => setIsModalOpen(false)}
          />
        )}
    </div>
  );
};