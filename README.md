# TranslateMaster Pro 🌍

TranslateMaster Pro is an advanced, AI-powered universal translator application built with React, TypeScript, and the Google Gemini API. It supports over 50 languages—including comprehensive support for Indian languages—and provides context-aware translations with tone control, cultural notes, and multimodal capabilities.

![TranslateMaster Pro](https://placehold.co/1200x600/0f172a/6366f1?text=TranslateMaster+Pro)

## ✨ Key Features

- **50+ Languages Supported**: Extensive support for global languages and major Indian languages (Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati, etc.).
- **Context-Aware Translation**: Preserves original intent, idioms, and nuances.
- **Tone & Style Control**: Get translations in multiple styles simultaneously:
  - 👔 **Formal** (Business/Official)
  - 😎 **Casual** (Social/Friends)
  - 👶 **Simple** (Kids/Beginners)
- **Multimodal Input**:
  - 📝 **Text**: Type or paste text.
  - 📸 **Images**: Upload images (menus, signs, documents) for OCR + Translation.
  - 🎤 **Voice**: Real-time speech-to-text input.
- **Smart Insights**:
  - **Alternatives**: Provides 2-3 different ways to phrase the translation.
  - **Cultural Notes**: Explains idioms or cultural context relevant to the translation.
- **Modern UI**: Dark-themed, responsive design built with Tailwind CSS.

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS
- **AI Engine**: Google Gemini API (`gemini-3-flash-preview`) via `@google/genai` SDK
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- A Google Gemini API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/bantikumarsatlokashram/TranslatePro.git
   cd TranslatePro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API Key**
   Create a `.env` file in the root directory and add your Google GenAI API key:
   ```env
   API_KEY=your_google_api_key_here
   ```

4. **Run the application**
   ```bash
   npm start
   ```

## 🎮 Usage Guide

1. **Select Target Language**: Use the sidebar (desktop) or top bar (mobile) to choose the language you want to translate into. English is selected by default.
2. **Input Content**:
   - Type text in the input box.
   - Click the **Mic** icon to speak.
   - Click the **Paperclip** icon to upload an image containing text.
3. **Send**: Press Enter or click the Send button.
4. **View Results**: The AI will return the primary translation, along with formal/casual variations, alternative phrasings, and cultural notes if applicable.

## 🇮🇳 Supported Indian Languages

TranslateMaster Pro includes native support for:
Assamese, Bengali, Bodo, Dogri, Gujarati, Hindi, Kannada, Kashmiri, Konkani, Maithili, Malayalam, Manipuri, Marathi, Nepali, Odia, Punjabi, Sanskrit, Santali, Sindhi, Tamil, Telugu, and Urdu.

## 🔒 Privacy & Permissions

- **Microphone**: Required only if you use the voice input feature.
- **Data**: Text and images are sent directly to the Google Gemini API for processing. No data is stored on our servers.

## 📄 License

MIT License - feel free to use and modify!
