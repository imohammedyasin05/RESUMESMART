import { GoogleGenAI, Type } from "@google/genai";

// AI Initialization - Uses the platform-shimmed process.env.GEMINI_API_KEY
const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set. Please check the Secrets panel in AI Studio.");
  }
  return new GoogleGenAI({ apiKey });
};

export async function analyzeResume(resumeText: string, targetRole: string, jobDescription: string) {
  const ai = getAI();
  const prompt = `
    You are an expert ATS (Applicant Tracking System) specialist.
    Analyze this resume for the role: ${targetRole}

    Job Description:
    ${jobDescription}

    Return:
    * ATS score (number 0-100)
    * Missing keywords from the job description (array of strings)
    * Weak sections/weaknesses (array of strings)
    * Specific suggestions to improve (array of strings)
    
    Resume Content:
    ${resumeText}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            missing_keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["score", "missing_keywords", "weaknesses", "suggestions"],
        },
      },
    });

    if (!response.text) {
      throw new Error("Empty response from Gemini");
    }

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    if (error instanceof Error && (error.message.includes("API_KEY_INVALID") || error.message.includes("403"))) {
       throw new Error("Invalid or missing API Key. Please check the Settings > Secrets panel in AI Studio.");
    }
    throw error;
  }
}

export async function improveResume(resumeText: string, targetRole: string, jobDescription: string) {
  const ai = getAI();
  const prompt = `
    Rewrite this resume for the role: ${targetRole}

    Based on this job description:
    ${jobDescription}

    Make it:
    - ATS optimized
    - Keyword-rich (match job description)
    - Strong action verbs
    - Quantified achievements

    Return ONLY the clean, improved resume text. NO meta-commentary, NO JSON, NO introductory text.

    Original Resume Detail:
    ${resumeText}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    if (!response.text) {
      throw new Error("Empty response from Gemini");
    }

    return response.text;
  } catch (error) {
    console.error("Gemini Improvement Error:", error);
    if (error instanceof Error && (error.message.includes("API_KEY_INVALID") || error.message.includes("403"))) {
       throw new Error("Invalid or missing API Key. Please check the Settings > Secrets panel in AI Studio.");
    }
    throw error;
  }
}
