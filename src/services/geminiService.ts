import { GoogleGenAI, Type } from "@google/genai";
import { TravelPreferences, Itinerary } from "../types/travel";

let aiInstance: GoogleGenAI | null = null;
const getAI = () => {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined. Please ensure it is set in your environment.");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
};

export const generateItinerary = async (prefs: TravelPreferences): Promise<Itinerary> => {
  const ai = getAI();
  const prompt = `Plan a detailed day-wise travel itinerary for ${prefs.destination} from ${prefs.startDate} to ${prefs.endDate}.
  Budget level: ${prefs.budget}.
  Interests: ${prefs.interests.join(', ')}.
  Accessibility needs: ${prefs.accessibility.join(', ')}.
  Preferred transport: ${prefs.transportMode}.
  Number of travelers: ${prefs.travelersCount}.

  Provide a structured JSON response. 
  Ensure locations include realistic lat/lng coordinates.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          destination: { type: Type.STRING },
          startDate: { type: Type.STRING },
          endDate: { type: Type.STRING },
          totalBudget: { type: Type.NUMBER },
          estimatedCost: { type: Type.NUMBER },
          days: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.NUMBER },
                date: { type: Type.STRING },
                activities: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      time: { type: Type.STRING },
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                      location: {
                        type: Type.OBJECT,
                        properties: {
                          lat: { type: Type.NUMBER },
                          lng: { type: Type.NUMBER },
                          address: { type: Type.STRING }
                        }
                      },
                      duration: { type: Type.STRING },
                      costEstimate: { type: Type.NUMBER },
                      type: { type: Type.STRING }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  });
  
  const text = response.text;

  if (!text) {
    throw new Error("Failed to generate itinerary");
  }

  return JSON.parse(text) as Itinerary;
};
