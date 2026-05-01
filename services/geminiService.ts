
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { GoogleGenAI, Type } from "@google/genai";
import { PetAvatar, PetStats, PetResponse } from "../types";

const modelId = 'gemini-2.5-flash';

const petResponseSchema = {
  type: Type.OBJECT,
  properties: {
    message: { type: Type.STRING, description: "A fun, expressive, charming response from the pet (with emojis)." },
    statChanges: {
      type: Type.OBJECT,
      properties: {
        hunger: { type: Type.INTEGER, description: "Change in hunger (-15 to 20)" },
        happiness: { type: Type.INTEGER, description: "Change in happiness (-10 to 25)" },
        energy: { type: Type.INTEGER, description: "Change in energy (-20 to 15)" },
        experience: { type: Type.INTEGER, description: "XP gained (0 to 50)" }
      }
    }
  },
  required: ["message", "statChanges"],
};

export const interactWithPet = async (
  avatar: PetAvatar,
  stats: PetStats,
  action: string,
  contextData?: string
): Promise<PetResponse | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  const context = `
    You are ${avatar.name}, a virtual pet. You are a ${avatar.stage} ${avatar.species}.
    Your personality is ${avatar.personality}. Your aesthetics are ${avatar.colorTheme}.
    Current stats: Hunger ${stats.hunger}%, Happiness ${stats.happiness}%, Energy ${stats.energy}%.
    Level: ${stats.level}.
    ${contextData ? `Extra Context: ${contextData}` : ''}
    
    Respond in character as the pet. Keep it short (1-2 sentences max, like a mobile game character). 
    Use emojis. If hunger is low, complain about food. If sleepy, act tired.
  `;

  const prompt = `The user clicked/said: "${action}". 
  Provide your dialogue reaction and determine how the stats change.`;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: `${context}\n${prompt}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: petResponseSchema,
        temperature: 0.8,
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as PetResponse;
    }
  } catch (error) {
    console.error("Error generating pet response:", error);
  }
  return null;
};

export const generatePetImage = async (species: string, theme: string): Promise<string | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  // Bright, casual mobile game style
  const prompt = `A highly polished, incredibly cute 2D game art style virtual pet. 
  Species: ${species}. Theme/Colors: ${theme}. 
  Thick clean outlines, vibrant colors, expressive large friendly eyes. 
  Solid white background. Studio Ghibli meets modern casual mobile game art. 
  Chibi style, full body, facing slightly forward, happy expression. Perfect lighting.`;
  
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-3.0-generate-002',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: "image/jpeg",
        aspectRatio: "1:1"
      }
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64 = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64}`;
    }
  } catch (error) {
    console.error("Error generating Pet image:", error);
  }
  return null;
};

