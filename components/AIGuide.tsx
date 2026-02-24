import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, Mic, Loader2, Sparkles, Trash2, Paperclip, FileText } from 'lucide-react';
import { Message, Language } from '../types';
import { sendMessageToGemini } from '../services/geminiService';

interface AIGuideProps {
  language: Language;
}

const STORAGE_KEY = 'practical_country_skills_chat_history';

const AIGuide: React.FC<AIGuideProps> = ({ language }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Initialize messages from localStorage or default
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Hydrate dates since JSON turns them into strings
          return parsed.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
        } catch (error) {
          console.error("Failed to parse chat history:", error);
        }
      }
    }
    return [{ 
      id: 'welcome', 
      role: 'model', 
      text: "Greetings! I'm your workshop assistant. Ask me about tools, wood types, or help with your current project.", 
      timestamp: new Date() 
    }];
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachment, setAttachment] = useState<{ name: string; content: string } | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  // Persist messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) { // 1MB limit for text files
       alert("File is too large. Please upload a text file smaller than 1MB.");
       return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setAttachment({
          name: file.name,
          content: event.target.result
        });
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  const handleSend = async () => {
    if ((!input.trim() && !attachment) || isLoading) return;

    const currentInput = input;
    const currentAttachment = attachment;

    // What we show in the UI history (keep it clean)
    let displayText = currentInput;
    if (currentAttachment) {
      displayText = currentInput 
        ? `${currentInput}\n\n[Attached File: ${currentAttachment.name}]`
        : `[Attached File: ${currentAttachment.name}]`;
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: displayText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setAttachment(null);
    setIsLoading(true);

    // What we send to the AI (full context)
    let apiPrompt = currentInput;
    if (currentAttachment) {
      apiPrompt = `${currentInput}\n\n--- Start of attached file: ${currentAttachment.name} ---\n${currentAttachment.content}\n--- End of attached file ---`;
    }

    // Contextualize the prompt with language preference
    const contextPrompt = language === 'en' 
      ? apiPrompt 
      : `(Please reply in ${language}) ${apiPrompt}`;

    const responseText = await sendMessageToGemini(contextPrompt);

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear your chat history?")) {
      const defaultMsg: Message = { 
        id: 'welcome', 
        role: 'model', 
        text: "Greetings! I'm your workshop assistant. History has been cleared.", 
        timestamp: new Date() 
      };
      setMessages([defaultMsg]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-amber-600 text-white p-4 rounded-full shadow-lg hover:bg-amber-700 transition-all duration-300 hover:scale-110 z-50 group flex items-center gap-2"
        >
          <Sparkles className="w-6 h-6 animate-pulse" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap font-medium pl-1">
            Ask the Expert
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] h-[550px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-stone-200 animate-in slide-in-from-bottom-10 fade-in duration-300">
          
          {/* Header */}
          <div className="bg-stone-900 text-white p-4 rounded-t-2xl flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Workshop Guide</h3>
                <p className="text-xs text-stone-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  AI Active • Gemini
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={handleClearHistory} 
                title="Clear History"
                className="text-stone-400 hover:text-red-400 p-1 rounded-full hover:bg-white/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setIsOpen(false)} 
                title="Close"
                className="text-stone-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`
                    max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed
                    ${msg.role === 'user' 
                      ? 'bg-amber-600 text-white rounded-br-sm' 
                      : 'bg-white text-stone-800 border border-stone-200 shadow-sm rounded-bl-sm'}
                  `}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-bl-sm border border-stone-200 shadow-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
                  <span className="text-xs text-stone-500">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-stone-200 rounded-b-2xl">
            
            {/* Attachment Preview */}
            {attachment && (
              <div className="mb-2 flex items-center gap-2 bg-stone-100 p-2 rounded-lg text-xs text-stone-600 border border-stone-200 animate-in fade-in slide-in-from-bottom-2">
                <FileText className="w-4 h-4 text-amber-600" />
                <span className="truncate max-w-[200px] font-medium">{attachment.name}</span>
                <button onClick={() => setAttachment(null)} className="ml-auto hover:text-red-500 p-1">
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            <div className="flex items-center gap-2 bg-stone-100 rounded-full px-4 py-2 border border-stone-200 focus-within:ring-2 focus-within:ring-amber-500/50 focus-within:border-amber-500 transition-all">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-1.5 -ml-2 text-stone-400 hover:text-amber-600 hover:bg-stone-200 rounded-full transition-colors"
                title="Attach text file"
              >
                <Paperclip className="w-4 h-4" />
              </button>
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden"
                accept=".txt,.md,.json,.csv,.js,.ts"
                onChange={handleFileSelect}
              />
              
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about joinery..."
                className="flex-1 bg-transparent outline-none text-stone-800 placeholder-stone-400 text-sm"
              />
              <button 
                onClick={handleSend}
                disabled={(!input.trim() && !attachment) || isLoading}
                className="text-amber-600 disabled:text-stone-300 hover:text-amber-700 transition-colors p-1"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-[10px] text-center text-stone-400 mt-2">
              AI can make mistakes. Check important safety info.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default AIGuide;