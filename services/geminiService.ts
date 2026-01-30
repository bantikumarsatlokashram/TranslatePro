import { GoogleGenAI, Type, Schema, Chat, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { Attachment, TranslationResponse } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const translationSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    original: { type: Type.STRING, description: "The original text provided by the user." },
    detectedLanguage: { type: Type.STRING, description: "The detected language of the input." },
    primaryTranslation: { type: Type.STRING, description: "The best, most natural translation." },
    tones: {
      type: Type.OBJECT,
      properties: {
        formal: { type: Type.STRING, description: "Formal business/official version." },
        casual: { type: Type.STRING, description: "Casual/social version." },
        simple: { type: Type.STRING, description: "Simplified version for children or beginners." },
      },
      required: ["formal", "casual", "simple"],
    },
    alternatives: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "2-3 alternative phrasings.",
    },
    culturalNote: { type: Type.STRING, description: "Explanation of idioms, culture, or context if applicable. Use 'None' if not applicable." },
    confidence: { type: Type.STRING, description: "Confidence percentage (e.g., '98%')." },
  },
  required: ["original", "detectedLanguage", "primaryTranslation", "tones", "alternatives", "culturalNote", "confidence"],
};

let chatSession: Chat | null = null;
let currentSessionLang: string | null = null;

export const getChatSession = (targetLang: string): Chat => {
  // Re-initialize session if target language changes to ensure system instruction context is fresh
  if (!chatSession || currentSessionLang !== targetLang) {
    chatSession = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: `${SYSTEM_INSTRUCTION}\n\nCurrent Target Language: ${targetLang}.`,
        responseMimeType: "application/json",
        responseSchema: translationSchema,
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_CIVIC_INTEGRITY, threshold: HarmBlockThreshold.BLOCK_NONE },
        ],
      },
    });
    currentSessionLang = targetLang;
  }
  return chatSession;
};

export const resetSession = () => {
  chatSession = null;
  currentSessionLang = null;
};

export const sendMessageToGemini = async (
  text: string,
  attachments: Attachment[],
  targetLanguage: string
): Promise<TranslationResponse> => {
  const chat = getChatSession(targetLanguage);
  
  const parts: any[] = [];
  
  // Add Text
  if (text) {
    parts.push({ text: `Translate to ${targetLanguage}: ${text}` });
  } else if (attachments.length > 0) {
     parts.push({ text: `Translate the content of this file to ${targetLanguage}.` });
  }

  // Add Attachments (Images)
  attachments.forEach((att) => {
    if (att.type === 'image') {
      parts.push({
        inlineData: {
          mimeType: att.mimeType,
          data: att.content,
        },
      });
    } else if (att.type === 'text') {
      parts.push({ text: `\n[File Content]: ${att.content}` });
    }
  });

  try {
    // CORRECTED: Use 'message' instead of 'parts'
    const response = await chat.sendMessage({
      message: parts.length > 0 ? parts : [{ text: "Hello" }], 
    });
    
    let responseText = response.text;
    
    // Check for safety block or empty response
    if (!responseText) {
        console.warn("Gemini Response Empty. Full response:", response);
        const finishReason = response.candidates?.[0]?.finishReason;
        
        return {
            original: text || "Input",
            detectedLanguage: "Unknown",
            primaryTranslation: `Translation could not be completed. (Reason: ${finishReason || "Unknown"})`,
            tones: {
                formal: "-",
                casual: "-",
                simple: "-"
            },
            alternatives: [],
            culturalNote: "The model blocked the response, likely due to safety filters.",
            confidence: "0%"
        };
    }

    // Cleanup Markdown code blocks if present
    responseText = responseText.trim();
    // Remove ```json at start (case insensitive, allowing whitespace)
    responseText = responseText.replace(/^```json\s*/i, "");
    // Remove ``` at start
    responseText = responseText.replace(/^```\s*/, "");
    // Remove ``` at end
    responseText = responseText.replace(/\s*```$/, "");

    // Extract JSON object if there's extra text
    const firstBrace = responseText.indexOf('{');
    const lastBrace = responseText.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
        responseText = responseText.substring(firstBrace, lastBrace + 1);
    }

    try {
      const jsonResponse = JSON.parse(responseText);
      return jsonResponse as TranslationResponse;
    } catch (parseError) {
      console.warn("JSON Parse Failed, falling back to raw text. Response:", responseText);
      // Fallback: return raw text as primary translation
      return {
        original: text || "File Content",
        detectedLanguage: "Unknown",
        primaryTranslation: responseText, // Return the raw text
        tones: {
          formal: "Not available",
          casual: "Not available",
          simple: "Not available"
        },
        alternatives: [],
        culturalNote: "Structured data parsing failed. Showing raw output.",
        confidence: "Low"
      };
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Return a structured error response instead of throwing, so the UI doesn't break
    return {
        original: text || "Input",
        detectedLanguage: "Unknown",
        primaryTranslation: "An error occurred while communicating with the AI service.",
        tones: { formal: "-", casual: "-", simple: "-" },
        alternatives: [],
        culturalNote: error instanceof Error ? error.message : "Unknown error",
        confidence: "0%"
    };
  }
};