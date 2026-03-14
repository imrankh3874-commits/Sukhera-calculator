import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

export function AIChat({ currentExpression }: { currentExpression: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const model = ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: [
          {
            role: 'user',
            parts: [{ text: `Current calculator expression: ${currentExpression}\n\nUser Question: ${userMessage}` }]
          }
        ],
        config: {
          systemInstruction: "You are a mathematical expert assistant for a scientific calculator. Help the user solve complex problems, explain mathematical concepts, or interpret the current expression on their calculator. Keep responses concise but thorough. Use LaTeX-style notation for math where appropriate.",
        }
      });

      const response = await model;
      setMessages(prev => [...prev, { role: 'ai', content: response.text || "I'm sorry, I couldn't process that." }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'ai', content: "Error connecting to AI. Please check your connection." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#151619] border-l border-[#2a2b2e] text-white font-sans">
      <div className="p-4 border-bottom border-[#2a2b2e] flex items-center gap-2 bg-[#1a1b1e]">
        <Sparkles className="w-4 h-4 text-emerald-400" />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-emerald-400/80">AI Assistant</h2>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-[#2a2b2e]">
        {messages.length === 0 && (
          <div className="text-center py-10 opacity-50">
            <Bot className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-sm italic">Ask me about math concepts, formulas, or how to solve your current expression.</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "flex gap-3 max-w-[90%]",
              msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
              msg.role === 'ai' ? "bg-emerald-500/10 text-emerald-400" : "bg-zinc-700 text-zinc-300"
            )}>
              {msg.role === 'ai' ? <Bot size={16} /> : <User size={16} />}
            </div>
            <div className={cn(
              "p-3 rounded-2xl text-sm leading-relaxed",
              msg.role === 'ai' ? "bg-[#1a1b1e] border border-[#2a2b2e]" : "bg-emerald-600 text-white"
            )}>
              {msg.content}
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Loader2 size={16} className="animate-spin" />
            </div>
            <div className="p-3 rounded-2xl bg-[#1a1b1e] border border-[#2a2b2e]">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-400/50 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-emerald-400/50 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-emerald-400/50 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-[#1a1b1e] border-t border-[#2a2b2e]">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask AI..."
            className="w-full bg-[#151619] border border-[#2a2b2e] rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-emerald-400 hover:text-emerald-300 disabled:opacity-30 transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
