
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect, useCallback } from 'react';
import { PetAvatar, PetStats, ActionLog } from './types';
import { PetSetup } from './components/PetSetup';
import { PetDashboard } from './components/PetDashboard';
import { interactWithPet } from './services/geminiService';

export default function App() {
  const [avatar, setAvatar] = useState<PetAvatar | null>(null);
  const [stats, setStats] = useState<PetStats>({
    hunger: 60,
    happiness: 80,
    energy: 100,
    level: 1,
    experience: 0,
  });
  
  const [logs, setLogs] = useState<ActionLog[]>([]);
  const [isInteracting, setIsInteracting] = useState(false);

  const addLog = (message: string, type: ActionLog['type']) => {
    setLogs(prev => [{
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toISOString(),
      message,
      type
    }, ...prev].slice(0, 50));
  };

  // Passive stat decay
  useEffect(() => {
    if (!avatar) return;
    
    // Simulate pet needs over time
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        hunger: Math.max(0, prev.hunger - 2),
        happiness: Math.max(0, prev.happiness - 1),
        energy: Math.min(100, prev.energy + 5), // Energy slowly recovers passively
      }));
    }, 10000); // 10 seconds
    
    return () => clearInterval(interval);
  }, [avatar]);

  const handleAction = useCallback(async (action: string, type: ActionLog['type'] = 'play') => {
    if (!avatar || isInteracting) return;
    
    setIsInteracting(true);
    addLog(`You: ${action}`, type);

    const response = await interactWithPet(avatar, stats, action);
    
    if (response) {
      addLog(`${avatar.name}: ${response.message}`, 'care');
      
      setStats(prev => {
        let newXp = prev.experience + (response.statChanges.experience || 0);
        let newLevel = prev.level;
        
        // Level up logic
        if (newXp >= 100) {
          newLevel++;
          newXp -= 100;
          addLog(`LEVEL UP! ${avatar.name} reached level ${newLevel}!`, 'evolution');
        }

        return {
          hunger: Math.max(0, Math.min(100, prev.hunger + (response.statChanges.hunger || 0))),
          happiness: Math.max(0, Math.min(100, prev.happiness + (response.statChanges.happiness || 0))),
          energy: Math.max(0, Math.min(100, prev.energy + (response.statChanges.energy || 0))),
          level: newLevel,
          experience: newXp,
        };
      });
    } else {
      addLog(`${avatar.name} is confused.`, 'system');
    }

    setIsInteracting(false);
  }, [avatar, stats, isInteracting]);

  return (
    <div className="relative w-screen h-screen overflow-hidden selection:bg-pink-200">
      {!avatar ? (
        <PetSetup onProvision={(a) => {
          setAvatar(a);
          addLog(`Hatched ${a.name} the ${a.species}!`, 'evolution');
        }} />
      ) : (
        <PetDashboard 
          avatar={avatar}
          stats={stats} 
          logs={logs}
          onAction={handleAction}
          isLoading={isInteracting}
        />
      )}
    </div>
  );
}

