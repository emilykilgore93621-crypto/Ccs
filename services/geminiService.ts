import { GoogleGenAI, ChatSession, GenerativeModel } from "@google/genai";
import { Message, Language } from '../types';

let genAI: GoogleGenAI | null = null;
let chatSession: ChatSession | null = null;

// Initialize the API client
const getGenAI = () => {
  if (!genAI) {
    if (!process.env.API_KEY) {
      console.error("API_KEY is missing from environment variables");
      throw new Error("API Key missing");
    }
    genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return genAI;
};

// Start or retrieve a chat session
export const getChatSession = async (systemInstruction?: string): Promise<ChatSession> => {
  if (!chatSession) {
    const ai = getGenAI();
    chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemInstruction || "You are an expert master carpenter and woodworking teacher. You are helpful, practical, and prioritize safety. You provide concise, rustic, and encouraging advice.",
      },
    });
  }
  return chatSession;
};

// Send a message to the AI
export const sendMessageToGemini = async (text: string): Promise<string> => {
  try {
    const session = await getChatSession();
    const result = await session.sendMessage({ message: text });
    return result.text || "I'm sorry, I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    return "There was an error connecting to the workshop assistant. Please check your connection.";
  }
};

// Translate text using a fresh model instance (stateless)
export const translateContent = async (text: string, targetLanguage: Language): Promise<string> => {
  const ai = getGenAI();
  
  const languageNames: Record<Language, string> = {
    en: 'English',
    es: 'Spanish',
    fr: 'French',
    de: 'German',
  };

  const targetLangName = languageNames[targetLanguage];

  const prompt = `
    You are a professional translator for a technical woodworking book. 
    Translate the following text into ${targetLangName}.
    Maintain the formatting (Markdown), tone (rustic, authoritative yet accessible), and technical accuracy.
    
    Text to translate:
    ${text}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || text;
  } catch (error) {
    console.error("Translation error:", error);
    return text; // Fallback to original
  }
};