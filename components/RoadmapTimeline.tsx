
import React, { useMemo } from 'react';
import { WorldMapIcon } from './icons/WorldMapIcon';
import { PinIcon } from './icons/PinIcon';
import type { GlossaryItem, CountryMaturityScore } from '../types';
import { countries } from '../data/countries';

interface RoadmapTimelineProps {
    items: GlossaryItem[];
    countryMaturityScores: { [countryCode: string]: CountryMaturityScore };
}

const maturityLevelsInfo = [
    { level: 1, title: "Reativo / Inicial" },
    { level: 2, title: "Padronização" },
    { level: 3, title: "Integração" },
    { level: 4, title: "Otimização / Colaborativo" },
    { level: 5, title: "Estratégico / Preditivo" }
];

// Helper function to calculate a point on the value curve based on maturity score
const calculatePointOnCurve = (score: number): { x: number, y: number } => {
    // This cubic bezier function is a manual approximation of the value curve's path
    // We map the score (1 to 5) to t (0 to 1)
    const t = (score - 1) / 4; 

    // P0 and P3 are the start and end points of the main value curve
    // P1 and P2 are control points that define the shape of the curve
    const P0 = { x: 20, y: 600 };   // Start point (Level 1)
    const P1 = { x: 350, y: 370 }; // Control point 1
    const P2 = { x: 850, y: 230 }; // Control point 2
    const P3 = { x: 1260, y: 160 }; // End point (Level 5)

    const x = Math.pow(1-t, 3)*P0.x + 3*Math.pow(1-t, 2)*t*P1.x + 3*(1-t)*Math.pow(t, 2)*P2.x + Math.pow(t, 3)*P3.x;
    const y = Math.pow(1-t, 3)*P0.y + 3*Math.pow(1-t, 2)*t*P1.y + 3*(1-t)*Math.pow(t, 2)*P2.y + Math.pow(t, 3)*P3.y;

    return { x, y };
};

const getFontSize = (text?: string): string => {
    const len = text?.length || 0;
    if (len > 22) return '11px';
    if (len > 15) return '12.5px';
    return '14px';
};


export const RoadmapTimeline: React.FC<RoadmapTimelineProps> = ({ items, countryMaturityScores }) => {

  const practicesData = items.filter(item => item.type === 'practice' && item.x && item.y);
  const risksData = items.filter(item => item.type === 'risk' && item.x && item.y);
  
  const flagPositions = useMemo(() => {
    const FLAG_WIDTH = 40; 
    const VERTICAL_SPACING = 50; // Increased spacing
    const BASE_Y_OFFSET = -100; // Increased offset to move flags further from the curve

    const initialPositions = countries.map(country => {
        const scoreData = countryMaturityScores[country.code] || { score: 1, incompleteLevels: [] };
        const { x, y } = calculatePointOnCurve(scoreData.score);
        return { x, y: y + BASE_Y_OFFSET, country, scoreData };
    }).sort((a, b) => a.x - b.x);

    // De-conflict overlapping flags
    for (let i = 0; i < initialPositions.length; i++) {
        for (let j = i + 1; j < initialPositions.length; j++) {
            const p1 = initialPositions[i];
            const p2 = initialPositions[j];
            if (Math.abs(p1.x - p2.x) < FLAG_WIDTH) {
                p2.y = p1.y + VERTICAL_SPACING; // Push the second flag down
            }
        }
    }
    
    return initialPositions;
  }, [countryMaturityScores]);

  // Component to render text with a subtle white background for legibility
  const TextWithBg = ({ x, y, children, ...props }: any) => (
      <text
          x={x}
          y={y}
          {...props}
          style={{ 
            paintOrder: 'stroke', 
            stroke: 'rgba(255, 255, 255, 0.7)', 
            strokeWidth: '4px', 
            strokeLinecap: 'butt', 
            strokeLinejoin: 'miter',
          }}
      >
          {children}
      </text>
  );

  return (
    <div className="w-full bg-white p-4 lg:p-8 rounded-2xl shadow-2xl relative overflow-hidden font-sans">
        <div className="absolute inset-0 z-0 opacity-10">
            <WorldMapIcon className="w-full h-full object-cover"/>
        </div>
        
        <div className="relative z-10 w-full mt-28" style={{ paddingBottom: '56.25%' }}> {/* 16:9 Aspect Ratio */}
            <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 1280 720" preserveAspectRatio="xMidYMid meet">
                
                {/* CURVES AND AREA */}
                <path d="M20 600 C 150 520, 250 420, 480 410 S 700 270, 950 240 S 1150 190, 1260 200" stroke="#0f172a" strokeWidth="2" fill="none" strokeLinecap="round"/>
                <path d="M50 630 C 200 680, 350 710, 500 700 S 700 670, 850 670 S 1000 650, 1230 640" stroke="#dc2626" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeDasharray="6 6"/>
                <path d="M20 600 C 150 520, 250 420, 480 410 S 700 270, 950 240 S 1150 190, 1260 200 L 1230 640 C 1000 650, 850 670, 700 670 S 500 700, 350 710, 200 680, 50 630 Z" fill="#0f172a" fillOpacity="0.05"/>

                {/* OPPORTUNITY TEXT */}
                <g>
                   <circle cx="640" cy="530" r="10" fill="#0f172a"/>
                   <text x="640" y="565" fontFamily="sans-serif" fontSize="22" fontWeight="bold" fill="#4b5563" textAnchor="middle">
                        Oportunidade de Transformação da Gestão de Materiais
                    </text>
                </g>

                {/* PLOT POINTS - PRACTICES */}
                {practicesData.map((point) => (
                    <g key={`practice-${point.id}`} className="cursor-pointer group">
                        <title>{point.practice}: {point.description}</title>
                        <circle cx={point.x} cy={point.y} r="8" fill="#1e3a8a" stroke="white" strokeWidth="2" className="transition-all duration-200 group-hover:r-10"/>
                        <TextWithBg 
                            x={point.x} 
                            y={point.y! - 22} 
                            fontFamily="sans-serif" 
                            fontSize={getFontSize(point.shortPractice)} 
                            fill="#1e3a8a" 
                            textAnchor="middle" 
                            fontWeight="semibold"
                        >
                            {point.shortPractice || point.practice}
                        </TextWithBg>
                    </g>
                ))}

                 {/* PLOT POINTS - RISKS */}
                {risksData.map((point) => (
                    <g key={`risk-${point.id}`} className="cursor-pointer group">
                        <title>{point.practice}: {point.description}</title>
                        <circle cx={point.x} cy={point.y} r="7" fill="#dc2626" className="transition-all duration-200 group-hover:r-9"/>
                         <TextWithBg 
                            x={point.x} 
                            y={point.y! + 25} 
                            fontFamily="sans-serif" 
                            fontSize={getFontSize(point.shortPractice)}
                            fill="#b91c1c" 
                            textAnchor="middle" 
                            fontWeight="medium"
                        >
                             {point.shortPractice || point.practice}
                        </TextWithBg>
                    </g>
                ))}

                {/* LEVEL DIVIDERS */}
                {[256, 512, 768, 1024].map(x => (
                     <line key={x} x1={x} y1="100" x2={x} y2="700" stroke="gray" strokeWidth="1" strokeDasharray="4 4" opacity="0.4"/>
                ))}

                {/* DYNAMIC FLAG ICONS */}
                <g>
                    {flagPositions.map(({ x, y, country, scoreData }) => {
                        const FlagIcon = country.Icon;
                        return (
                             <g key={country.code} transform={`translate(${x - 15}, ${y - 15})`} className="transition-all duration-500 ease-out">
                                <title>{`${country.name} - Maturidade: ${scoreData.score.toFixed(2)}`}</title>
                                <FlagIcon width={30} height={30} />
                                {scoreData.incompleteLevels.length > 0 && (
                                  <text
                                    x={15}
                                    y={42}
                                    fontSize="10px"
                                    fill="#4b5563"
                                    textAnchor="middle"
                                    fontWeight="bold"
                                  >
                                    {scoreData.incompleteLevels.map(il => `${il.percentage}% N${il.level}`).join(' ')}
                                  </text>
                                )}
                            </g>
                        );
                    })}
                </g>
            </svg>
        </div>

        {/* AXIS LABELS */}
        <div className="absolute top-1/2 -left-10 md:-left-6 -translate-y-1/2 transform -rotate-90 text-gray-500 font-semibold text-sm tracking-wider mt-12">
            Valor Entregue
        </div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-gray-500 font-semibold text-sm tracking-wider">
            Tempo / Maturidade
        </div>

        {/* LEVEL BOXES - Positioned relative to the main container */}
        <div className="absolute top-4 w-full flex justify-around px-4 z-20">
             {maturityLevelsInfo.map((level) => {
                const isMeta = level.level === 5;
                return (
                    <div key={level.level} className="w-1/5 text-center px-1">
                        <div className="bg-white/90 backdrop-blur-sm border border-slate-300 rounded-lg p-2 shadow-sm relative h-full flex flex-col justify-center">
                            {isMeta && (
                                <span className="absolute -top-3 -right-3">
                                    <PinIcon className="w-8 h-8 text-red-500" style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.3))' }}/>
                                </span>
                            )}
                             {isMeta && <div className="text-red-600 font-bold text-sm leading-tight">META</div>}
                            <div className="font-bold text-lg text-slate-700">Nível {level.level}</div>
                            <div className="text-slate-500 font-medium text-xs mt-1 leading-tight">{level.title}</div>
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
  );
};
