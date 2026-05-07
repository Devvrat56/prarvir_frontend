import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, Sparkles, Phone, Mail, ShoppingBag, Info, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/chat`, {
        message: input,
        api_key: apiKey || undefined
      });

      const botMessage = {
        role: 'assistant',
        content: response.data.response,
        context: response.data.context
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Error: ${error.response?.data?.detail || 'Failed to connect to backend'}`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden text-gray-200">
      {/* Sidebar */}
      <aside className="w-80 bg-[#0a0a1a] border-r border-white/5 flex flex-col hidden md:flex">
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d57eeb] to-[#fccb90] flex items-center justify-center shadow-lg">
              <Sparkles className="text-black w-5 h-5" />
            </div>
            <h1 className="text-xl font-serif font-bold text-gradient">Hair Cider</h1>
          </div>
          
          <div className="space-y-4">
            <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Settings</label>
            <input 
              type="password" 
              placeholder="Groq API Key (Optional)"
              className="w-full bg-[#161625] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-luxury-accent transition-all"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 p-8 space-y-8 overflow-y-auto">
          <div>
            <label className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-4 block">Capabilities</label>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                <ShoppingBag size={18} /> Product Recommendations
              </li>
              <li className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                <Info size={18} /> Service Information
              </li>
              <li className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                <Phone size={18} /> Support Escalation
              </li>
            </ul>
          </div>

          <div className="glass-panel p-4 rounded-2xl border-luxury-accent/20">
            <h3 className="text-sm font-bold text-luxury-gold mb-2 flex items-center gap-2">
              <Phone size={14} /> Need Help?
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Our specialists are available 9 AM - 6 PM at <span className="text-white">+1-800-HAIRCIDER</span>
            </p>
          </div>
        </div>

        <div className="p-8 border-t border-white/5">
          <button 
            onClick={() => setMessages([])}
            className="w-full flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-gray-500 hover:text-red-400 transition-colors py-2"
          >
            <Trash2 size={14} /> Clear Chat History
          </button>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col relative bg-transparent">
        {/* Header (Mobile only) */}
        <header className="md:hidden p-4 border-b border-white/5 flex items-center justify-between">
          <h1 className="text-lg font-serif font-bold text-gradient">Hair Cider</h1>
          <Sparkles className="text-luxury-accent w-5 h-5" />
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 custom-scrollbar">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto space-y-10">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-[#d57eeb]/20 to-[#fccb90]/20 flex items-center justify-center mb-4 border border-white/10 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/5 blur-xl" />
                <Bot size={60} className="text-luxury-accent relative z-10" />
              </motion.div>
              
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-gradient tracking-tight">How can I help you today?</h2>
                <p className="text-gray-400 text-lg leading-relaxed max-w-lg mx-auto">
                  Experience Hair Cider. Ask me about our premium collections, styling services, or order support.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full px-4">
                {[
                  { q: 'List Natural Curl Closures', icon: <ShoppingBag size={18} /> },
                  { q: 'Show Loose Curly Extensions', icon: <Sparkles size={18} /> },
                  { q: 'Support & Escalation', icon: <Phone size={18} /> },
                  { q: 'Salon Services List', icon: <Info size={18} /> }
                ].map((item) => (
                  <button 
                    key={item.q}
                    onClick={() => setInput(item.q)}
                    className="glass-panel group p-5 rounded-2xl text-left hover:border-luxury-accent/40 transition-all flex items-center gap-4 border-white/5"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-luxury-accent/10 transition-colors">
                      <span className="text-luxury-accent">{item.icon}</span>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white mb-1">{item.q}</div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-widest">Quick Inquiry</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot size={18} className="text-luxury-accent" />
                  </div>
                )}
                
                <div className={`max-w-[85%] md:max-w-[75%] space-y-3 relative`}>
                  <div className={`p-5 ${
                    msg.role === 'user' 
                    ? 'user-bubble' 
                    : 'bot-bubble'
                  }`}>
                    {/* Render message content - Text Only. Strips any stray markdown images. */}
                    <div className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">
                      {msg.content.replace(/\!\[.*?\]\(.*?\)/g, '')}
                    </div>
                  </div>

                  {msg.context && msg.context.length > 0 && (
                    <div className="px-1">
                      <details className="group">
                        <summary className="text-[10px] text-gray-600 cursor-pointer hover:text-luxury-accent transition-colors flex items-center gap-1 list-none uppercase tracking-widest font-bold">
                          <Info size={10} /> Reference Data
                        </summary>
                        <div className="mt-3 space-y-2">
                          {msg.context.map((doc, i) => (
                            <div key={i} className="bg-black/40 rounded-lg p-3 border border-white/5 text-[11px]">
                              <div className="text-luxury-gold mb-1 font-bold">{doc.title || doc.name}</div>
                              <div className="text-gray-500 line-clamp-2">{doc.description || `Category: ${doc.product_type || doc.category}`}</div>
                            </div>
                          ))}
                        </div>
                      </details>
                    </div>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="w-10 h-10 rounded-full bg-luxury-accent/20 border border-luxury-accent/30 flex items-center justify-center flex-shrink-0 mt-1">
                    <User size={18} className="text-luxury-accent" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-8 pt-0">
          <form onSubmit={handleSend} className="max-w-4xl mx-auto relative group">
            <input 
              type="text" 
              placeholder="How can I help you today?"
              className="w-full bg-[#161625] border border-white/10 rounded-2xl px-6 py-4 pr-16 focus:outline-none focus:border-luxury-accent/50 focus:ring-4 focus:ring-luxury-accent/5 transition-all text-sm md:text-base group-hover:border-white/20"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <button 
              type="submit"
              disabled={isLoading || !input.trim()}
              className={`absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                input.trim() && !isLoading 
                ? 'btn-luxury shadow-lg shadow-luxury-accent/20' 
                : 'bg-white/5 text-gray-600'
              }`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </form>
          <p className="text-center text-[10px] text-gray-600 mt-4 uppercase tracking-[0.2em]">
            Powered by Groq Llama-3.3 70B & Hair Cider RAG Engine
          </p>
        </div>
      </main>
    </div>
  );
};

export default App;
