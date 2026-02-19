
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { BuildingType, CityStats, AIGoal, NewsItem, PetAvatar } from '../types';
import { BUILDINGS } from '../constants';
import { PetVisual } from './IsoMap';

interface UIOverlayProps {
  stats: CityStats;
  selectedTool: BuildingType;
  onSelectTool: (type: BuildingType) => void;
  currentGoal: AIGoal | null;
  newsFeed: NewsItem[];
  onClaimReward: () => void;
  isGeneratingGoal: boolean;
  aiEnabled: boolean;
  avatar: PetAvatar;
  onEditAvatar: () => void;
  petThought: string;
}

const tools = [
  BuildingType.None,
  BuildingType.Road,
  BuildingType.Residential,
  BuildingType.Commercial,
  BuildingType.Industrial,
  BuildingType.Entertainment,
  BuildingType.Service,
  BuildingType.Park,
];

const ToolButton: React.FC<{
  type: BuildingType;
  isSelected: boolean;
  onClick: () => void;
  money: number;
}> = ({ type, isSelected, onClick, money }) => {
  const config = BUILDINGS[type];
  const canAfford = money >= config.cost;
  const isBulldoze = type === BuildingType.None;
  
  const bgColor = isBulldoze ? config.color : config.color;

  return (
    <button
      onClick={onClick}
      disabled={!isBulldoze && !canAfford}
      className={`
        relative flex flex-col items-center justify-center rounded-lg border-2 transition-all shadow-lg backdrop-blur-sm flex-shrink-0
        w-14 h-14 md:w-16 md:h-16
        ${isSelected ? 'border-white bg-white/30 scale-110 z-10' : 'border-slate-400 bg-slate-100/80 hover:bg-slate-200'}
        ${!isBulldoze && !canAfford ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      title={config.description}
    >
      <div className="w-6 h-6 md:w-8 md:h-8 rounded mb-0.5 md:mb-1 border border-black/10 shadow-sm flex items-center justify-center overflow-hidden" style={{ backgroundColor: isBulldoze ? 'transparent' : bgColor }}>
        {isBulldoze && <div className="w-full h-full text-red-500 flex justify-center items-center font-bold text-base md:text-lg">✕</div>}
        {type === BuildingType.Road && <div className="w-full h-2 bg-stone-400 transform -rotate-45"></div>}
      </div>
      <span className="text-[8px] md:text-[10px] font-bold text-slate-700 uppercase tracking-wider drop-shadow-sm leading-none whitespace-nowrap overflow-hidden text-ellipsis w-full px-1 text-center">{config.name}</span>
      {config.cost > 0 && (
        <span className={`text-[8px] md:text-[10px] font-mono leading-none ${canAfford ? 'text-green-600' : 'text-red-500'}`}>${config.cost}</span>
      )}
    </button>
  );
};

const UIOverlay: React.FC<UIOverlayProps> = ({
  stats,
  selectedTool,
  onSelectTool,
  currentGoal,
  newsFeed,
  onClaimReward,
  isGeneratingGoal,
  aiEnabled,
  avatar,
  onEditAvatar,
  petThought
}) => {
  const newsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (newsRef.current) {
      newsRef.current.scrollTop = newsRef.current.scrollHeight;
    }
  }, [newsFeed]);

  const levelProgress = (stats.population % 10) * 10;
  const isTranslatorUnlocked = stats.level >= 50;

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-2 md:p-4 font-sans z-10">
      
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start pointer-events-auto gap-2 w-full max-w-full">
        
        {/* Stats */}
        <div className="bg-white/90 text-slate-800 p-2 md:p-3 rounded-xl border border-slate-200 shadow-xl backdrop-blur-md flex gap-3 md:gap-6 items-center justify-between md:justify-start w-full md:w-auto">
          <div className="flex flex-col">
            <span className="text-[8px] md:text-[10px] text-slate-500 uppercase font-bold tracking-widest">Treat Jar</span>
            <span className="text-lg md:text-2xl font-black text-amber-500 font-mono drop-shadow-sm">${stats.money.toLocaleString()}</span>
          </div>
          <div className="w-px h-6 md:h-8 bg-slate-300"></div>
          <div className="flex flex-col">
            <span className="text-[8px] md:text-[10px] text-slate-500 uppercase font-bold tracking-widest">Pets</span>
            <span className="text-base md:text-xl font-bold text-pink-500 font-mono drop-shadow-sm">{stats.population.toLocaleString()}</span>
          </div>
          <div className="w-px h-6 md:h-8 bg-slate-300"></div>
          <div className="flex flex-col">
            <span className="text-[8px] md:text-[10px] text-slate-500 uppercase font-bold tracking-widest">Level</span>
            <span className="text-base md:text-xl font-bold text-indigo-500 font-mono drop-shadow-sm">{stats.level}</span>
          </div>
        </div>

        {/* AI Goal Panel */}
        <div className={`w-full md:w-80 bg-white/90 text-slate-800 rounded-xl border-2 border-indigo-200 shadow-xl backdrop-blur-md overflow-hidden transition-all ${!aiEnabled ? 'opacity-80 grayscale-[0.5]' : ''}`}>
          <div className="bg-indigo-100/80 px-3 md:px-4 py-1.5 md:py-2 flex justify-between items-center border-b border-indigo-200">
            <span className="font-bold uppercase text-[10px] md:text-xs tracking-widest flex items-center gap-2 text-indigo-800">
              {aiEnabled ? (
                <>
                  <span className={`w-2 h-2 rounded-full ${isGeneratingGoal ? 'bg-amber-400 animate-ping' : 'bg-green-400 animate-pulse'}`}></span>
                  Paw-lanner
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                  Free Sniff
                </>
              )}
            </span>
            {isGeneratingGoal && aiEnabled && <span className="text-[10px] animate-pulse text-indigo-500 font-mono">Sniffing...</span>}
          </div>
          
          <div className="p-3 md:p-4">
            {aiEnabled ? (
              currentGoal ? (
                <>
                  <p className="text-xs md:text-sm font-medium text-slate-700 mb-2 md:mb-3 leading-tight">"{currentGoal.description}"</p>
                  
                  <div className="flex justify-between items-center mt-1 md:mt-2 bg-indigo-50 p-1.5 md:p-2 rounded-lg border border-indigo-100">
                    <div className="text-[10px] md:text-xs text-slate-500">
                      Goal: <span className="font-mono font-bold text-indigo-600">
                        {currentGoal.targetType === 'building_count' ? BUILDINGS[currentGoal.buildingType!].name : 
                         currentGoal.targetType === 'money' ? '$' : 'Pets '} {currentGoal.targetValue}
                      </span>
                    </div>
                    <div className="text-[10px] md:text-xs text-amber-600 font-bold font-mono bg-amber-100 px-2 py-0.5 rounded border border-amber-200">
                      +${currentGoal.reward}
                    </div>
                  </div>
  
                  {currentGoal.completed && (
                    <button
                      onClick={onClaimReward}
                      className="mt-2 md:mt-3 w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-bold py-1.5 md:py-2 px-4 rounded shadow-md transition-all animate-bounce text-xs md:text-sm uppercase tracking-wide"
                    >
                      Get Treat!
                    </button>
                  )}
                </>
              ) : (
                <div className="text-xs md:text-sm text-slate-400 py-2 italic flex items-center gap-2">
                  <svg className="animate-spin h-3 w-3 md:h-4 md:w-4 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Chasing tail...
                </div>
              )
            ) : (
              <div className="text-xs md:text-sm text-slate-400 py-1">
                 <p className="mb-1">Just vibing.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pet Avatar & Translation Unit */}
      <div className="absolute left-2 md:left-4 bottom-28 md:bottom-28 pointer-events-auto">
        <div className="relative group">
           {/* Speech Bubble */}
           <div className={`absolute bottom-full left-0 mb-2 w-48 md:w-64 bg-white p-3 rounded-2xl rounded-bl-none shadow-xl border-2 border-slate-100 transition-all ${isTranslatorUnlocked ? 'opacity-100' : 'opacity-90'}`}>
              <p className={`text-xs md:text-sm font-medium leading-tight ${isTranslatorUnlocked ? 'text-indigo-800' : 'text-slate-500 italic'}`}>
                {isTranslatorUnlocked ? (
                  petThought || "Thinking..."
                ) : (
                   petThought || "Meow? Woof! (Translation device locked)"
                )}
              </p>
              {!isTranslatorUnlocked && (
                  <div className="mt-2 text-[9px] text-slate-400 font-bold uppercase tracking-wide flex items-center gap-1">
                    <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                    Unlock at Level 50
                  </div>
              )}
           </div>

           {/* Avatar Container */}
           <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-indigo-100 to-white rounded-full border-4 border-white shadow-2xl relative overflow-hidden hover:scale-105 transition-transform cursor-pointer" onClick={onEditAvatar}>
              <Canvas shadows camera={{ position: [1.5, 1, 2.5], zoom: 2.2 }}>
                  <ambientLight intensity={0.8} />
                  <directionalLight position={[2, 5, 2]} />
                  <PetVisual species={avatar.species} color={avatar.color} isWalking />
              </Canvas>
              <div className="absolute bottom-0 inset-x-0 bg-black/40 text-white text-[9px] font-bold text-center py-0.5 backdrop-blur-sm">
                {avatar.name}
              </div>
           </div>
           
           {/* Edit Badge */}
           <button onClick={onEditAvatar} className="absolute -bottom-1 -right-1 bg-white text-slate-700 p-1.5 rounded-full shadow-md border border-slate-200 hover:bg-slate-50 text-[10px]">
             ✏️
           </button>
        </div>
      </div>

      {/* Bottom Bar: Tools & News */}
      <div className="flex flex-col-reverse md:flex-row md:justify-between md:items-end pointer-events-auto mt-auto gap-2 w-full max-w-full">
        
        <div className="flex gap-1 md:gap-2 bg-white/80 p-1 md:p-2 rounded-2xl border border-slate-200 backdrop-blur-xl shadow-xl w-full md:w-auto overflow-x-auto no-scrollbar justify-start md:justify-start">
          <div className="flex gap-1 md:gap-2 min-w-max px-1">
            {tools.map((type) => (
              <ToolButton
                key={type}
                type={type}
                isSelected={selectedTool === type}
                onClick={() => onSelectTool(type)}
                money={stats.money}
              />
            ))}
          </div>
          <div className="text-[8px] text-slate-400 uppercase writing-mode-vertical flex items-center justify-center font-bold tracking-widest border-l border-slate-300 pl-1 ml-1 select-none">Build</div>
        </div>

        {/* News Feed */}
        <div className="w-full md:w-80 h-32 md:h-40 bg-slate-900/90 text-white rounded-xl border border-slate-700 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden relative">
          <div className="bg-slate-800/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-300 border-b border-slate-600 flex justify-between items-center">
            <span>The Daily Bark</span>
            <span className={`w-1.5 h-1.5 rounded-full ${aiEnabled ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`}></span>
          </div>
          
          <div ref={newsRef} className="flex-1 overflow-y-auto p-2 md:p-3 space-y-2 text-[10px] md:text-xs font-mono scroll-smooth mask-image-b z-10">
            {newsFeed.length === 0 && <div className="text-slate-500 italic text-center mt-10">No barks yet.</div>}
            {newsFeed.map((news) => (
              <div key={news.id} className={`
                border-l-2 pl-2 py-1 transition-all animate-fade-in leading-tight relative
                ${news.type === 'positive' ? 'border-green-500 text-green-200 bg-green-900/20' : ''}
                ${news.type === 'negative' ? 'border-red-500 text-red-200 bg-red-900/20' : ''}
                ${news.type === 'neutral' ? 'border-blue-400 text-blue-100 bg-blue-900/20' : ''}
              `}>
                <span className="opacity-50 text-[8px] absolute top-0.5 right-1">{new Date(Number(news.id.split('.')[0])).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                {news.text}
              </div>
            ))}
          </div>
        </div>

      </div>
      
      <div className="absolute bottom-1 right-2 md:right-4 text-[8px] md:text-[9px] text-slate-500 font-mono text-right pointer-events-auto hover:text-slate-800 transition-colors">
        <a href="https://x.com/ammaar" target="_blank" rel="noreferrer">Created by @ammaar</a>
      </div>
    </div>
  );
};

export default UIOverlay;
