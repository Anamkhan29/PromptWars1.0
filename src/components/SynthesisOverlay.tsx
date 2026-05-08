import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, Sparkles, Map, Database, Cpu } from 'lucide-react';

const MESSAGES = [
  { text: "Initializing VoyageEngine...", icon: Cpu },
  { text: "Consulting global travel databases...", icon: Database },
  { text: "Optimizing geographic routes...", icon: Map },
  { text: "Synthesizing luxury experiences...", icon: Sparkles },
  { text: "Calculating optimal investment...", icon: Database },
  { text: "Polishing your editorial itinerary...", icon: Sparkles },
];

export function SynthesisOverlay({ visible }: { visible: boolean }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center p-8 text-center overflow-hidden"
        >
          {/* Background effects */}
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[120px] animate-pulse delay-1000" />

          <div className="max-w-md w-full space-y-12 relative">
            <div className="relative flex justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="w-40 h-40 rounded-full border-4 border-white/5 border-t-primary shadow-2xl shadow-primary/20"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-vibrant-gradient flex items-center justify-center shadow-lg">
                  <Sparkles className="w-8 h-8 text-white animate-pulse" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center gap-4"
              >
                {MESSAGES[index].icon && (() => {
                  const Icon = MESSAGES[index].icon;
                  return <Icon className="w-8 h-8 text-accent animate-bounce" />;
                })()}
                <h3 className="text-3xl font-serif italic tracking-tighter vibrant-text">
                   {MESSAGES[index].text}
                </h3>
              </motion.div>
              
              <div className="flex gap-2 justify-center">
                {MESSAGES.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1.5 w-10 rounded-full transition-all duration-700 ${i === index ? 'bg-vibrant-gradient shadow-lg shadow-primary/50' : 'bg-white/10'}`} 
                  />
                ))}
              </div>
            </div>

            <div className="glass-panel p-4 rounded-2xl border-white/5">
              <p className="text-[10px] uppercase tracking-[0.4em] text-white/40 font-bold mb-2">
                 Engine Status: Peak Synthesis
              </p>
              <div className="flex justify-center gap-4">
                 <Loader2 className="w-4 h-4 text-primary animate-spin" />
                 <span className="text-[9px] uppercase tracking-widest text-white/20">Gemini 3 Flash Powered</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
