import React, { useState } from 'react';
import { 
  Bot, 
  X, 
  Send
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { drawerVariants, TRANSITIONS } from '../utils/motion';

import { ScreenId } from '../types';

interface Message {
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

interface FloatingAiAssistantProps {
  currentScreen?: ScreenId;
}

export const FloatingAiAssistant: React.FC<FloatingAiAssistantProps> = ({ currentScreen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const shouldReduceMotion = useReducedMotion();
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: 'Hi Shivani! I am your SafeRoute AI Assistant. I monitor street lighting lux levels, crowd density, and verified safe corridors. How can I assist you?',
      time: 'Just now'
    }
  ]);

  const quickPrompts = [
    'Explain my 93% SHAP score',
    'Is Grand Blvd safe right now?',
    'Nearest 24/7 safe haven?',
    'Why is Route D recommended?'
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputVal;
    if (!query.trim()) return;

    const userMsg: Message = {
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');

    setTimeout(() => {
      let reply = 'Sensors in your 500m vicinity report 92% safety score with 98% municipal street illumination active.';
      const lower = query.toLowerCase();

      if (lower.includes('route d') || lower.includes('97%')) {
        reply = 'Route D achieves a 97% safety index by following Baba Kharak Singh Marg, avoiding civic gatherings on Ashoka Rd, and keeping within 100m of the Emergency Green Corridor.';
      } else if (lower.includes('shap') || lower.includes('score')) {
        reply = 'Your 93% safety score is positively supported by Municipal Lighting (+35 pts) and High Pedestrian Activity (+22 pts).';
      } else if (lower.includes('grand blvd')) {
        reply = 'Grand Boulevard is currently a designated Safe Corridor: 94 lux lighting, open storefronts, and a police patrol station 350m ahead.';
      } else if (lower.includes('haven') || lower.includes('refuge') || lower.includes('pharmacy')) {
        reply = 'Nearest verified safe refuge is Guardian 24/7 Pharmacy at 210 meters (1 min walk). Division 4 Police Kiosk is at 350 meters.';
      }

      const aiMsg: Message = {
        sender: 'ai',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 450);
  };

  return (
    <>
      {/* Floating Trigger Button (Absolute inside phone preview) */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="btn-floating-trigger"
            id="btn-floating-ai-copilot"
            type="button"
            onClick={() => setIsOpen(true)}
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.8 }}
            animate={shouldReduceMotion ? false : { opacity: 1, scale: 1 }}
            exit={shouldReduceMotion ? false : { opacity: 0, scale: 0.8 }}
            transition={shouldReduceMotion ? TRANSITIONS.reduced : TRANSITIONS.fast}
            whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
            className={`absolute z-40 p-2 sm:p-2.5 rounded-full bg-black text-white dark:bg-white dark:text-black shadow-lg border border-neutral-700 dark:border-neutral-300 transition-all cursor-pointer flex items-center gap-1.5 ${
              currentScreen === 'splash'
                ? 'top-10 right-3.5'
                : 'bottom-16 right-3.5'
            }`}
            title="Open AI Assistant"
            aria-label="Open SafeRoute AI Assistant"
          >
            <Bot className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-wider pr-0.5">AI</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Floating Chat Drawer / Popover (Strictly contained within device) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="ai-assistant-drawer"
            variants={shouldReduceMotion ? undefined : drawerVariants}
            initial={shouldReduceMotion ? false : "initial"}
            animate={shouldReduceMotion ? false : "animate"}
            exit={shouldReduceMotion ? false : "exit"}
            className={`absolute inset-x-2 ${
              currentScreen === 'splash' ? 'bottom-2.5' : 'bottom-14'
            } z-50 rounded-2xl bg-white dark:bg-black text-black dark:text-white border border-neutral-300 dark:border-neutral-800 shadow-2xl flex flex-col overflow-hidden h-[380px] max-h-[82%] transition-colors`}
          >
            {/* Header */}
            <div className="p-3 bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-bold">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-black dark:text-white">SafeRoute Copilot</h4>
                  <p className="text-[9px] text-neutral-500 dark:text-neutral-400">Telemetry Active</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md text-neutral-500 hover:text-black dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                aria-label="Close Assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Thread */}
            <div className="flex-1 min-h-0 p-3 overflow-y-auto space-y-2 text-xs no-scrollbar">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex gap-1.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.sender === 'ai' && (
                    <div className="w-5 h-5 rounded bg-black text-white dark:bg-white dark:text-black flex items-center justify-center shrink-0 text-[9px] font-black mt-0.5">
                      AI
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] p-2.5 rounded-xl text-xs ${
                      m.sender === 'user'
                        ? 'bg-black text-white dark:bg-white dark:text-black font-semibold rounded-tr-xs'
                        : 'bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white border border-neutral-200 dark:border-neutral-800 rounded-tl-xs font-medium'
                    }`}
                  >
                    <p className="leading-relaxed">{m.text}</p>
                    <span className={`block text-[8px] mt-1 ${m.sender === 'user' ? 'text-neutral-300 dark:text-neutral-600' : 'text-neutral-400'}`}>
                      {m.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Prompts */}
            <div className="px-2.5 py-1.5 flex gap-1 overflow-x-auto no-scrollbar border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950">
              {quickPrompts.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSend(chip)}
                  className="px-2 py-0.5 rounded-md bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 text-[9px] font-bold whitespace-nowrap border border-neutral-200 dark:border-neutral-800 hover:border-black dark:hover:border-white transition-colors shrink-0 cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Input Box */}
            <div className="p-2 bg-neutral-100 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 flex items-center gap-1.5">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask safety assistant..."
                className="flex-1 px-2.5 py-1.5 rounded-lg bg-white dark:bg-black text-black dark:text-white border border-neutral-300 dark:border-neutral-700 text-xs font-semibold focus:outline-none focus:border-black dark:focus:border-white transition-colors"
              />
              <button
                type="button"
                onClick={() => handleSend()}
                className="p-2 rounded-lg bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition-opacity cursor-pointer"
                aria-label="Send Message"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
