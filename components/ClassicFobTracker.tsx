import React from 'react';
import { PetStats } from '../types';

interface ClassicFobTrackerProps {
  stats: PetStats;
}

export const ClassicFobTracker: React.FC<ClassicFobTrackerProps> = ({ stats }) => {
  // A tiny representation of the monochrome OLED device

  const renderDots = (value: number) => {
    const filled = Math.round(value / 20); // 0 to 5 dots
    return (
      <div className="flex gap-[2px]">
        {[...Array(5)].map((_, i) => (
          <div key={i} className={`w-2 h-2 rounded-full border border-black ${i < filled ? 'bg-black' : 'bg-transparent'}`} />
        ))}
      </div>
    );
  };

  return (
    <div className="oled-screen w-48 h-32 p-3 flex flex-col justify-between pixel-font text-xs">
      <div className="flex justify-between items-center border-b-2 border-black/20 pb-1">
        <span className="oled-text text-black drop-shadow-none">LV.{stats.level}</span>
        <span className="oled-text text-black drop-shadow-none">{stats.experience}/100</span>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-2 px-2 py-2">
        <div className="flex justify-between items-center">
          <span className="oled-text text-black drop-shadow-none font-bold">HUNG</span>
          {renderDots(stats.hunger)}
        </div>
        <div className="flex justify-between items-center">
          <span className="oled-text text-black drop-shadow-none font-bold">FEEL</span>
          {renderDots(stats.happiness)}
        </div>
        <div className="flex justify-between items-center">
          <span className="oled-text text-black drop-shadow-none font-bold">ENGY</span>
          {renderDots(stats.energy)}
        </div>
      </div>

      <div className="border-t-2 border-black/20 pt-1 flex justify-center gap-4 oled-text text-black drop-shadow-none cursor-pointer">
        <span>O</span>
        <span>O</span>
        <span>O</span>
      </div>
    </div>
  );
};
