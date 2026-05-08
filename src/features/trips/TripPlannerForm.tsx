import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { PlaceAutocomplete } from '../maps/PlaceAutocomplete';
import { TravelPreferences } from '@/types/travel';
import { Plane, Calendar as CalendarIcon, MapPin, Users, Music, Utensils, Camera, Loader2 } from 'lucide-react';

const formSchema = z.object({
  destination: z.string().min(2, "Destination is required"),
  startDate: z.string(),
  endDate: z.string(),
  budget: z.enum(['budget', 'moderate', 'luxury']),
  travelersCount: z.number().min(1),
  transportMode: z.enum(['DRIVING', 'WALKING', 'BICYCLING', 'TRANSIT']),
});

const INTEREST_OPTIONS = [
  { id: 'history', label: 'History & Culture', icon: Music },
  { id: 'food', label: 'Food & Dining', icon: Utensils },
  { id: 'nature', label: 'Nature & Parks', icon: Camera },
  { id: 'shopping', label: 'Shopping', icon: Plane },
  { id: 'nightlife', label: 'Nightlife', icon: Music },
];

export function TripPlannerForm({ onGenerate, loading }: { onGenerate: (prefs: TravelPreferences) => void, loading: boolean }) {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      budget: 'moderate',
      travelersCount: 1,
      transportMode: 'DRIVING',
    }
  });

  const toggleInterest = (id: string) => {
    setSelectedInterests(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    onGenerate({
      ...data,
      interests: selectedInterests,
      accessibility: [],
    });
  };

  return (
    <div className="glass-panel rounded-3xl shadow-2xl overflow-hidden relative border-primary/20">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/10 blur-3xl -z-10" />
      
      <div className="p-8 border-b border-white/10 bg-white/[0.01]">
        <p className="label-tiny mb-2 text-primary">Algorithm v1.0</p>
        <h2 className="text-4xl font-serif tracking-tighter mb-2 vibrant-text">Excursion Blueprint</h2>
        <p className="text-sm text-white/40 italic">Define your parameters for AI-driven itinerary synthesis.</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <Label htmlFor="destination" className="label-tiny text-accent">Destination</Label>
              <PlaceAutocomplete 
                onPlaceSelect={(place) => setValue('destination', place.formatted_address || place.name || '')} 
                placeholder="Tokyo, Japan"
                className="bg-transparent border-white/10 border-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:border-accent text-xl font-serif h-12 text-white"
              />
              {errors.destination && <p className="text-xs text-destructive">{errors.destination.message}</p>}
            </div>
            <div className="space-y-3">
              <Label className="label-tiny text-secondary">Travelers</Label>
              <Input 
                type="number" 
                {...register('travelersCount', { valueAsNumber: true })} 
                className="bg-transparent border-white/10 border-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:border-secondary text-lg font-mono h-12 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-3">
              <Label className="label-tiny text-primary">Start Date</Label>
              <Input 
                type="date" 
                {...register('startDate')} 
                className="bg-transparent border-white/10 border-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary text-xs font-mono h-12 text-white"
              />
            </div>
            <div className="space-y-3">
              <Label className="label-tiny text-primary">End Date</Label>
              <Input 
                type="date" 
                {...register('endDate')} 
                className="bg-transparent border-white/10 border-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary text-xs font-mono h-12 text-white"
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label className="label-tiny text-accent">Budget Utilization</Label>
            <div className="flex gap-4">
              {['budget', 'moderate', 'luxury'].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  className={`flex-1 py-3 text-[10px] uppercase tracking-widest font-bold border rounded-xl transition-all ${watch('budget') === lvl ? 'bg-accent border-accent text-slate-950 shadow-lg shadow-accent/20' : 'border-white/10 text-white/50 hover:border-white/30'}`}
                  onClick={() => setValue('budget', lvl as any)}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Label className="label-tiny text-secondary">Focus Areas</Label>
            <div className="flex flex-wrap gap-3">
              {INTEREST_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  className={`px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold border transition-all flex items-center gap-2 ${selectedInterests.includes(opt.id) ? 'bg-vibrant-gradient text-white border-transparent shadow-lg shadow-primary/20' : 'border-white/10 text-white/40 hover:border-white/30'}`}
                  onClick={() => toggleInterest(opt.id)}
                >
                  <opt.icon className="w-3 h-3" />
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="p-8 pt-0">
          <Button type="submit" className="w-full py-8 text-xs font-bold uppercase tracking-[0.3em] bg-vibrant-gradient text-white hover:opacity-90 transition-all rounded-2xl border-none shadow-xl shadow-primary/20" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-3 h-4 w-4 animate-spin text-white" />
                Synthesizing...
              </>
            ) : (
              'Generate Expedition Blueprint'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
