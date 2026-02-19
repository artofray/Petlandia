
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { BuildingConfig, BuildingType } from './types';

// Map Settings
export const GRID_SIZE = 15;

// Game Settings
export const TICK_RATE_MS = 2000; // Game loop updates every 2 seconds
export const INITIAL_MONEY = 1200; // Bumped up slightly for new content

export const BUILDINGS: Record<BuildingType, BuildingConfig> = {
  [BuildingType.None]: {
    type: BuildingType.None,
    cost: 0,
    name: 'Dig Up',
    description: 'Clear a tile',
    color: '#ef4444', // Used for UI
    popGen: 0,
    incomeGen: 0,
  },
  [BuildingType.Road]: {
    type: BuildingType.Road,
    cost: 5,
    name: 'Path',
    description: 'For zoomies.',
    color: '#d6d3d1', // stone-300
    popGen: 0,
    incomeGen: 0,
  },
  [BuildingType.Residential]: {
    type: BuildingType.Residential,
    cost: 80,
    name: 'Pet Condo',
    description: '+5 Pets/day',
    color: '#f472b6', // pink-400
    popGen: 5,
    incomeGen: 0,
  },
  [BuildingType.Commercial]: {
    type: BuildingType.Commercial,
    cost: 150,
    name: 'Treat Shop',
    description: '+15 Treats/day',
    color: '#38bdf8', // sky-400
    popGen: 0,
    incomeGen: 15,
  },
  [BuildingType.Industrial]: {
    type: BuildingType.Industrial,
    cost: 350,
    name: 'Toy Factory',
    description: '+40 Treats/day',
    color: '#facc15', // yellow-400
    popGen: 0,
    incomeGen: 40,
  },
  [BuildingType.Park]: {
    type: BuildingType.Park,
    cost: 60,
    name: 'Play Park',
    description: 'Tail wags.',
    color: '#a3e635', // lime-400
    popGen: 1,
    incomeGen: 0,
  },
  [BuildingType.Entertainment]: {
    type: BuildingType.Entertainment,
    cost: 500,
    name: 'Laser Dome',
    description: 'Ultimate fun.',
    color: '#c084fc', // purple-400
    popGen: 0,
    incomeGen: 60,
  },
  [BuildingType.Service]: {
    type: BuildingType.Service,
    cost: 400,
    name: 'Vet Clinic',
    description: 'Healthy pets.',
    color: '#f87171', // red-400
    popGen: 2,
    incomeGen: 10,
  }
};
