import { GoogleGenAI, Type } from "@google/genai";
import { KeywordOpportunity } from "../types";

// Helper to sanitize JSON strings if the model returns markdown code blocks
const cleanJsonString = (str: string): string => {
  return str.replace(/```json\n?|```/g, '').trim();
};

export const generateKeywordAnalysis = async (
  niche: string,
  apiKey: string
): Promise<KeywordOpportunity[]> => {
  if (!apiKey) throw new Error("API Key is required");

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Analyze the niche "${niche}" for Presearch keyword staking opportunities.
    Generate 15-20 specific, high-intent keywords relevant to this niche.
    
    For each keyword, ESTIMATE the following based on general SEO knowledge (simulating Ahrefs data):
    1. Search Volume (monthly).
    2. CPC (Cost Per Click in USD).
    3. Keyword Difficulty (0-100).
    
    Then, ESTIMATE the current Presearch staking environment (simulating Presearch API data):
    1. Current PRE Staked (amount of tokens staked, usually between 100 and 100,000).
    2. Whether it is likely "Available" (low competition) or "Taken" (high competition).
    
    Calculate an "Opportunity Score" (0-100) where high volume + high CPC + low difficulty + low current staked = High Score.
    
    Return the data as a JSON array.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              keyword: { type: Type.STRING },
              searchVolume: { type: Type.INTEGER },
              cpc: { type: Type.NUMBER },
              keywordDifficulty: { type: Type.INTEGER },
              currentPreStaked: { type: Type.INTEGER },
              isAvailable: { type: Type.BOOLEAN },
              opportunityScore: { type: Type.INTEGER },
              topStaker: { type: Type.STRING, description: "A simulated username of the top staker" },
              category: { type: Type.STRING }
            },
            required: ["keyword", "searchVolume", "cpc", "keywordDifficulty", "currentPreStaked", "opportunityScore"]
          }
        }
      }
    });

    const jsonStr = cleanJsonString(response.text || "[]");
    const data = JSON.parse(jsonStr);

    // Add client-side IDs
    return data.map((item: any, index: number) => ({
      ...item,
      id: `gen-${index}-${Date.now()}`
    }));

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate keyword analysis. Please check your API key.");
  }
};

export const analyzeCsvData = async (
  csvText: string,
  apiKey: string
): Promise<KeywordOpportunity[]> => {
    if (!apiKey) throw new Error("API Key is required");

    const ai = new GoogleGenAI({ apiKey });

    // We send a sample of the CSV to the AI to parse and enrich with "Presearch" simulated data
    // In a real python app, this would query the Presearch API. Here we simulate that enrichment.
    const prompt = `
      I have a CSV export of SEO keywords (Source: Ahrefs/SEMrush).
      
      CSV Content (truncated sample):
      ${csvText.substring(0, 5000)}
      
      Task:
      1. Parse this CSV data.
      2. For the top 15 keywords found, add simulated Presearch Staking data (Current PRE Staked, Availability).
      3. Calculate an Opportunity Score based on Volume/CPC vs Competition.
      
      Return a JSON array of objects matching the schema.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            keyword: { type: Type.STRING },
                            searchVolume: { type: Type.INTEGER },
                            cpc: { type: Type.NUMBER },
                            keywordDifficulty: { type: Type.INTEGER },
                            currentPreStaked: { type: Type.INTEGER },
                            isAvailable: { type: Type.BOOLEAN },
                            opportunityScore: { type: Type.INTEGER },
                            topStaker: { type: Type.STRING },
                            category: { type: Type.STRING }
                        }
                    }
                }
            }
        });
        
        const jsonStr = cleanJsonString(response.text || "[]");
        const data = JSON.parse(jsonStr);
        return data.map((item: any, index: number) => ({
            ...item,
            id: `csv-${index}-${Date.now()}`
        }));

    } catch (error) {
        console.error("Gemini CSV Analysis Error", error);
        throw new Error("Failed to analyze CSV data.");
    }
}
