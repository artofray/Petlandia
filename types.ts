
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export type PetStage = 'Egg' | 'Baby' | 'Teen' | 'Adult';
export type PetPersonality = 'Playful' | 'Sleepy' | 'Mischievous' | 'Grumpy' | 'Sweet';

export interface PetAvatar {
  id: string;
  name: string;
  species: string;
  personality: PetPersonality;
  colorTheme: string;
  stage: PetStage;
  imageUrl?: string | null;
}

export interface PetStats {
  hunger: number;
  happiness: number;
  energy: number;
  level: number;
  experience: number;
}

export interface ActionLog {
  id: string;
  timestamp: string;
  message: string;
  type: 'care' | 'play' | 'system' | 'evolution';
}

export interface PetResponse {
  message: string;
  statChanges: {
    hunger?: number;
    happiness?: number;
    energy?: number;
    experience?: number;
  };
}


