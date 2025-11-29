import React, { useMemo } from 'react';
import type { GlossaryItem, MaturityLevel } from '../types';
import { DocumentTextIcon } from './icons/DocumentTextIcon';
import { ShieldExclamationIcon } from './icons/ShieldExclamationIcon';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { countries } from '../data/countries';

interface MaturityLevelCardProps {
  levelData: MaturityLevel;
}

const CountryStatusIndicator: React.FC<{ progress: number }> = ({ progress }) => {
    const colorClass = useMemo(() => {
        if (progress === 100) return 'bg-green-500';
        if (progress > 0) return 'bg-yellow-500';
        return 'bg-red-500';
    }, [progress]);

    return <span className={`h-2 w-2 ml-1.5 rounded-full inline-block ${colorClass}`}></span>;
};


export const MaturityLevelCard: React.FC<MaturityLevelCardProps> = ({ levelData }) => {
  const { level, title, description, practices, risks, kpis, color } = levelData;

  const getProgressByCountry = (item: GlossaryItem): { [countryCode: string]: number } => {
    if (!item.actions || item.actions.length === 0) {
      return {};
    }
    
    const progressMap: { [countryCode: string]: { total: number, completed: number } } = {};

    for (const country of countries) {
        const countryActions = item.actions.filter(a => a.country === country.code);
        if (countryActions.length > 0) {
            progressMap[country.code] = { total: 0, completed: 0 };
        }
    }

    for (const action of item.actions) {
        if (progressMap[action.country]) {
            progressMap[action.country].total++;
            if (action.status === 'Concluído') {
                progressMap[action.country].completed++;
            }
        }
    }

    const finalProgress: { [countryCode: string]: number } = {};
    for (const code in progressMap) {
        const { total, completed } = progressMap[code];
        finalProgress[code] = total > 0 ? Math.round((completed / total) * 100) : 0;
    }
    
    return finalProgress;
  };
  
  const getCountriesForPractice = (item: GlossaryItem): string[] => {
      if (!item.actions) return [];
      return [...new Set(item.actions.map(a => a.country))];
  }

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-lg overflow-hidden h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      <div className={`${color} p-4 text-white`}>
        <h2 className="text-xl font-bold">Nível {level}</h2>
        <h3 className="text-2xl font-black uppercase tracking-wide">{title}</h3>
      </div>
      
      <div className="p-5 flex-grow">
        <p className="text-sm text-gray-600 italic mb-6">{description}</p>
        
        <div className="space-y-6">
          <div>
            <div className="flex items-center mb-2">
              <DocumentTextIcon className="h-6 w-6 text-gray-500 mr-2"/>
              <h4 className="font-semibold text-gray-700">Práticas de Mercado</h4>
            </div>
            <ul className="list-none text-sm text-gray-600 space-y-2">
              {practices.map((item) => {
                const progressByCountry = getProgressByCountry(item);
                const involvedCountries = getCountriesForPractice(item);
                
                return (
                 <li key={item.id}>
                    <span>{item.practice}</span>
                    {involvedCountries.length > 0 && (
                        <div className="flex items-center space-x-2 mt-1 pl-2">
                            {countries.filter(c => involvedCountries.includes(c.code)).map(country => (
                                <div key={country.code} className="flex items-center" title={`${country.name}: ${progressByCountry[country.code]}%`}>
                                    <country.Icon className="w-4 h-4 rounded-full"/>
                                    <CountryStatusIndicator progress={progressByCountry[country.code]} />
                                </div>
                            ))}
                        </div>
                    )}
                </li>
                )
              })}
            </ul>
          </div>
          
          <div>
            <div className="flex items-center mb-2">
              <ShieldExclamationIcon className="h-6 w-6 text-gray-500 mr-2"/>
              <h4 className="font-semibold text-gray-700">Riscos do Nível</h4>
            </div>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              {risks.map((item, index) => <li key={index}>{item}</li>)}
            </ul>
          </div>

          <div>
            <div className="flex items-center mb-2">
              <ChartBarIcon className="h-6 w-6 text-gray-500 mr-2"/>
              <h4 className="font-semibold text-gray-700">Indicadores (KPIs)</h4>
            </div>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              {kpis.map((item, index) => <li key={index}>{item}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};