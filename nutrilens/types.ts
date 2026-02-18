
export interface Nutrients {
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  fiber: string;
}

export interface UserProfile {
  name: string;
  gender: string;
  age: string;
  occupation: string;
  conditions: string;
}

export interface FoodAnalysis {
  name: string;
  description: string;
  portionEstimate: string;
  nutrients: Nutrients;
  dietaryTags: string[];
  allergens: string[];
  microNutrients: string[];
  benefits: string[];
  ingredients: string[];
  healthTip: string;
  youtubeSearchQuery: string;
  // Personalization fields
  personalizedVerdict: string;
  personalizedSuggestions: string[];
  compatibilityScore: number; // 0-100
}

export interface AnalysisState {
  isLoading: boolean;
  result: FoodAnalysis | null;
  error: string | null;
  capturedImage: string | null;
}
