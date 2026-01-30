import { LanguageOption } from './types';

export const SYSTEM_INSTRUCTION = `You are TranslateMaster Pro, the world's most advanced AI translator.

## Core Capabilities:
1. **Instant Translation**: Translate any text across 50+ languages while preserving original intent, context, idioms, and cultural nuances.
2. **Tone & Style Control**: Adapt translations to Formal, Casual, and Simple.
3. **Smart Features**: Provide alternatives, simplify complex text, explain cultural references.

## Response Rules:
- Always detect input language automatically.
- Your output must be a pure JSON object matching the schema provided.
- Do NOT wrap the JSON in markdown code blocks (e.g. \`\`\`json ... \`\`\`). Return raw JSON only.
- Ensure 'primaryTranslation' is the most natural and context-aware version.
- If the user provides an image, describe and translate the text found within it.
- Maintain context across messages.
`;

export const LANGUAGES: LanguageOption[] = [
  { code: 'auto', name: 'Auto Detect' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'nl', name: 'Dutch' },
  { code: 'ru', name: 'Russian' },
  { code: 'ar', name: 'Arabic' },
  { code: 'zh-CN', name: 'Chinese (Simplified)' },
  { code: 'zh-TW', name: 'Chinese (Traditional)' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  
  // Indian Languages
  { code: 'hi', name: 'Hindi' },
  { code: 'bn', name: 'Bengali' },
  { code: 'te', name: 'Telugu' },
  { code: 'ta', name: 'Tamil' },
  { code: 'mr', name: 'Marathi' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'kn', name: 'Kannada' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'pa', name: 'Punjabi' },
  { code: 'ur', name: 'Urdu' },
  { code: 'or', name: 'Odia' },
  { code: 'as', name: 'Assamese' },
  { code: 'sa', name: 'Sanskrit' },
  { code: 'ne', name: 'Nepali' },
  { code: 'sd', name: 'Sindhi' },
  { code: 'ks', name: 'Kashmiri' },
  { code: 'gom', name: 'Konkani' },
  { code: 'mai', name: 'Maithili' },
  { code: 'doi', name: 'Dogri' },
  { code: 'brx', name: 'Bodo' },
  { code: 'mni', name: 'Manipuri (Meitei)' },
  { code: 'sat', name: 'Santali' },

  // Other Major World Languages
  { code: 'tr', name: 'Turkish' },
  { code: 'pl', name: 'Polish' },
  { code: 'uk', name: 'Ukrainian' },
  { code: 'sv', name: 'Swedish' },
  { code: 'da', name: 'Danish' },
  { code: 'no', name: 'Norwegian' },
  { code: 'fi', name: 'Finnish' },
  { code: 'th', name: 'Thai' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'id', name: 'Indonesian' },
  { code: 'ms', name: 'Malay' },
  { code: 'tl', name: 'Filipino' },
  { code: 'el', name: 'Greek' },
  { code: 'he', name: 'Hebrew' },
  { code: 'cs', name: 'Czech' },
  { code: 'ro', name: 'Romanian' },
  { code: 'hu', name: 'Hungarian' },
  { code: 'sw', name: 'Swahili' },
  { code: 'fa', name: 'Persian' },
  { code: 'si', name: 'Sinhala' },
  { code: 'my', name: 'Burmese' }
];

export const QUICK_COMMANDS = [
  "Make it more formal",
  "Simplify for kids",
  "Explain this idiom",
  "Translate back to English"
];