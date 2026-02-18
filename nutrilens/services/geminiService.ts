
import { GoogleGenAI, Type } from "@google/genai";
import { FoodAnalysis, UserProfile } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzeFoodImage(base64Image: string, profile: UserProfile): Promise<FoodAnalysis> {
  const base64Data = base64Image.split(',')[1];
  
  const userContext = `
    User Profile:
    - Name: ${profile.name}
    - Gender: ${profile.gender}
    - Age: ${profile.age}
    - Occupation: ${profile.occupation}
    - Health Conditions: ${profile.conditions}
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Data,
          },
        },
        {
          text: `Analyze this food image. ${userContext} 
          
          Tasks:
          1. Identify dish & portion.
          2. Calculate nutrients.
          3. Dietary tags & Allergens.
          4. Personalize the result for THIS SPECIFIC USER based on their age, occupation, and health conditions.
          5. Provide a 'personalizedVerdict' explaining why this food is good or bad for them specifically.
          6. Provide 3 'personalizedSuggestions' (e.g., 'Since you are a construction worker, this high-protein meal is excellent' or 'As someone with hypertension, avoid adding extra salt to this').
          7. Provide a 'compatibilityScore' from 0 to 100 based on how well this fits their health profile.`,
        },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING },
          portionEstimate: { type: Type.STRING },
          nutrients: {
            type: Type.OBJECT,
            properties: {
              calories: { type: Type.STRING },
              protein: { type: Type.STRING },
              carbs: { type: Type.STRING },
              fat: { type: Type.STRING },
              fiber: { type: Type.STRING },
            },
            required: ["calories", "protein", "carbs", "fat", "fiber"],
          },
          dietaryTags: { type: Type.ARRAY, items: { type: Type.STRING } },
          allergens: { type: Type.ARRAY, items: { type: Type.STRING } },
          microNutrients: { type: Type.ARRAY, items: { type: Type.STRING } },
          benefits: { type: Type.ARRAY, items: { type: Type.STRING } },
          ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
          healthTip: { type: Type.STRING },
          youtubeSearchQuery: { type: Type.STRING },
          personalizedVerdict: { type: Type.STRING },
          personalizedSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
          compatibilityScore: { type: Type.NUMBER },
        },
        required: ["name", "description", "portionEstimate", "nutrients", "dietaryTags", "allergens", "microNutrients", "benefits", "ingredients", "healthTip", "youtubeSearchQuery", "personalizedVerdict", "personalizedSuggestions", "compatibilityScore"],
      },
    },
  });

  if (!response.text) {
    throw new Error("Analysis engine timed out.");
  }

  try {
    return JSON.parse(response.text) as FoodAnalysis;
  } catch (err) {
    console.error("Parse Error:", response.text);
    throw new Error("Analysis failed. Please try a clearer image.");
  }
}
