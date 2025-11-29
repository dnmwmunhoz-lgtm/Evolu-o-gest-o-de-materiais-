import React from 'react';

export interface MaturityLevel {
  level: number;
  title: string;
  description: string;
  practices: GlossaryItem[]; // Now receives the full item for progress calculation
  risks: string[];
  kpis: string[];
  color: string;
}

export interface Action {
  id: number | string;
  description: string;
  status: 'Pendente' | 'Em Andamento' | 'Concluído';
  country: string; // e.g., 'BR', 'AR', 'AU'
  responsavel?: string;
  ano?: '2025' | '2026';
}

export interface GlossaryItem {
  id: number | string;
  type: 'practice' | 'risk';
  practice: string; // The name of the practice or risk
  shortPractice?: string; // A shorter name for the graph view
  weight?: number; // Weight for maturity calculation
  level: number;
  priority?: number; // The order of the practice within its level
  description: string; // Describes the practice or risk
  
  // For 'practice' type
  riskAssociated?: string; // The name of the risk it mitigates (links to a risk item's 'practice' field)
  mitigation?: string; // How the practice mitigates the risk
  implementation?: string; // How to implement the practice
  goalPossible?: string; // The goal/benchmark for the practice
  dataPrevista?: string;
  areasEnvolvidas?: number;
  investimento?: 'Baixo' | 'Médio' | 'Alto' | 'Não se aplica';
  responsavel?: string;
  actions?: Action[]; // Sub-tasks for practices
  
  // Plotting data for the graph
  x?: number;
  y?: number;
}


export interface Acronym {
  term: string;
  definition: string;
}

export interface Country {
    code: string;
    name: string;
    Icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export type FlagData = Country;

export interface CountryAnswers {
  [countryCode: string]: {
    [questionId: string | number]: boolean;
  };
}

export interface CountryMaturityScore {
  score: number;
  incompleteLevels: { level: number; percentage: number }[];
}