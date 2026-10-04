import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  ShieldCheck, 
  SunMedium, 
  Users, 
  MapPin, 
  Bot, 
  CornerDownLeft,
  Volume2
} from 'lucide-react';

interface FloatingAiAssistantProps {
  onSelectPrompt?: (prompt: string) => void;
}

interface Message {
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

export const FloatingAiAssistant: React.FC<FloatingAiAssistantProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: 'Hi Shivani! I am your SafeRoute AI Copilot. I constantly monitor street lighting, verified CCTV corridors, crowd density, and police help points. How can I guide you tonight?',
      time: 'Just now'
    }
  ]);

  const quickPrompts = [
    'Explain my 93% SHAP score',
    'Is Rajiv Chowk Gate 2 open?',
    'Is Grand Blvd safe right now?',
    'Where is the nearest 24/7 help booth?',
    'Why is Route D 97% safe?'
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

    // Generate intelligent AI contextual response
    setTimeout(() => {
      let reply = 'I have evaluated live sensors and police feeds in your 500m vicinity. Current status is 92% safe with all municipal smart lights reporting 98% lux.';
      const lower = query.toLowerCase();

      if (lower.includes('gate') || lower.includes('metro') || lower.includes('rajiv chowk')) {
        reply = 'Rajiv Chowk Gate 2 is currently closed for perimeter crowd control. Please use Gate 6 via Radial Road 3, or Janpath Station which is 100% operational.';
      } else if (lower.includes('route d') || lower.includes('bypass') || lower.includes('97%')) {
        reply = 'Route D achieves a 97% safety index because it navigates along Baba Kharak Singh Marg, 100% avoids police barricades on Ashoka Rd, and gives direct access to the Emergency Medical Green Corridor.';
      } else if (lower.includes('shap') || lower.includes('explain')) {
        reply = 'Your 93% safety score is primarily boosted by Street Lighting (+35 pts) and High Crowd Activity (+22 pts). Recent minor alley disputes deducted 12 pts, which Route C bypasses completely.';
      } else if (lower.includes('grand blvd') || lower.includes('5th')) {
        reply = 'Grand Boulevard is currently in a designated Safe Corridor: 94 lux lighting, active open storefronts, and a police patrol station 350m ahead.';
      } else if (lower.includes('help booth') || lower.includes('refuge') || lower.includes('nearest')) {
        reply = 'Nearest verified refuge is Guardian 24/7 Pharmacy & Help Booth at 210 meters (1 min walk). Division 4 Police Station is at 350 meters.';
      } else if (lower.includes('crowd') || lower.includes('density') || lower.includes('surge')) {
        reply = 'Predicted crowd density along Janpath may reach 88% in the next 20 minutes due to event dispersal. We recommend switching to Route D for a clear, chokepoint-free commute.';
      }

      const aiMsg: Message = {
        sender: 'ai',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 500);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          id="btn-floating-ai-copilot"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 right-4 z-40 p-3 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-[0_10px_25px_rgba(37,99,235,0.45)] flex items-center gap-2 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/40 group glow-blue"
          title="SafeRoute AI Assistant"
        >
          {/* Animated Glow Halo */}
          <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 opacity-60 blur-xs group-hover:opacity-100 transition duration-300"></div>

          <div className="relative flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
            <span className="text-xs font-black tracking-wide pr-1 hidden sm:inline">
              AI Copilot
            </span>
            <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-900 animate-pulse"></span>
          </div>
        </button>
      )}

      {/* Floating Chat Drawer / Popover */}
      {isOpen && (
        <div className="fixed inset-x-4 bottom-20 z-50 max-w-sm mx-auto rounded-[28px] bg-white/95 backdrop-blur-xl shadow-2xl border border-blue-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200 h-[430px]">
          {/* Header */}
          <div className="p-3.5 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <h4 className="text-xs font-black">SafeRoute AI Copilot</h4>
                <p className="text-[9px] text-blue-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Telemetry Stream Active
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-2.5 text-xs no-scrollbar">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex gap-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'ai' && (
                  <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 text-[10px] font-bold mt-1">
                    AI
                  </div>
                )}
                <div
                  className={`max-w-[82%] p-3 rounded-2xl ${
                    m.sender === 'user'
                      ? 'bg-blue-600 text-white font-medium rounded-tr-xs'
                      : 'bg-slate-100 text-slate-800 font-medium rounded-tl-xs border border-slate-200/60'
                  }`}
                >
                  <p className="leading-relaxed">{m.text}</p>
                  <span className={`block text-[9px] mt-1 ${m.sender === 'user' ? 'text-blue-200' : 'text-slate-400'}`}>
                    {m.time}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Prompt Chips */}
          <div className="px-3 pb-2 flex gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip)}
                className="px-2.5 py-1 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 text-[10px] font-bold whitespace-nowrap border border-blue-200 transition-colors shrink-0"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-2.5 bg-slate-50 border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask safety assistant..."
              className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => handleSend()}
              className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
