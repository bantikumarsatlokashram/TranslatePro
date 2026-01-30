import React, { useState } from 'react';
import { TranslationResponse, ChatMessage, Attachment } from '../types';
import { Copy, Volume2, Info, Check, Sparkles, Languages } from 'lucide-react';

interface MessageBubbleProps {
  message: ChatMessage;
}

const AttachmentView: React.FC<{ attachment: Attachment }> = ({ attachment }) => {
  if (attachment.type === 'image') {
    return (
      <img
        src={`data:${attachment.mimeType};base64,${attachment.content}`}
        alt="User upload"
        className="max-w-[200px] max-h-[200px] rounded-lg border border-slate-700 mt-2"
      />
    );
  }
  return (
    <div className="bg-slate-800 p-2 rounded mt-2 text-xs font-mono text-slate-400">
      📄 {attachment.name}
    </div>
  );
};

const ToneCard: React.FC<{ label: string; text: string; color: string }> = ({ label, text, color }) => (
  <div className={`flex flex-col p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-${color}-500/50 transition-colors`}>
    <span className={`text-xs font-bold uppercase tracking-wider mb-1 text-${color}-400`}>{label}</span>
    <p className="text-slate-200 text-sm">{text}</p>
  </div>
);

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = (text: string, lang?: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    if (lang) {
        // Try to map detection like "Spanish" to "es-ES" roughly if possible, 
        // or let browser auto-detect. 
        // For now, we rely on browser detection or just default.
    }
    window.speechSynthesis.speak(utterance);
  };

  if (isUser) {
    return (
      <div className="flex justify-end mb-6">
        <div className="bg-indigo-600 text-white p-4 rounded-2xl rounded-tr-sm max-w-[85%] shadow-lg">
          <p className="whitespace-pre-wrap">{message.content as string}</p>
          {message.attachments && message.attachments.map((att, i) => (
            <AttachmentView key={i} attachment={att} />
          ))}
        </div>
      </div>
    );
  }

  const data = message.content as TranslationResponse;

  return (
    <div className="flex justify-start mb-8 animate-fade-in-up">
      <div className="flex-shrink-0 mr-4">
        <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
      </div>

      <div className="flex-1 max-w-2xl">
        <div className="bg-slate-900 border border-slate-700 rounded-2xl rounded-tl-sm shadow-xl overflow-hidden">
            
          {/* Header: Original & Detected */}
          <div className="bg-slate-800/50 p-4 border-b border-slate-700 flex justify-between items-center">
             <div>
                <p className="text-xs text-slate-400 font-medium">Detected: <span className="text-emerald-400">{data.detectedLanguage}</span></p>
                <p className="text-slate-500 text-xs italic mt-1 line-clamp-1">"{data.original}"</p>
             </div>
             <div className="flex gap-2">
                <button 
                  onClick={() => handleSpeak(data.primaryTranslation)}
                  className="p-2 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition"
                  title="Listen"
                >
                    <Volume2 size={16} />
                </button>
                <button 
                    onClick={() => handleCopy(data.primaryTranslation)}
                    className="p-2 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition"
                    title="Copy"
                >
                    {copied ? <Check size={16} className="text-emerald-500"/> : <Copy size={16} />}
                </button>
             </div>
          </div>

          {/* Primary Translation */}
          <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800">
            <h2 className="text-2xl md:text-3xl font-light text-white leading-relaxed">
              {data.primaryTranslation}
            </h2>
            <div className="mt-2 flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Match: {data.confidence}
                </span>
            </div>
          </div>

          {/* Tones Grid */}
          <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-900/50">
            <ToneCard label="Formal" text={data.tones.formal} color="purple" />
            <ToneCard label="Casual" text={data.tones.casual} color="pink" />
            <ToneCard label="Simple" text={data.tones.simple} color="blue" />
          </div>

          {/* Alternatives & Notes */}
          {(data.alternatives.length > 0 || (data.culturalNote && data.culturalNote !== 'None')) && (
             <div className="p-4 bg-slate-950/30 border-t border-slate-800 space-y-3">
                {data.alternatives.length > 0 && (
                    <div>
                        <h4 className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                            <Languages size={12} /> Alternatives
                        </h4>
                        <ul className="list-disc list-inside text-sm text-slate-300 space-y-1 ml-1">
                            {data.alternatives.map((alt, i) => (
                                <li key={i}>{alt}</li>
                            ))}
                        </ul>
                    </div>
                )}
                
                {data.culturalNote && data.culturalNote !== 'None' && (
                    <div className="mt-3 bg-amber-500/5 border border-amber-500/20 p-3 rounded text-sm text-amber-200/80 flex gap-3">
                        <Info className="flex-shrink-0 w-4 h-4 mt-0.5 text-amber-500" />
                        <span>{data.culturalNote}</span>
                    </div>
                )}
             </div>
          )}
        </div>
      </div>
    </div>
  );
};