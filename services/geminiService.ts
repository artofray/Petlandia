
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { GoogleGenAI, Type } from "@google/genai";
import { AIGoal, BuildingType, CityStats, Grid, NewsItem, PetAvatar } from "../types";
import { BUILDINGS } from "../constants";

const modelId = 'gemini-2.5-flash';

// --- Goal Generation ---

const goalSchema = {
  type: Type.OBJECT,
  properties: {
    description: {
      type: Type.STRING,
      description: "A short, cute, and funny description of the goal from the perspective of a Pet Mayor.",
    },
    targetType: {
      type: Type.STRING,
      enum: ['population', 'money', 'building_count'],
      description: "The metric to track.",
    },
    targetValue: {
      type: Type.INTEGER,
      description: "The target numeric value to reach.",
    },
    buildingType: {
      type: Type.STRING,
      enum: [
        BuildingType.Residential, 
        BuildingType.Commercial, 
        BuildingType.Industrial, 
        BuildingType.Park, 
        BuildingType.Entertainment,
        BuildingType.Service,
        BuildingType.Road
      ],
      description: "Required if targetType is building_count.",
    },
    reward: {
      type: Type.INTEGER,
      description: "Treat (money) reward for completion.",
    },
  },
  required: ['description', 'targetType', 'targetValue', 'reward'],
};

export const generateCityGoal = async (stats: CityStats, grid: Grid): Promise<AIGoal | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  // Count buildings
  const counts: Record<string, number> = {};
  grid.flat().forEach(tile => {
    counts[tile.buildingType] = (counts[tile.buildingType] || 0) + 1;
  });

  const context = `
    You are the "Mayor Whiskers" or "Director Doggo", the AI City Paw-lanner for "Petlandia".
    Current City Stats:
    Day: ${stats.day}
    Level: ${stats.level}
    Treats: ${stats.money}
    Pets: ${stats.population}
    Buildings: ${JSON.stringify(counts)}
  `;

  const prompt = `Generate a new goal for the player. Use pet puns. Return JSON.`;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: `${context}\n${prompt}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: goalSchema,
        temperature: 0.8,
      },
    });

    if (response.text) {
      const goalData = JSON.parse(response.text) as Omit<AIGoal, 'completed'>;
      return { ...goalData, completed: false };
    }
  } catch (error) {
    console.error("Error generating goal:", error);
  }
  return null;
};

// --- News Feed Generation ---

const newsSchema = {
  type: Type.OBJECT,
  properties: {
    text: { type: Type.STRING, description: "A one-sentence funny news headline." },
    type: { type: Type.STRING, enum: ['positive', 'negative', 'neutral'] },
  },
  required: ['text', 'type'],
};

export const generateNewsEvent = async (stats: CityStats, recentAction: string | null): Promise<NewsItem | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const context = `Petlandia Stats - Pets: ${stats.population}, Money: ${stats.money}, Day: ${stats.day}.`;
  const prompt = "Generate a very short, funny news headline about the city. Topics: Zoomies, treats, naps, squirrels.";

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: `${context}\n${prompt}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: newsSchema,
        temperature: 1.0, 
      },
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      return {
        id: Date.now().toString() + Math.random(),
        text: data.text,
        type: data.type,
      };
    }
  } catch (error) {
    // Fail silently in UI, log to console
    console.warn("News generation skipped due to error:", error);
  }
  return null;
};

// --- Pet Thought Generation (Translation) ---

const thoughtSchema = {
  type: Type.OBJECT,
  properties: {
    thought: { type: Type.STRING, description: "The translated thought of the pet in English." },
  },
  required: ['thought'],
};

export const generatePetThought = async (stats: CityStats, avatar: PetAvatar): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
    You are ${avatar.name}, a ${avatar.species} who runs Petlandia.
    The city has ${stats.population} pets and ${stats.money} treats.
    The player has reached Level ${stats.level} (Master of Understanding).
    
    Say something wise, funny, or chaotic about the state of the city in one short sentence. 
    If you are an imaginary pet (Dragon/Ghost/Rock), be thematic.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: thoughtSchema,
        temperature: 0.9,
      },
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      return data.thought;
    }
  } catch (error) {
    console.error("Error generating thought:", error);
    return "The translation device is fuzzy...";
  }
  return "...";
};
