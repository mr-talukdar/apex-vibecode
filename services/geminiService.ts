import { GoogleGenAI } from "@google/genai";
import { RideLevel, TerrainType } from "../types";

const createClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY is not set in process.env");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateRideAI = async (
  title: string,
  level: RideLevel,
  distance: number,
  elevation: number,
  terrain: TerrainType
): Promise<{ description: string; tips: string }> => {
  const ai = createClient();
  if (!ai) {
    return {
      description: "Join us for an exciting ride! (AI Key missing, using default text)",
      tips: "Check your tire pressure and fuel up.",
    };
  }

  const prompt = `
    I am creating a motorcycle group ride listing.
    Title: ${title}
    Group Level: ${level} (where A is aggressive sport riding, D is relaxed cruising)
    Distance: ${distance} miles
    Elevation Gain: ${elevation} feet
    Terrain Type: ${terrain}

    Please generate two things in a JSON format:
    1. "description": An exciting, energetic paragraph description of the ride (approx 40-60 words). Mention the ${terrain} (e.g., twisties, straights, off-road) specifically. Use motorcycling terminology (e.g., KSU, stagger formation, lean angle, ADV).
    2. "tips": A short, punchy safety tip or gear recommendation specific to this ride profile (e.g., wear leathers, bring rain gear, check chain).

    Return ONLY raw JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });
    
    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    const data = JSON.parse(text);
    return {
      description: data.description || "A great ride awaits!",
      tips: data.tips || "Ride safe!",
    };
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return {
      description: `Get ready for the ${title}! This ${distance} mile run will test your skills with ${elevation}ft of elevation on ${terrain} terrain.`,
      tips: "Full tank of gas before KSU!",
    };
  }
};