
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { PetAvatar, PetSpecies } from '../types';
import { PetVisual } from './IsoMap';

interface PetAvatarEditorProps {
  currentAvatar: PetAvatar;
  onSave: (avatar: PetAvatar) => void;
  onClose: () => void;
}

const SPECIES_OPTIONS: PetSpecies[] = ['Dog', 'Cat', 'Bunny', 'Dragon', 'Ghost', 'Rock'];
const COLORS = ['#ef4444', '#f97316', '#facc15', '#4ade80', '#60a5fa', '#a78bfa', '#f472b6', '#ffffff', '#333333'];

const PetAvatarEditor: React.FC<PetAvatarEditorProps> = ({ currentAvatar, onSave, onClose }) => {
  const [name, setName] = useState(currentAvatar.name);
  const [species, setSpecies] = useState<PetSpecies>(currentAvatar.species);
  const [color, setColor] = useState(currentAvatar.color);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border-4 border-indigo-200">
        <div className="bg-indigo-500 p-4 text-white text-center">
          <h2 className="text-2xl font-black tracking-tight">Design Mayor</h2>
        </div>

        <div className="p-6">
          {/* 3D Preview */}
          <div className="h-48 w-full bg-slate-100 rounded-2xl mb-6 border-inner shadow-inner relative overflow-hidden">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-100 to-slate-200"></div>
             <Canvas shadows camera={{ position: [2, 2, 4], zoom: 2 }}>
                <ambientLight intensity={0.8} />
                <directionalLight position={[5, 5, 5]} castShadow />
                <group position={[0, -0.5, 0]}>
                    <PetVisual species={species} color={color} scale={2} isWalking={true} />
                </group>
                <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, -0.6, 0]} receiveShadow>
                    <circleGeometry args={[2, 32]} />
                    <meshStandardMaterial color="#cbd5e1" opacity={0.5} transparent />
                </mesh>
             </Canvas>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="w-full border-2 border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-700 focus:border-indigo-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Species</label>
              <div className="grid grid-cols-3 gap-2">
                {SPECIES_OPTIONS.map(s => (
                  <button
                    key={s}
                    onClick={() => setSpecies(s)}
                    className={`text-xs py-2 rounded-lg font-bold transition-all ${species === s ? 'bg-indigo-500 text-white shadow-md transform scale-105' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Coat Color</label>
              <div className="flex flex-wrap gap-2">
                {COLORS.map(c => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`w-8 h-8 rounded-full border-2 transition-transform ${color === c ? 'border-indigo-500 scale-110' : 'border-transparent hover:scale-105'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
             <button onClick={onClose} className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition-colors">
                Cancel
             </button>
             <button 
                onClick={() => onSave({ name, species, color })}
                className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-xl shadow-lg hover:shadow-indigo-500/30 transform transition-all hover:scale-[1.02]"
             >
                Save Mayor
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetAvatarEditor;
