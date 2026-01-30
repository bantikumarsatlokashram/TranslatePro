import React, { useState, useEffect, useRef } from 'react';
import { Globe2, History, Settings, Trash2 } from 'lucide-react';
import { LANGUAGES, QUICK_COMMANDS } from './constants';
import { ChatMessage, Attachment, TranslationResponse } from './types';
import { sendMessageToGemini, resetSession } from './services/geminiService';
import { MessageBubble } from './components/MessageBubble';
import { InputArea } from './components/InputArea';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [targetLang, setTargetLang] = useState('en'); // Default English
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (text: string, attachments: Attachment[]) => {
    const newUserMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      attachments,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setIsLoading(true);

    try {
      // Find the language name from code
      const langName = LANGUAGES.find(l => l.code === targetLang)?.name || targetLang;
      
      const response = await sendMessageToGemini(text, attachments, langName);
      
      const newAiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: response,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, newAiMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'model',
          content: {
              original: text,
              detectedLanguage: "Unknown",
              primaryTranslation: "Sorry, I encountered an error processing your request. Please try again.",
              tones: { formal: "-", casual: "-", simple: "-" },
              alternatives: [],
              culturalNote: "None",
              confidence: "0%"
          } as TranslationResponse,
          timestamp: Date.now()
      }
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickCommand = (cmd: string) => {
    handleSend(cmd, []);
  };

  const clearHistory = () => {
    setMessages([]);
    resetSession();
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans selection:bg-indigo-500/30">
      
      {/* Sidebar (Desktop only for demo simplicity) */}
      <div className="hidden md:flex flex-col w-64 border-r border-slate-800 bg-slate-950/50">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
                <Globe2 size={24} className="text-white" />
            </div>
            <h1 className="font-bold text-lg tracking-tight">Translate<span className="text-indigo-400">Pro</span></h1>
          </div>
          <p className="text-xs text-slate-500 mt-2">AI-Powered Universal Translator</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
           <div className="mb-6">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">Settings</h3>
                <div className="space-y-2">
                    <div className="px-2 py-2">
                        <label className="text-sm text-slate-300 block mb-2">Target Language</label>
                        <select 
                            value={targetLang} 
                            onChange={(e) => setTargetLang(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
                        >
                            {LANGUAGES.filter(l => l.code !== 'auto').map((lang) => (
                                <option key={lang.code} value={lang.code}>{lang.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
           </div>

           <div>
             <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">History</h3>
             <button onClick={clearHistory} className="w-full flex items-center gap-2 px-2 py-2 text-sm text-red-400 hover:bg-slate-900 rounded-lg transition-colors">
                <Trash2 size={16} /> Clear Conversation
             </button>
           </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
        
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-20">
            <div className="flex items-center gap-2">
                <Globe2 className="text-indigo-500" size={20} />
                <span className="font-bold">TranslatePro</span>
            </div>
            <select 
                value={targetLang} 
                onChange={(e) => setTargetLang(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg p-2"
            >
                {LANGUAGES.filter(l => l.code !== 'auto').map((lang) => (
                    <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
            </select>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-slate-500">
                <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center mb-6 animate-pulse border border-slate-800">
                    <Globe2 size={48} className="text-indigo-600 opacity-80" />
                </div>
                <h2 className="text-2xl font-semibold text-slate-300 mb-2">Hello, World.</h2>
                <p className="max-w-md text-sm mb-8">
                    I can translate text, images, and documents into 40+ languages with perfect tone and cultural awareness.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg w-full">
                    {QUICK_COMMANDS.map((cmd, i) => (
                        <button 
                            key={i} 
                            onClick={() => handleQuickCommand(cmd)}
                            className="p-3 bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800 rounded-xl text-sm transition-all"
                        >
                            "{cmd}"
                        </button>
                    ))}
                </div>
            </div>
          ) : (
            <>
                {messages.map((msg) => (
                    <MessageBubble key={msg.id} message={msg} />
                ))}
                {isLoading && (
                    <div className="flex items-center gap-3 text-slate-400 p-4 animate-pulse">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                        </div>
                        <span className="text-sm font-medium">Processing translation...</span>
                    </div>
                )}
            </>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input Area */}
        <div className="w-full z-10 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent pt-10">
          <InputArea onSend={handleSend} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default App;