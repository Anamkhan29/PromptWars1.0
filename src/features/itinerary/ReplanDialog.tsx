import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Loader2 } from 'lucide-react';

export function ReplanDialog({ onReplan, loading }: { onReplan: (instruction: string) => void, loading: boolean }) {
  const [instruction, setInstruction] = useState('');
  const [open, setOpen] = useState(false);

  const handleReplan = async () => {
    if (!instruction.trim()) return;
    onReplan(instruction);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full border-white/10 bg-white/5 text-[10px] uppercase tracking-widest py-5 hover:bg-white/10">
          <Sparkles className="w-3 h-3 mr-2 text-primary" /> Modify Expedition
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-[#080808] border-white/10 text-white">
        <DialogHeader>
          <p className="label-tiny mb-2">Synthesis Engine</p>
          <DialogTitle className="font-serif text-3xl tracking-tighter italic">Re-Optimize Flow</DialogTitle>
          <DialogDescription className="text-white/40 text-xs italic">
            Instruct the AI to pivot the itinerary based on new constraints or desires.
          </DialogDescription>
        </DialogHeader>
        <div className="py-6">
          <Textarea 
            placeholder="e.g. 'Make Day 2 more focused on hidden gems' or 'Avoid walking and use transit'..." 
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            className="min-h-[120px] bg-white/[0.02] border-white/10 focus-visible:ring-primary/20 text-sm italic"
          />
        </div>
        <DialogFooter>
          <Button 
            onClick={handleReplan} 
            disabled={loading || !instruction.trim()}
            className="w-full bg-white text-black hover:bg-primary transition-colors text-[10px] uppercase tracking-widest font-bold py-6"
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Execute Re-Synthesis
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
