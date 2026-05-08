import { useState, useEffect } from 'react';
import { TripPlannerForm } from './features/trips/TripPlannerForm';
import { ItineraryTimeline } from './features/itinerary/ItineraryTimeline';
import { MapView } from './features/maps/MapView';
import { generateItinerary } from './services/geminiService';
import { Itinerary, TravelPreferences } from './types/travel';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { Plane, Compass, List, Map as MapIcon, RotateCcw, Share2, Save, Plus, Grid, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TripCard } from './features/trips/TripCard';
import { updateItinerary } from './services/replanService';
import { ReplanDialog } from './features/itinerary/ReplanDialog';
import { WeatherStatus } from './components/WeatherStatus';
import { ThemeToggle } from './components/ThemeToggle';
import { SynthesisOverlay } from './components/SynthesisOverlay';

export default function App() {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(false);
  const [replanLoading, setReplanLoading] = useState(false);
  const [view, setView] = useState<'dashboard' | 'planner' | 'viewer'>('planner');
  const [highlightedLocation, setHighlightedLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [savedTrips, setSavedTrips] = useState<Itinerary[]>(() => {
    const saved = localStorage.getItem('voyage_trips');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('voyage_trips', JSON.stringify(savedTrips));
  }, [savedTrips]);

  const handleGenerate = async (prefs: TravelPreferences) => {
    setLoading(true);
    try {
      const result = await generateItinerary(prefs);
      setItinerary(result);
      setView('viewer');
      toast.success("Itinerary generated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate itinerary. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReplan = async (instruction: string) => {
    if (!itinerary) return;
    setReplanLoading(true);
    try {
      const result = await updateItinerary(itinerary, instruction);
      setItinerary(result);
      toast.success("Itinerary updated!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update itinerary.");
    } finally {
      setReplanLoading(false);
    }
  };

  const handleReorder = (dayIndex: number, newActivities: any[]) => {
    if (!itinerary) return;
    const newDays = [...itinerary.days];
    newDays[dayIndex] = { ...newDays[dayIndex], activities: newActivities };
    setItinerary({ ...itinerary, days: newDays });
  };

  const handleSave = () => {
    if (itinerary) {
      setSavedTrips(prev => [...prev, itinerary]);
      toast.success("Trip saved to your dashboard!");
      setView('dashboard');
    }
  };

  const handleSelectTrip = (trip: Itinerary) => {
    setItinerary(trip);
    setView('viewer');
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-50 overflow-hidden flex flex-col relative">
      {/* Background blobs for color pop */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
      
      <SynthesisOverlay visible={loading || replanLoading} />
      <header className="h-16 border-b border-white/10 glass-panel sticky top-0 z-50 shrink-0">
        <div className="container mx-auto px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-8 cursor-pointer" onClick={() => setView('dashboard')}>
            <span className="font-serif italic text-2xl tracking-tighter flex items-center gap-2">
              <span className="vibrant-text">VoyageEngine</span><span className="text-accent">.ai</span>
            </span>
            <div className="hidden md:flex gap-6 text-[10px] uppercase tracking-widest text-white/50 font-medium">
              <button 
                className={`pb-1 transition-all hover:text-white ${view === 'dashboard' ? 'text-white border-b-2 border-primary' : ''}`}
                onClick={() => setView('dashboard')}
              >
                Dashboard
              </button>
              <button 
                className={`pb-1 transition-all hover:text-white ${view === 'planner' ? 'text-white border-b-2 border-secondary' : ''}`}
                onClick={() => setView('planner')}
              >
                Planner
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden sm:flex glass-panel px-3 py-1.5 rounded-full items-center gap-2 border-primary/20">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
                <span className="text-[10px] uppercase tracking-tighter text-accent/80 font-bold">Engine Active</span>
             </div>
             <ThemeToggle />
             {itinerary && view === 'viewer' && (
                <>
                 <Button variant="outline" size="sm" className="hidden sm:flex border-white/10 hover:bg-white/5 text-[10px] uppercase tracking-widest px-4 glass-panel">
                   <Share2 className="w-3 h-3 mr-2" /> Share
                 </Button>
                 <Button variant="default" size="sm" onClick={handleSave} className="bg-vibrant-gradient text-white hover:opacity-90 text-[10px] uppercase tracking-widest px-4 font-bold border-none">
                   <Save className="w-3 h-3 mr-2" /> Save Trip
                 </Button>
                </>
             )}
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {view === 'dashboard' ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="h-full container mx-auto px-8 py-12 overflow-y-auto"
            >
              <div className="flex items-end justify-between mb-12">
                <div>
                  <p className="label-tiny mb-2">Workspace</p>
                  <h2 className="text-5xl font-serif tracking-tighter vibrant-text">Your Journeys</h2>
                </div>
                <Button onClick={() => setView('planner')} className="bg-vibrant-gradient text-white hover:opacity-90 transition-all text-[10px] uppercase tracking-widest font-bold px-6 py-5 border-none shadow-lg shadow-primary/20">
                  <Plus className="w-4 h-4 mr-2" /> Start New Journey
                </Button>
              </div>

              {savedTrips.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 glass-panel rounded-2xl">
                  <Compass className="w-12 h-12 text-primary/20 mb-6" />
                  <p className="text-lg font-serif italic text-white/40">No expeditions archived yet.</p>
                  <Button variant="link" onClick={() => setView('planner')} className="text-accent text-xs uppercase tracking-widest mt-2 hover:no-underline hover:text-white">Begin your first plan —&gt;</Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {savedTrips.map((trip, idx) => (
                    <div key={`${trip.id}-${idx}`}>
                      <TripCard itinerary={trip} onClick={() => handleSelectTrip(trip)} />
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : view === 'planner' ? (
            <motion.div
              key="planner"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="h-full flex justify-center items-center overflow-y-auto p-4"
            >
              <div className="w-full max-w-2xl py-12">
                <TripPlannerForm onGenerate={handleGenerate} loading={loading} />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="viewer"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="h-full flex flex-col md:flex-row overflow-hidden"
            >
              <aside className="w-full md:w-80 border-r border-white/5 p-8 flex flex-col gap-10 shrink-0 bg-slate-950/80 backdrop-blur-xl z-20 overflow-y-auto">
                <div>
                  <p className="label-tiny mb-2 text-accent">Destination</p>
                  <h2 className="font-serif text-5xl leading-none tracking-tighter vibrant-text drop-shadow-sm">{itinerary?.destination}</h2>
                  <p className="text-xs text-white/40 italic mt-3 font-serif">{itinerary?.startDate} — {itinerary?.endDate}</p>
                </div>

                <div className="space-y-8">
                  <WeatherStatus destination={itinerary?.destination || ''} />
                  
                  <div className="glass-panel p-5 rounded-2xl border-white/5">
                    <div className="flex justify-between text-[10px] uppercase tracking-widest text-white/40 mb-3 font-bold">
                       <span>Exp. Investment</span>
                       <span className="text-primary">${itinerary?.estimatedCost}</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                       <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '85%' }}
                        className="h-full bg-vibrant-gradient"
                       />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="label-tiny text-secondary">Dynamic Actions</p>
                    <div className="flex flex-col gap-3">
                       <ReplanDialog onReplan={handleReplan} loading={replanLoading} />
                       <Button variant="outline" className="w-full border-white/5 bg-white/[0.02] text-[10px] uppercase tracking-widest py-6 hover:bg-white/10 transition-all rounded-xl" onClick={() => setView('planner')}>
                         <RotateCcw className="w-3 h-3 mr-2 text-accent" /> Discard & Reset
                       </Button>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-8 border-t border-white/10">
                  <p className="label-tiny mb-4">Trip Summary</p>
                  <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                    <div className="flex items-center gap-4 text-xs">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">92</div>
                      <p className="text-white/60 leading-relaxed">Efficient route generated with ${itinerary?.estimatedCost} budget optimization.</p>
                    </div>
                  </div>
                </div>
              </aside>

              <div className="flex-1 flex flex-col overflow-hidden min-h-0 bg-slate-950">
                <header className="h-20 border-b border-white/5 px-8 flex items-center justify-between shrink-0 bg-slate-950/40 backdrop-blur-md">
                   <div className="flex items-center gap-10">
                      <div className="flex flex-col">
                        <span className="label-tiny text-accent">Active Protocol</span>
                        <span className="text-sm font-mono font-bold tracking-tighter uppercase">Itinerary Timeline</span>
                      </div>
                      <div className="hidden lg:flex flex-col border-l border-white/10 pl-10">
                         <span className="label-tiny">Real-time Feed</span>
                         <span className="text-xs text-white/40 italic font-serif">Awaiting user interactions...</span>
                      </div>
                   </div>
                   <div className="flex gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className="text-[9px] uppercase tracking-widest text-emerald-500/80 font-bold">Encrypted</span>
                   </div>
                </header>

                <div className="flex-1 flex overflow-hidden min-h-0">
                  <div className="flex-1 min-w-[320px] max-w-4xl border-r border-white/5 bg-slate-950/20 flex flex-col">
                    <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                        {itinerary && (
                          <ItineraryTimeline 
                            itinerary={itinerary} 
                            onReorder={handleReorder} 
                            onActivityClick={(a) => setHighlightedLocation(a.location)}
                          />
                        )}
                    </div>
                  </div>

                  <div className="hidden md:block flex-1 bg-white/[0.02] p-8">
                    <MapView itinerary={itinerary || undefined} highlightedLocation={highlightedLocation} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="h-10 border-t border-white/10 px-8 flex items-center justify-between shrink-0 bg-[#050505] text-white/30 text-[9px] uppercase tracking-[0.3em]">
        <div className="flex gap-8">
           <span>Engine: Gemini 3 Flash</span>
           <span>Status: Ready</span>
        </div>
        <div>
           © 2024 VoyageEngine Editorial
        </div>
      </footer>
      <Toaster position="bottom-right" richColors />
    </div>
  );
}
