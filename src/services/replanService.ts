import { GoogleGenAI, Type } from "@google/genai";
import { Itinerary } from "../types/travel";

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

export const updateItinerary = async (currentItinerary: Itinerary, instruction: string): Promise<Itinerary> => {
  const ai = getAI();
  const prompt = `Adjust the following itinerary based on this instruction: "${instruction}"
  
  Current Itinerary: ${JSON.stringify(currentItinerary)}
  
  Return the fully updated itinerary JSON.`;

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
    throw new Error("Failed to update itinerary");
  }

  return JSON.parse(text) as Itinerary;
};
