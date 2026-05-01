import React, { useState } from 'react';
import { PetAvatar, PetPersonality } from '../types';
import { Sparkles, Palette, Shuffle, Egg } from 'lucide-react';
import { motion } from 'motion/react';
import { generatePetImage } from '../services/geminiService';

const SUGGESTED_SPECIES = ['Axolotl', 'Pug', 'Slime', 'Griffin', 'Unicorn', 'Mushroom', 'Cloud', 'Cyborg Kitty', 'Capybara', 'Red Panda', 'Dragon'];
const THEMES = ['Pastel', 'Neon', 'Galaxy', 'Forest', 'Ocean', 'Candy', 'Monochrome'];
const PERSONALITIES: PetPersonality[] = ['Playful', 'Sleepy', 'Mischievous', 'Grumpy', 'Sweet'];

interface PetSetupProps {
  onProvision: (avatar: PetAvatar) => void;
}

export const PetSetup: React.FC<PetSetupProps> = ({ onProvision }) => {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('Axolotl');
  const [colorTheme, setColorTheme] = useState('Pastel');
  const [personality, setPersonality] = useState<PetPersonality>('Playful');
  const [isHatching, setIsHatching] = useState(false);
  const [statusText, setStatusText] = useState('');

  const handleHatch = async () => {
    setIsHatching(true);
    setStatusText('Warming the egg...');
    
    try {
      setStatusText('Visualizing your new friend...');
      const imageUrl = await generatePetImage(species, colorTheme);

      setStatusText('Hatching!!');
      onProvision({
        id: Math.random().toString(36).substring(7),
        name: name || 'Bubbles',
        species,
        colorTheme,
        personality,
        stage: 'Baby',
        imageUrl
      });
    } catch (e) {
      setStatusText('Failed to hatch. Try again!');
      setIsHatching(false);
    }
  };

  if (isHatching) {
     return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#bae6fd]">
           <motion.div 
             animate={{ rotate: [-10, 10, -10], y: [0, -20, 0] }}
             transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
             className="relative"
           >
             <Egg className="w-48 h-48 text-white drop-shadow-2xl fill-white" />
             <div className="absolute inset-0 flex items-center justify-center text-rose-400 opacity-50">
                <Sparkles className="w-24 h-24 animate-spin-slow" />
             </div>
           </motion.div>
           <h2 className="mt-8 text-3xl font-black text-slate-800 drop-shadow-md game-font">{statusText}</h2>
           <div className="mt-4 flex gap-3">
              <div className="w-5 h-5 bg-white rounded-full animate-bounce shadow-md" style={{animationDelay: '0ms'}} />
              <div className="w-5 h-5 bg-white rounded-full animate-bounce shadow-md" style={{animationDelay: '150ms'}} />
              <div className="w-5 h-5 bg-white rounded-full animate-bounce shadow-md" style={{animationDelay: '300ms'}} />
           </div>
        </div>
     );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#bae6fd] relative">
      
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 pb-[250px] sm:pb-[250px]">
        <div className="max-w-xl mx-auto flex flex-col items-center">
          
          <div className="text-center mb-6">
            <h1 className="text-4xl text-slate-800 drop-shadow-sm flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-8 h-8 text-amber-400" />
              <span>INCUBATOR</span>
              <Sparkles className="w-8 h-8 text-amber-400" />
            </h1>
            <p className="text-slate-600 font-bold">Design your perfect companion!</p>
          </div>

          <motion.div 
            animate={{ y: [0, -10, 0] }} 
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="mb-8"
          >
            <div className={`w-32 h-32 rounded-[40%] bg-gradient-to-br from-white to-slate-200 shadow-xl border-4 border-white flex flex-col items-center justify-center`}>
              <Egg className={`w-16 h-16 ${colorTheme === 'Candy' || colorTheme === 'Pastel' ? 'text-pink-400 fill-pink-200' : colorTheme === 'Mushroom' ? 'text-red-500 fill-red-100' : 'text-blue-400 fill-blue-100'}`} />
              <span className="text-xs font-bold text-slate-400 mt-2">Dormant</span>
            </div>
          </motion.div>

          <div className="game-panel w-full p-6 space-y-6">
            
            {/* Name Input */}
            <div>
              <label className="block text-slate-500 font-black mb-2 uppercase text-sm">Give it a Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Barnaby"
                className="w-full bg-slate-50 border-4 border-slate-200 rounded-2xl px-5 py-4 font-bold text-slate-700 focus:outline-none focus:border-blue-400 text-xl transition-colors shadow-inner"
              />
            </div>

            <div className="h-1 bg-slate-100 rounded-full w-full" />

            {/* Species Input */}
            <div>
              <label className="block text-slate-500 font-black mb-2 uppercase text-sm">
                Species
              </label>
              <input 
                type="text" 
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
                placeholder="Axolotl, Pug, Slime..."
                className="w-full bg-slate-50 border-4 border-slate-200 rounded-2xl px-5 py-4 font-bold text-slate-700 focus:outline-none focus:border-blue-400 text-xl mb-3 transition-colors shadow-inner"
              />
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_SPECIES.map(s => (
                  <button key={s} onClick={() => setSpecies(s)} className="text-sm font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-full border-2 border-slate-200 transition-colors">
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-1 bg-slate-100 rounded-full w-full" />

            {/* Color Theme */}
            <div>
              <label className="block text-slate-500 font-black mb-2 uppercase text-sm">Color Theme</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {THEMES.map(t => (
                  <button
                    key={t}
                    onClick={() => setColorTheme(t)}
                    className={`py-3 px-2 rounded-2xl font-bold text-sm transition-all border-4 ${colorTheme === t ? 'bg-amber-100 border-amber-400 text-amber-700 scale-105' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-1 bg-slate-100 rounded-full w-full" />

            {/* Personality */}
            <div>
              <label className="block text-slate-500 font-black mb-2 uppercase text-sm">Personality</label>
              <div className="flex flex-wrap gap-2">
                {PERSONALITIES.map(p => (
                  <button
                    key={p}
                    onClick={() => setPersonality(p)}
                    className={`py-3 px-4 rounded-2xl font-bold text-sm transition-all border-4 ${personality === p ? 'bg-rose-100 border-rose-400 text-rose-700 scale-105' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-1 bg-slate-100 rounded-full w-full my-4" />
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar for Action */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#bae6fd] via-[#bae6fd] to-transparent z-50 pointer-events-none pb-8">
         <div className="max-w-xl mx-auto flex flex-col gap-3 pointer-events-auto pt-16">
            <button
              onClick={handleHatch}
              disabled={!species}
              className="w-full p-6 text-2xl sm:text-3xl game-button disabled:opacity-50 flex justify-center items-center gap-3 drop-shadow-xl"
            >
              <Egg className="w-8 h-8 fill-white" /> HATCH PET!
            </button>
            
            <button
              onClick={() => {
                setSpecies(SUGGESTED_SPECIES[Math.floor(Math.random() * SUGGESTED_SPECIES.length)]);
                setColorTheme(THEMES[Math.floor(Math.random() * THEMES.length)]);
                setPersonality(PERSONALITIES[Math.floor(Math.random() * PERSONALITIES.length)]);
              }}
              className="w-full p-4 text-lg sm:text-xl game-button game-button-blue shadow-lg flex justify-center items-center gap-2"
            >
              <Shuffle className="w-6 h-6" /> SURPRISE ME
            </button>
         </div>
      </div>
    </div>
  );
}
