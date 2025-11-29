
import React, { useState, Fragment, useMemo } from 'react';
import type { GlossaryItem, Acronym, Action } from '../types';
import { GlossaryForm } from './GlossaryForm';
import { countries } from '../data/countries';

interface GlossaryProps {
    items: GlossaryItem[];
    acronyms: Acronym[];
    onSave: (item: GlossaryItem) => void;
    onDelete: (id: number | string) => void;
    onAddAction: (practiceId: number | string, newAction: Omit<Action, 'id'>) => void;
    onUpdateAction: (practiceId: number | string, updatedAction: Action) => void;
    onDeleteAction: (practiceId: number | string, actionId: number | string) => void;
}


// --- SUB-COMPONENTS ---

const ActionItem: React.FC<{
    action: Action;
    practiceId: number | string;
    onUpdate: (practiceId: number | string, action: Action) => void;
    onDelete: (practiceId: number | string, actionId: number | string) => void;
}> = ({ action, practiceId, onUpdate, onDelete }) => {
    
    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onUpdate(practiceId, { ...action, status: e.target.value as Action['status'] });
    };

    const statusColorClass = {
        'Pendente': 'bg-red-100 text-red-800',
        'Em Andamento': 'bg-yellow-100 text-yellow-800',
        'Concluído': 'bg-green-100 text-green-800'
    };

    return (
        <tr className="bg-slate-50 hover:bg-slate-100 text-sm">
            <td className="px-3 py-2 text-gray-800">
                {action.description}
            </td>
            <td className="px-3 py-2 text-gray-700">{action.responsavel}</td>
            <td className="px-3 py-2 text-center text-gray-700">{action.ano}</td>
            <td className="px-3 py-2">
                <select value={action.status} onChange={handleStatusChange} className={`w-full text-xs p-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${statusColorClass[action.status]}`}>
                    <option value="Pendente">Pendente</option>
                    <option value="Em Andamento">Em Andamento</option>
                    <option value="Concluído">Concluído</option>
                </select>
            </td>
            <td className="px-3 py-2 text-right">
                <button onClick={() => onDelete(practiceId, action.id)} className="text-gray-400 hover:text-red-600 p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </td>
        </tr>
    );
};


const ActionPanel: React.FC<{
    item: GlossaryItem;
    onAddAction: (practiceId: number | string, newAction: Omit<Action, 'id'>) => void;
    onUpdateAction: (practiceId: number | string, updatedAction: Action) => void;
    onDeleteAction: (practiceId: number | string, actionId: number | string) => void;
}> = ({ item, onAddAction, onUpdateAction, onDeleteAction }) => {
    const [description, setDescription] = useState('');
    const [year, setYear] = useState<'2025' | '2026'>('2025');
    const [responsavel, setResponsavel] = useState('');
    const [country, setCountry] = useState(countries[0].code);

    const handleAdd = () => {
        if (description.trim()) {
            onAddAction(item.id, { description: description.trim(), ano: year, status: 'Pendente', responsavel: responsavel.trim(), country: country });
            setDescription(''); setResponsavel(''); setYear('2025');
        }
    };
    
    const actionsByCountry = useMemo(() => {
        const grouped: { [key: string]: Action[] } = {};
        (item.actions || []).forEach(action => {
            if (!grouped[action.country]) {
                grouped[action.country] = [];
            }
            grouped[action.country].push(action);
        });
        return grouped;
    }, [item.actions]);

    return (
        <div className="bg-slate-100 p-4 space-y-4 border-l-4 border-blue-200">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end p-3 border rounded-lg bg-white">
                <div className="md:col-span-2"><label className="text-xs font-medium text-gray-600">Nova Ação</label><input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descrição da nova ação..." className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm" /></div>
                <div><label className="text-xs font-medium text-gray-600">País</label><select value={country} onChange={(e) => setCountry(e.target.value)} className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm bg-white">{countries.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}</select></div>
                <div><label className="text-xs font-medium text-gray-600">Responsável</label><input type="text" value={responsavel} onChange={(e) => setResponsavel(e.target.value)} placeholder="Nome" className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm" /></div>
                <div><label className="text-xs font-medium text-gray-600">Ano</label><select value={year} onChange={(e) => setYear(e.target.value as '2025' | '2026')} className="w-full mt-1 bg-white text-sm border-gray-300 rounded-md shadow-sm py-1.5"><option value="2025">2025</option><option value="2026">2026</option></select></div>
                <button onClick={handleAdd} className="bg-blue-500 text-white font-bold py-1.5 px-4 rounded-md hover:bg-blue-600 transition duration-300 text-sm h-9">Adicionar</button>
            </div>
            
            <div className="space-y-4">
              {item.actions && item.actions.length > 0 ? (
                Object.keys(actionsByCountry).map((countryCode) => {
                  const actions = actionsByCountry[countryCode];
                  const country = countries.find(c => c.code === countryCode);
                  if (!country || actions.length === 0) return null;
                  return (
                    <div key={countryCode}>
                      <div className="flex items-center mb-2">
                        <country.Icon className="w-5 h-5 rounded-full mr-2"/>
                        <h4 className="font-semibold text-gray-700">{country.name}</h4>
                      </div>
                      <table className="w-full text-sm">
                          <thead className="bg-slate-200 text-xs text-gray-600 uppercase">
                              <tr>
                                  <th className="px-3 py-2 text-left w-[45%]">Ação</th>
                                  <th className="px-3 py-2 text-left w-[20%]">Responsável</th>
                                  <th className="px-3 py-2 text-center w-[10%]">Ano</th>
                                  <th className="px-3 py-2 text-left w-[15%]">Status</th>
                                  <th className="px-3 py-2 text-right w-[10%]"></th>
                              </tr>
                          </thead>
                          <tbody>
                            {actions.map(action => (
                              <ActionItem 
                                key={action.id} 
                                action={action} 
                                practiceId={item.id} 
                                onUpdate={onUpdateAction} 
                                onDelete={onDeleteAction}
                              />
                            ))}
                          </tbody>
                      </table>
                    </div>
                  )
                })
              ) : (
                <p className="text-xs text-gray-500 italic p-2 text-center">Nenhuma ação definida. Adicione uma acima.</p>
              )}
            </div>
        </div>
    );
};


export const Glossary: React.FC<GlossaryProps> = ({ items, acronyms, onSave, onDelete, onAddAction, onUpdateAction, onDeleteAction }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<GlossaryItem | null>(null);
    const [expandedRowId, setExpandedRowId] = useState<string | number | null>(null);

    const handleAddNew = () => {
      setEditingItem(null);
      setIsModalOpen(true);
    };
  
    const handleEdit = (item: GlossaryItem) => {
      setEditingItem(item);
      setIsModalOpen(true);
    };
    
    const handleSaveAndClose = (item: GlossaryItem) => {
      onSave(item);
      setIsModalOpen(false);
    };
  
    const { practices, risksMap } = useMemo(() => {
        const practices = items.filter(item => item.type === 'practice').sort((a, b) => a.level - b.level || a.practice.localeCompare(b.practice));
        const risks = items.filter(item => item.type === 'risk');
        const risksMap = new Map(risks.map(r => [r.practice, r]));
        return { practices, risksMap };
    }, [items]);

    return (
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Plano de Ação e Riscos</h2>
            <p className="text-gray-600">
              Detalhe, planeje e acompanhe cada iniciativa da sua jornada de maturidade.
            </p>
          </div>
          <button
            onClick={handleAddNew}
            className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out shadow-sm flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Adicionar Prática ou Risco
          </button>
        </div>
  
        <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Plano de Ação de Práticas e Mitigação de Riscos</h3>
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="w-8"></th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-[20%]">Prática</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-[20%]">Risco Associado</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-[15%]">Progresso Geral</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Planejamento</th>
                                <th scope="col" className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Controles</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {practices.map((item) => {
                                const totalActions = item.actions?.length || 0;
                                const completedActions = item.actions?.filter(a => a.status === 'Concluído').length || 0;
                                const progress = totalActions > 0 ? Math.round((completedActions / totalActions) * 100) : 0;
                                const isExpanded = expandedRowId === item.id;
                                const riskItem = item.riskAssociated ? risksMap.get(item.riskAssociated) : null;

                                return (
                                    <Fragment key={item.id}>
                                        <tr className="hover:bg-gray-50 transition-colors duration-200 group">
                                            <td className="px-2 py-4 align-top">
                                                <button
                                                    onClick={() => setExpandedRowId(isExpanded ? null : item.id)}
                                                    className="text-gray-400 hover:text-blue-600 p-1 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                                                    disabled={!item.actions?.length}
                                                    title="Ver/Ocultar Ações"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </td>
                                            <td className="px-4 py-4 whitespace-normal align-top">
                                                <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600">{item.practice}</p>
                                                <p className="text-xs text-gray-500 mt-1 italic">{item.description}</p>
                                            </td>
                                            {/* FIX: Display mitigation text along with the associated risk name for better context. */}
                                            <td className="px-4 py-4 whitespace-normal align-top text-sm">
                                                {riskItem ? (
                                                   <div>
                                                     <p className="font-medium text-red-700">{riskItem.practice}</p>
                                                     <p className="text-xs text-gray-500 mt-1">{item.mitigation}</p>
                                                   </div>
                                                ) : (<span className="text-xs text-gray-400 italic">N/A</span>)}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap align-top">
                                                <div className="flex items-center">
                                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                        <div className={`${progress === 100 ? 'bg-green-600' : progress > 0 ? 'bg-yellow-500' : 'bg-red-500'} h-2.5 rounded-full`} style={{ width: `${progress}%` }}></div>
                                                    </div>
                                                    <span className="text-xs text-gray-600 ml-2 font-semibold">{progress}%</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap align-top">
                                                <div className="text-xs text-gray-600 space-y-1">
                                                    {item.dataPrevista && <div><strong>Data:</strong> {item.dataPrevista}</div>}
                                                    {item.responsavel && <div><strong>Resp:</strong> {item.responsavel}</div>}
                                                    {item.areasEnvolvidas !== undefined && <div><strong>Áreas:</strong> {item.areasEnvolvidas}</div>}
                                                    {item.investimento && <div><strong>Invest:</strong> {item.investimento}</div>}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium align-top">
                                                <button onClick={() => handleEdit(item)} className="text-indigo-600 hover:text-indigo-900 mr-3 font-semibold">Editar</button>
                                                <button onClick={() => onDelete(item.id)} className="text-red-600 hover:text-red-900 font-semibold">Excluir</button>
                                            </td>
                                        </tr>
                                        {isExpanded && (
                                            <tr>
                                                <td colSpan={6} className="p-0 border-t-0 bg-gray-50">
                                                    <ActionPanel item={item} onAddAction={onAddAction} onUpdateAction={onUpdateAction} onDeleteAction={onDeleteAction} />
                                                </td>
                                            </tr>
                                        )}
                                    </Fragment>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        
         <div className="mt-10">
          <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b-2 border-gray-200 pb-2">Siglas e Acrônimos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {acronyms.map((acronym) => (
                  <div key={acronym.term} className="bg-gray-50 p-3 rounded-lg">
                      <p className="font-bold text-gray-900">{acronym.term}</p>
                      <p className="text-sm text-gray-600">{acronym.definition}</p>
                  </div>
              ))}
          </div>
        </div>
  
        {isModalOpen && (
          <GlossaryForm
            item={editingItem}
            allItems={items}
            onSave={handleSaveAndClose}
            onCancel={() => setIsModalOpen(false)}
          />
        )}
      </div>
    );
};
