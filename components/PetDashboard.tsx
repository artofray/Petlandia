import React from 'react';
import { PetAvatar, PetStats, ActionLog } from '../types';
import { motion } from 'motion/react';
import { Heart, Zap, Coffee, Star, MessageCircle, Music, Activity } from 'lucide-react';
import { ClassicFobTracker } from './ClassicFobTracker';

interface PetDashboardProps {
  avatar: PetAvatar;
  stats: PetStats;
  logs: ActionLog[];
  onAction: (action: string, type: ActionLog['type']) => void;
  isLoading: boolean;
}

export const PetDashboard: React.FC<PetDashboardProps> = ({ 
  avatar, stats, logs, onAction, isLoading 
}) => {

  const StatBar = ({ icon, color, value, label }: { icon: React.ReactNode, color: string, value: number, label: string }) => (
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-full border-4 border-white flex items-center justify-center text-white ${color} drop-shadow-md`}>
         {icon}
      </div>
      <div className="flex-1 stat-bar-container h-6">
        <div className={`stat-bar-fill ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col md:flex-row bg-[#bae6fd]">
      {/* Background decoration elements */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full mix-blend-overlay blur-xl" />
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-white rounded-full mix-blend-overlay blur-3xl animate-pulse" />
      </div>

      {/* Main Play Area */}
      <div className="flex-1 flex flex-col relative z-10 p-4 md:p-6 pb-24 md:pb-6 overflow-y-auto">
        
        {/* Top Header */}
        <div className="game-panel p-4 mb-6 flex flex-col sm:flex-row gap-6 justify-between items-center sticky top-0 z-20">
           <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 bg-blue-100 border-4 border-blue-400 rounded-2xl flex items-center justify-center font-bold text-2xl text-blue-600 shadow-inner">
                  Lv{stats.level}
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center text-amber-900 font-bold shadow-md">
                   <Star size={16} className="fill-amber-900" />
                </div>
              </div>
              <div>
                <h2 className="text-3xl text-slate-800 drop-shadow-sm">{avatar.name}</h2>
                <div className="font-bold text-slate-500 uppercase text-xs tracking-wider">
                  The {avatar.personality} {avatar.species}
                </div>
              </div>
           </div>

           <div className="flex-1 w-full max-w-sm space-y-2">
             <StatBar icon={<Heart size={18} />} color="bg-rose-400" value={stats.happiness} label="Happiness" />
             <StatBar icon={<Coffee size={18} />} color="bg-amber-500" value={stats.hunger} label="Hunger" />
             <StatBar icon={<Zap size={18} />} color="bg-blue-400" value={stats.energy} label="Energy" />
           </div>
        </div>

        {/* Center Stage for Pet */}
        <div className="flex-1 flex flex-col items-center justify-center min-h-[350px] relative">
          
          <div className="relative w-full max-w-[400px] aspect-square flex items-center justify-center">
             {/* Floor shadow */}
             <div className="absolute bottom-10 w-3/4 h-16 bg-black/10 rounded-[100%] blur-sm" />
             
             {avatar.imageUrl ? (
                <motion.img 
                  src={avatar.imageUrl} 
                  alt={avatar.name}
                  className="w-full h-full object-contain relative z-10"
                  animate={{ y: [0, -15, 0], scale: [1, 1.02, 1] }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                />
             ) : (
                <motion.div 
                  className="w-48 h-48 bg-slate-200 rounded-3xl border-8 border-slate-300 flex items-center justify-center text-slate-400 font-bold text-center p-4 relative z-10"
                  animate={{ y: [0, -15, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                >
                  [No Image Generated]
                </motion.div>
             )}

             {isLoading && (
               <div className="absolute top-0 right-0 bg-white border-4 border-slate-200 rounded-3xl rounded-bl-none p-4 shadow-xl z-20 animate-bounce">
                 <div className="flex gap-1">
                   <div className="w-3 h-3 bg-slate-400 rounded-full animate-pulse" />
                   <div className="w-3 h-3 bg-slate-400 rounded-full animate-pulse" style={{animationDelay: '150ms'}} />
                   <div className="w-3 h-3 bg-slate-400 rounded-full animate-pulse" style={{animationDelay: '300ms'}} />
                 </div>
               </div>
             )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="game-panel p-4 mb-2">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
             <button disabled={isLoading} onClick={() => onAction('Feed it its favorite snack!', 'care')} className="game-button game-button-blue py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm flex flex-col items-center justify-center gap-1 sm:gap-2 h-full">
                <Coffee size={24} /> Feed
             </button>
             <button disabled={isLoading} onClick={() => onAction('Play a fun mini-game!', 'play')} className="game-button py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm flex flex-col items-center justify-center gap-1 sm:gap-2 h-full">
                <Music size={24} /> Play
             </button>
             <button disabled={isLoading} onClick={() => onAction('Praise it and pet its head.', 'care')} className="game-button game-button-pink py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm flex flex-col items-center justify-center gap-1 sm:gap-2 h-full">
                <Heart size={24} /> Pet
             </button>
             <button disabled={isLoading} onClick={() => onAction('Talk to it and ask how it relies.', 'care')} className="game-button game-button-purple py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm flex flex-col items-center justify-center gap-1 sm:gap-2 h-full">
                <MessageCircle size={24} /> Talk
             </button>
           </div>
        </div>
      </div>

      {/* Right Sidebar (Logs & Hardware) */}
      <div className="w-full md:w-80 lg:w-96 bg-white border-l-4 border-slate-200 flex flex-col z-20 shadow-xl">
         
         <div className="p-4 border-b-4 border-slate-100 flex items-center justify-between">
           <h3 className="text-xl text-slate-800">Pet Diary</h3>
           <Activity className="text-slate-400" />
         </div>

         <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {logs.length === 0 ? (
               <div className="text-center text-slate-400 p-8 font-bold text-sm">
                 It's quiet... interact with {avatar.name} to start a memory!
               </div>
            ) : (
               logs.map((log, i) => (
                 <motion.div 
                   key={log.id} 
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   className={`p-3 rounded-2xl border-2 text-sm font-bold shadow-sm ${
                     log.type === 'evolution' ? 'bg-amber-100 border-amber-300 text-amber-800' :
                     log.type === 'care' ? 'bg-rose-50 border-rose-200 text-rose-700' :
                     log.type === 'play' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                     'bg-slate-50 border-slate-200 text-slate-600'
                   }`}
                 >
                   {log.message}
                 </motion.div>
               ))
            )}
         </div>

         <div className="p-4 bg-slate-100 border-t-4 border-slate-200">
            <h4 className="text-xs uppercase font-bold text-slate-400 text-center mb-2">Connected Keychain Fob</h4>
            <div className="w-full flex justify-center">
              <ClassicFobTracker stats={stats} />
            </div>
         </div>
         
      </div>

    </div>
  );
}
