import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Paperclip, X, StopCircle, Image as ImageIcon } from 'lucide-react';
import { Attachment } from '../types';

interface InputAreaProps {
  onSend: (text: string, attachments: Attachment[]) => void;
  isLoading: boolean;
}

export const InputArea: React.FC<InputAreaProps> = ({ onSend, isLoading }) => {
  const [text, setText] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [text]);

  const handleSend = () => {
    if ((!text.trim() && attachments.length === 0) || isLoading) return;
    onSend(text, attachments);
    setText('');
    setAttachments([]);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        if (event.target?.result) {
          const base64String = (event.target.result as string).split(',')[1];
          const type = file.type.startsWith('image/') ? 'image' : 'text';
          
          setAttachments(prev => [...prev, {
            type,
            content: base64String, // For images we store base64, for text we might decode later or send as is
            mimeType: file.type,
            name: file.name
          }]);
        }
      };

      if (file.type.startsWith('image/')) {
        reader.readAsDataURL(file);
      } else {
        // For simple text files
        const textReader = new FileReader();
        textReader.onload = (ev) => {
            const content = ev.target?.result as string;
             setAttachments(prev => [...prev, {
                type: 'text',
                content: content,
                mimeType: file.type,
                name: file.name
              }]);
        }
        textReader.readAsText(file);
      }
    }
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      // Logic to stop handled by 'end' event usually, but we force stop in UI state
      return;
    }

    if (!('webkitSpeechRecognition' in window)) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US'; // Defaulting to English input for UI simplicity, could be dynamic

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setText(prev => prev ? `${prev} ${transcript}` : transcript);
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-6">
        {/* Attachments Preview */}
        {attachments.length > 0 && (
            <div className="flex gap-2 mb-2 overflow-x-auto pb-2">
                {attachments.map((att, i) => (
                    <div key={i} className="relative group flex items-center gap-2 bg-slate-800 px-3 py-2 rounded-lg border border-slate-700">
                        {att.type === 'image' ? <ImageIcon size={14} className="text-purple-400"/> : <Paperclip size={14} className="text-blue-400"/>}
                        <span className="text-xs text-slate-300 max-w-[100px] truncate">{att.name}</span>
                        <button 
                            onClick={() => removeAttachment(i)}
                            className="absolute -top-1 -right-1 bg-red-500 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X size={10} className="text-white"/>
                        </button>
                    </div>
                ))}
            </div>
        )}

      <div className="relative flex items-end gap-2 bg-slate-800/80 backdrop-blur-md p-2 rounded-3xl border border-slate-700 shadow-2xl focus-within:ring-2 focus-within:ring-indigo-500/50 transition-all">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-3 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full transition-colors flex-shrink-0"
          title="Upload file or image"
        >
          <Paperclip size={20} />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*, .txt"
          onChange={handleFileChange}
        />

        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type, paste text, or upload an image..."
          className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 p-3 max-h-48 min-h-[48px] focus:outline-none resize-none overflow-y-auto"
          rows={1}
        />

        <button
          onClick={toggleListening}
          className={`p-3 rounded-full transition-all flex-shrink-0 ${
            isListening 
              ? 'bg-red-500/20 text-red-500 animate-pulse' 
              : 'text-slate-400 hover:text-white hover:bg-slate-700'
          }`}
          title="Voice Input"
        >
            {isListening ? <StopCircle size={20}/> : <Mic size={20} />}
        </button>

        <button
          onClick={handleSend}
          disabled={(!text.trim() && attachments.length === 0) || isLoading}
          className={`p-3 rounded-full transition-all flex-shrink-0 ${
            (!text.trim() && attachments.length === 0) || isLoading
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
          }`}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};