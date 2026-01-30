export interface TranslationResponse {
  original: string;
  detectedLanguage: string;
  primaryTranslation: string;
  tones: {
    formal: string;
    casual: string;
    simple: string;
  };
  alternatives: string[];
  culturalNote: string;
  confidence: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string | TranslationResponse;
  attachments?: Attachment[];
  timestamp: number;
}

export interface Attachment {
  type: 'image' | 'text' | 'pdf';
  content: string; // base64 or text content
  mimeType: string;
  name: string;
}

export interface LanguageOption {
  code: string;
  name: string;
}