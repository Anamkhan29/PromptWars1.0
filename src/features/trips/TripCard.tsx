import React from 'react';
import { Itinerary } from '@/types/travel';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';

export function TripCard({ itinerary, onClick }: { itinerary: Itinerary, onClick: () => void }) {
  return (
    <div 
      className="group bg-slate-900/50 border border-white/10 rounded-xl overflow-hidden cursor-pointer transition-all hover:border-primary/50 hover:bg-white/[0.04] hover:shadow-2xl hover:shadow-primary/10" 
      onClick={onClick}
    >
      <div className="h-40 bg-[#111] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent z-10" />
        <div className="absolute bottom-4 left-4 z-20">
          <p className="label-tiny mb-1 text-accent">{itinerary.days.length} Day Expedition</p>
          <h4 className="font-serif text-2xl tracking-tighter text-white group-hover:text-primary transition-colors">{itinerary.destination}</h4>
        </div>
      </div>
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-white/30">
          <span className="flex items-center gap-2 font-bold"><Calendar className="w-3 h-3 text-secondary" /> {itinerary.startDate}</span>
          <span className="flex items-center gap-1 text-accent font-bold"><MapPin className="w-3 h-3" /> Explore</span>
        </div>
        <p className="text-xs text-white/50 line-clamp-2 italic font-serif">
          {itinerary.title}
        </p>
        <div className="pt-2 flex items-center justify-between border-t border-white/5">
           <span className="text-[10px] uppercase tracking-widest text-primary font-bold">Planned by VoyageEngine</span>
           <ArrowRight className="w-4 h-4 text-white/20 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
        </div>
      </div>
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full bg-primary/90 px-2.5 py-0.5 text-xs font-semibold text-primary-foreground ${className}`}>
      {children}
    </span>
  );
}
