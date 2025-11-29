import React, { useState, useMemo } from 'react';
import { MaturityLevelCard } from './components/MaturityLevelCard';
import { RoadmapTimeline } from './components/RoadmapTimeline';
import { Glossary } from './components/Glossary';
import { CountryMaturity } from './components/CountryMaturity';
import { BusinessRules } from './components/BusinessRules';
import { glossaryData as initialGlossaryData, acronymsData as initialAcronymsData } from './data/glossaryData';
import type { GlossaryItem, Acronym, MaturityLevel, Action, CountryAnswers, CountryMaturityScore } from './types';
import { countries } from './data/countries';

const App: React.FC = () => {
  const [view, setView] = useState<'cards' | 'timeline' | 'glossary' | 'diagnosis' | 'rules'>('timeline');
  const [glossaryItems, setGlossaryItems] = useState<GlossaryItem[]>(initialGlossaryData);
  const [acronyms] = useState<Acronym[]>(initialAcronymsData);
  const [countryAnswers, setCountryAnswers] = useState<CountryAnswers>({});

  const diagnosisPractices = useMemo(() => glossaryItems.filter(item => item.type === 'practice').sort((a,b) => a.level - b.level || (a.priority || 0) - (b.priority || 0)), [glossaryItems]);

  const handleAnswerChange = (countryCode: string, practiceId: string | number, answer: boolean) => {
    setCountryAnswers(prev => ({
      ...prev,
      [countryCode]: {
        ...prev[countryCode],
        [practiceId]: answer,
      }
    }));
  };

  const itemsWithDynamicX = useMemo(() => {
    const practices = glossaryItems.filter(item => item.type === 'practice');
    const risks = glossaryItems.filter(item => item.type === 'risk');
    const practicesByLevel: { [key: number]: GlossaryItem[] } = {};

    practices.forEach(p => {
        const level = Math.floor(p.level);
        if (!practicesByLevel[level]) practicesByLevel[level] = [];
        practicesByLevel[level].push(p);
    });

    const levelXBounds: { [key: number]: { start: number, end: number } } = {
        1: { start: 50, end: 250 },
        2: { start: 280, end: 500 },
        3: { start: 530, end: 750 },
        4: { start: 780, end: 1000 },
        5: { start: 1030, end: 1250 },
    };
    
    const riskXMap: { [key: string]: number } = {};

    const positionedPractices = Object.values(practicesByLevel).flatMap(levelPractices => {
        const sorted = levelPractices.sort((a, b) => (a.priority || 0) - (b.priority || 0));
        const zoneWidth = levelXBounds[Math.floor(sorted[0].level)].end - levelXBounds[Math.floor(sorted[0].level)].start;
        const segmentWidth = zoneWidth / sorted.length;

        return sorted.map((p, index) => {
            const newX = levelXBounds[Math.floor(p.level)].start + (segmentWidth * index) + (segmentWidth / 2);
            if(p.riskAssociated) {
              riskXMap[p.riskAssociated] = newX;
            }
            return { ...p, x: newX };
        });
    });

    const positionedRisks = risks.map(r => {
      const practiceX = riskXMap[r.practice] || r.x;
      return {...r, x: practiceX ? practiceX + 15 : r.x };
    })


    return [...positionedPractices, ...positionedRisks];
  }, [glossaryItems]);

  const countryMaturityScores = useMemo(() => {
    const scores: { [countryCode: string]: CountryMaturityScore } = {};
    const practices = glossaryItems.filter(item => item.type === 'practice' && typeof item.weight === 'number' && item.weight > 0);

    const totalWeightByLevel: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    practices.forEach(p => {
        const level = Math.floor(p.level);
        if (totalWeightByLevel[level] !== undefined && p.weight) {
            totalWeightByLevel[level] += p.weight;
        }
    });
    
    countries.forEach(country => {
        const code = country.code;
        const answers = countryAnswers[code] || {};

        const scoreByLevel: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        practices.forEach(p => {
            const level = Math.floor(p.level);
            if (answers[p.id] === true && scoreByLevel[level] !== undefined && p.weight) {
                scoreByLevel[level] += p.weight;
            }
        });
        
        const percentageByLevel: { [key: number]: number } = {};
        for (let i = 1; i <= 5; i++) {
            percentageByLevel[i] = totalWeightByLevel[i] > 0 ? (scoreByLevel[i] / totalWeightByLevel[i]) * 100 : 0;
        }
        
        // --- LÓGICA DE CÁLCULO REFINADA ---
        let finalScore = 1.0;
        let effectiveLevel = 1;
        const incompleteLevels: { level: number; percentage: number }[] = [];

        // 1. Regra de Prioridade (100% Concluído)
        let highestCompletedLevel = 0;
        for (let i = 5; i >= 1; i--) {
            if (percentageByLevel[i] >= 99.9) {
                highestCompletedLevel = i;
                break;
            }
        }

        if (highestCompletedLevel > 0) {
            finalScore = Math.min(highestCompletedLevel + 1, 5.0);
            effectiveLevel = highestCompletedLevel;
        } else {
            // 2. Regra do Maior Percentual de Conclusão
            let maxPercentage = -1;
            let maxLevel = 0;
            // Dê preferência para níveis mais altos em caso de empate
            for (let i = 1; i <= 5; i++) {
                if (percentageByLevel[i] >= maxPercentage) {
                    maxPercentage = percentageByLevel[i];
                    maxLevel = i;
                }
            }

            if (maxLevel > 0) {
                // Pontuação base é 1.0. O progresso no nível 1 vai de 1.0 a 2.0.
                // Progresso no nível N vai de N a N+1.
                // A fórmula é Nível + progresso_dentro_do_nível.
                finalScore = maxLevel + (maxPercentage / 100.0);
                effectiveLevel = maxLevel;
            } else {
                finalScore = 1.0;
                effectiveLevel = 1;
            }
        }
        
        // Ajuste final para garantir que o score não exceda 5.0 e a base seja 1.0
        finalScore = Math.min(finalScore, 5.0);
        finalScore = Math.max(finalScore, 1.0);

        // 3. Exibição de Níveis Incompletos
        const finalMaturityLevelForIncompleteCheck = Math.floor(effectiveLevel);

        for (let i = 1; i <= finalMaturityLevelForIncompleteCheck; i++) {
            // Se o nível base do score for, por exemplo, 3, checamos os níveis 1 e 2.
            // E se o próprio nível base não for 100%, ele também é um "débito".
            if (percentageByLevel[i] < 99.9) {
                incompleteLevels.push({ level: i, percentage: Math.round(percentageByLevel[i]) });
            }
        }
        
        // Caso especial onde a regra de 100% foi acionada.
        // Ex: 100% no Nível 3 (score 4.0), mas Nível 2 está 80%.
        if(highestCompletedLevel > 0) {
             for (let i = 1; i < highestCompletedLevel; i++) {
                if (percentageByLevel[i] < 99.9 && !incompleteLevels.some(l => l.level === i)) {
                    incompleteLevels.push({ level: i, percentage: Math.round(percentageByLevel[i]) });
                }
            }
        }
        
        scores[code] = { score: finalScore, incompleteLevels };
    });

    return scores;
}, [countryAnswers, glossaryItems]);


  const handleSaveGlossaryItem = (itemToSave: GlossaryItem) => {
    setGlossaryItems(prevItems => {
      const isExisting = prevItems.some(item => item.id === itemToSave.id);
      if (isExisting) {
        return prevItems.map(item => item.id === itemToSave.id ? itemToSave : item);
      } else {
        const newItem: GlossaryItem = { 
          ...itemToSave, 
          id: Date.now() + Math.random(),
          actions: itemToSave.type === 'practice' ? [] : undefined
        };
        return [...prevItems, newItem].sort((a, b) => a.level - b.level);
      }
    });
  };

  const handleDeleteGlossaryItem = (id: number | string) => {
    if (window.confirm('Tem certeza que deseja excluir este item? Esta ação removerá o item e todas as suas ações associadas.')) {
        setGlossaryItems(prevItems => prevItems.filter(item => item.id !== id));
    }
  };

  const handleAddAction = (practiceId: number | string, newAction: Omit<Action, 'id'>) => {
    setGlossaryItems(prev => prev.map(item => {
      if (item.id === practiceId && item.type === 'practice') {
        const fullAction: Action = { ...newAction, id: Date.now() + Math.random() };
        return { ...item, actions: [...(item.actions || []), fullAction] };
      }
      return item;
    }));
  };

  const handleUpdateAction = (practiceId: number | string, updatedAction: Action) => {
    setGlossaryItems(prev => prev.map(item => {
        if (item.id === practiceId && item.actions) {
            const updatedActions = item.actions.map(action => action.id === updatedAction.id ? updatedAction : action);
            return { ...item, actions: updatedActions };
        }
        return item;
    }));
  };
  
  const handleDeleteAction = (practiceId: number | string, actionId: number | string) => {
     setGlossaryItems(prev => prev.map(item => {
      if (item.id === practiceId && item.actions) {
        const updatedActions = item.actions.filter(action => action.id !== actionId);
        return { ...item, actions: updatedActions };
      }
      return item;
    }));
  };
  
  const maturityLevels = useMemo((): MaturityLevel[] => {
    const levelsMap: { [key: number]: { practices: GlossaryItem[], risks: string[] } } = {
        1: { practices: [], risks: [] }, 2: { practices: [], risks: [] }, 3: { practices: [], risks: [] }, 4: { practices: [], risks: [] }, 5: { practices: [], risks: [] },
    };
    glossaryItems.forEach(item => {
        const level = Math.floor(item.level);
        if (levelsMap[level]) {
            if (item.type === 'practice') {
                levelsMap[level].practices.push(item);
            } else if (item.type === 'risk') {
                 // Find the practice that mitigates this risk to associate them
                const practice = glossaryItems.find(p => p.riskAssociated === item.practice);
                if(practice && Math.floor(practice.level) === level){
                    if (!levelsMap[level].risks.includes(item.practice)) {
                        levelsMap[level].risks.push(item.practice);
                    }
                }
            }
        }
    });
     // Ensure risks associated with practices in a level are included, even if risk level is different
    glossaryItems.filter(p => p.type === 'practice').forEach(p => {
        const level = Math.floor(p.level);
        if(levelsMap[level] && p.riskAssociated){
            if (!levelsMap[level].risks.includes(p.riskAssociated)) {
                levelsMap[level].risks.push(p.riskAssociated);
            }
        }
    });


    const baseLevels: Omit<MaturityLevel, 'practices' | 'risks'>[] = [
        { level: 1, title: "Reativo / Inicial", description: "Foco exclusivo em abastecer a fábrica. A área opera para 'apagar incêndios', com processos manuais e pouca visibilidade.", kpis: ["Acuracidade de Inventário (Contagem Cíclica)", "Valor do Estoque Total (Bruto)", "Número de Rupturas (Stockouts)"], color: "bg-red-500" },
        { level: 2, title: "Padronização", description: "Início da organização. A área busca padronizar processos, implantar políticas e utilizar o sistema ERP de forma mais consistente.", kpis: ["OTIF - On Time In Full (Recebimento de Fornecedores)", "Giro de Estoque (Inventory Turnover)", "Cobertura de Estoque (Dias)", "Acuracidade de Estoque (por valor e SKU)"], color: "bg-orange-500" },
        { level: 3, title: "Integração", description: "A gestão se torna mais tática. A área começa a integrar-se com outros departamentos e a utilizar dados para tomar decisões.", kpis: ["Acuracidade da Previsão de Demanda (Forecast Accuracy)", "Estoque Obsoleto / Lento (SLOB)", "Nível de Serviço Interno (Fill Rate para Produção)", "Custo de Manutenção de Estoque (Holding Cost)"], color: "bg-yellow-500" },
        { level: 4, title: "Otimização / Colaborativo", description: "A área atua de forma proativa e colaborativa. O foco é otimizar a cadeia de suprimentos e fortalecer parcerias.", kpis: ["Cash-to-Cash Cycle Time", "Produtividade do Armazém (Movimentações / Hora)", "Otimização de Custos de Logística e Armazenagem", "Redução de Perdas e Desperdícios (Scrap)"], color: "bg-blue-500" },
        { level: 5, title: "Estratégico / Preditivo", description: "A gestão de materiais é uma vantagem competitiva. A área utiliza tecnologia de ponta para prever e se adaptar às mudanças de mercado.", kpis: ["Resiliência da Cadeia (Tempo de Recuperação de Disrupções)", "Retorno sobre o Capital de Giro em Estoque", "Agilidade da Cadeia de Suprimentos (ex: Lead Time de ponta-a-ponta)", "Nível de Automação de Processos (em %)"], color: "bg-green-600" },
    ];

    return baseLevels.map(level => ({
        ...level,
        practices: levelsMap[level.level]?.practices.sort((a,b) => a.practice.localeCompare(b.practice)) || [],
        risks: [...new Set(levelsMap[level.level]?.risks)].sort() || [],
    }));
  }, [glossaryItems]);


  const buttonBaseClasses = "px-4 py-2 text-sm font-semibold rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2";
  const activeButtonClasses = "bg-slate-700 text-white shadow-md focus:ring-slate-500";
  const inactiveButtonClasses = "bg-white text-gray-700 hover:bg-gray-200 focus:ring-gray-400";


  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      <header className="bg-white shadow-sm">
        <div className="w-full h-1.5 bg-red-600"></div>
        <div className="container mx-auto px-4 py-4 md:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-light text-gray-700 tracking-wide">
                Nossa Jornada <span className="font-bold text-blue-800">2025</span>
              </h1>
              <p className="mt-2 text-gray-500">
                Roadmap de Maturidade para a Área de Materiais
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex justify-center items-center bg-gray-200 p-1 rounded-lg shadow-inner flex-wrap">
              <button
                onClick={() => setView('timeline')}
                className={`${buttonBaseClasses} ${view === 'timeline' ? activeButtonClasses : inactiveButtonClasses}`}
                aria-pressed={view === 'timeline'}
              >
                Gráfico
              </button>
              <button
                onClick={() => setView('cards')}
                className={`${buttonBaseClasses} ml-2 ${view === 'cards' ? activeButtonClasses : inactiveButtonClasses}`}
                aria-pressed={view === 'cards'}
              >
                Cartões
              </button>
              <button
                onClick={() => setView('glossary')}
                className={`${buttonBaseClasses} ml-2 ${view === 'glossary' ? activeButtonClasses : inactiveButtonClasses}`}
                aria-pressed={view === 'glossary'}
              >
                Plano de Ação
              </button>
              <button
                onClick={() => setView('diagnosis')}
                className={`${buttonBaseClasses} ml-2 ${view === 'diagnosis' ? activeButtonClasses : inactiveButtonClasses}`}
                aria-pressed={view === 'diagnosis'}
              >
                Diagnóstico
              </button>
               <button
                onClick={() => setView('rules')}
                className={`${buttonBaseClasses} ml-2 ${view === 'rules' ? activeButtonClasses : inactiveButtonClasses}`}
                aria-pressed={view === 'rules'}
              >
                Regras de Negócio
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:px-8 md:py-12">
        {view === 'cards' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {maturityLevels.map((level) => (
              <MaturityLevelCard key={level.level} levelData={level} />
            ))}
          </div>
        )}
        {view === 'timeline' && <RoadmapTimeline items={itemsWithDynamicX} countryMaturityScores={countryMaturityScores} />}
        {view === 'glossary' && (
          <Glossary 
            items={glossaryItems}
            acronyms={acronyms}
            onSave={handleSaveGlossaryItem}
            onDelete={handleDeleteGlossaryItem}
            onAddAction={handleAddAction}
            onUpdateAction={handleUpdateAction}
            onDeleteAction={handleDeleteAction}
          />
        )}
        {view === 'diagnosis' && (
          <CountryMaturity 
            practices={diagnosisPractices}
            answers={countryAnswers}
            onAnswerChange={handleAnswerChange}
            onSavePractice={handleSaveGlossaryItem}
            onDeletePractice={handleDeleteGlossaryItem}
            allItems={glossaryItems}
          />
        )}
        {view === 'rules' && <BusinessRules />}
      </main>

      <footer className="text-center p-4 mt-8 text-gray-500 text-sm">
        <p>Desenvolvido como uma ferramenta de benchmark para gestão estratégica de materiais.</p>
      </footer>
    </div>
  );
};

export default App;