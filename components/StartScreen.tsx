/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';

interface StartScreenProps {
  onStart: (aiEnabled: boolean) => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const [aiEnabled, setAiEnabled] = useState(true);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-50 text-slate-800 font-sans p-6 bg-sky-200/40 backdrop-blur-sm transition-all duration-1000">
      <div className="max-w-md w-full bg-white/95 p-8 rounded-3xl border-4 border-sky-400 shadow-[0_0_60px_-15px_rgba(14,165,233,0.3)] relative overflow-hidden animate-fade-in">
        
        <div className="relative z-10 text-center">
            <h1 className="text-5xl font-black mb-2 text-sky-500 tracking-tight drop-shadow-sm">
            Petlandia
            </h1>
            <p className="text-slate-500 mb-8 text-sm font-bold uppercase tracking-widest">
            A City Ran By Pets
            </p>

            <div className="bg-sky-50 p-5 rounded-2xl border-2 border-sky-100 mb-8 hover:border-sky-200 transition-colors text-left">
            <label className="flex items-center justify-between cursor-pointer group">
                <div className="flex flex-col gap-1">
                <span className="font-bold text-base text-slate-700 group-hover:text-sky-600 transition-colors flex items-center gap-2">
                    City Paw-lanner
                    {aiEnabled && <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>}
                </span>
                <span className="text-xs text-slate-500 group-hover:text-slate-600 transition-colors">
                    Enable AI-generated goals & news from Mayor Whiskers.
                </span>
                </div>
                
                <div className="relative flex-shrink-0 ml-4">
                <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={aiEnabled}
                    onChange={(e) => setAiEnabled(e.target.checked)}
                />
                <div className="w-11 h-6 bg-slate-300 rounded-full peer peer-focus:ring-2 peer-focus:ring-sky-500/40 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-500"></div>
                </div>
            </label>
            </div>

            <button 
            onClick={() => onStart(aiEnabled)}
            className="w-full py-4 bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 text-white font-black rounded-2xl shadow-xl shadow-sky-200 transform transition-all hover:scale-[1.02] active:scale-[0.98] text-lg tracking-wide border-b-4 border-blue-600 active:border-b-0 active:translate-y-1"
            >
            Start Building!
            </button>

            <div className="mt-8 text-center">
                <a 
                    href="https://x.com/ammaar" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-sky-500 transition-colors font-mono group"
                >
                    <span>Created by</span>
                    <span className="font-bold group-hover:underline decoration-sky-400 underline-offset-2">@ammaar</span>
                </a>
            </div>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;