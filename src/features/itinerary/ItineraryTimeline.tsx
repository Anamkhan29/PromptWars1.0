import { Itinerary, Activity } from '@/types/travel';
import { GripVertical } from 'lucide-react';
import { motion } from 'motion/react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableActivityProps {
  activity: Activity;
  index: number;
  onClick?: (activity: Activity) => void;
  key?: string | number;
}

function SortableActivity({ activity, index, onClick }: SortableActivityProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: activity.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className="group relative pl-12 border-l border-white/5 pb-8 last:pb-0"
      onClick={() => onClick?.(activity)}
    >
      {/* Timeline Dot */}
      <div className={`absolute left-[-7px] top-1 w-3.5 h-3.5 rounded-full border-2 border-white/10 bg-slate-900 z-20 transition-all group-hover:scale-125 group-hover:border-primary ${index === 0 ? 'bg-vibrant-gradient ring-4 ring-primary/20 border-none' : ''}`} />
      
      <div className="glass-panel p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all hover:bg-white/[0.08] hover:border-primary/40 group-hover:shadow-2xl group-hover:shadow-primary/5 border-white/5">
        <div className="flex gap-4 items-start md:items-center flex-1 w-full">
          <button 
            className="cursor-grab active:cursor-grabbing p-1.5 hover:bg-white/10 rounded-lg text-white/10 hover:text-white/60 transition-all shrink-0"
            {...attributes} 
            {...listeners}
          >
            <GripVertical className="w-4 h-4" />
          </button>
          
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center flex-1">
            <span className="text-[10px] font-mono font-bold text-accent pt-1 md:pt-0 shrink-0 bg-accent/10 px-3 py-1 rounded-full border border-accent/20 tracking-tighter uppercase">{activity.time}</span>
            <div className="space-y-1.5 flex-1">
              <h4 className="font-serif text-2xl leading-none text-white group-hover:text-primary transition-colors tracking-tighter">{activity.title}</h4>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="text-[9px] uppercase tracking-[0.15em] text-secondary font-black whitespace-nowrap bg-secondary/10 px-2 py-0.5 rounded-sm">{activity.type}</span>
                <span className="text-[9px] text-white/30 font-bold uppercase tracking-widest">{activity.duration}</span>
                <span className="text-[9px] text-accent/60 font-medium tracking-tight bg-accent/5 px-2 py-0.5 rounded border border-accent/10 truncate max-w-[200px]">{activity.location.address}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="md:text-right shrink-0 w-full md:w-auto flex justify-end">
          {activity.costEstimate > 0 ? (
             <div className="flex flex-col items-end">
               <span className="text-[10px] bg-primary/20 text-white px-4 py-1.5 rounded-full border border-primary/30 font-black uppercase tracking-tighter shadow-lg shadow-primary/10">
                 Est. ${activity.costEstimate}
               </span>
             </div>
          ) : (
             <span className="text-[10px] bg-white/5 text-white/30 px-4 py-1.5 rounded-full border border-white/10 font-bold uppercase tracking-tighter">
               Included
             </span>
          )}
        </div>
      </div>
      
      <div className="mt-4 pl-6 md:pl-16 text-sm text-white/50 leading-relaxed max-w-2xl italic font-serif border-l-2 border-white/5 ml-4 md:ml-10 py-2">
        {activity.description}
      </div>
    </div>
  );
}

export function ItineraryTimeline({ 
  itinerary, 
  onReorder,
  onActivityClick 
}: { 
  itinerary: Itinerary, 
  onReorder?: (dayIndex: number, newActivities: Activity[]) => void,
  onActivityClick?: (activity: Activity) => void
}) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (dayIndex: number, event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const activities = itinerary.days[dayIndex].activities;
      const oldIndex = activities.findIndex((a) => a.id === active.id);
      const newIndex = activities.findIndex((a) => a.id === over.id);
      
      const newActivities = arrayMove(activities, oldIndex, newIndex);
      onReorder?.(dayIndex, newActivities);
    }
  };

  return (
    <div className="space-y-16">
      {itinerary.days.map((day, dayIndex) => (
        <motion.div
          key={`${day.day}-${dayIndex}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: dayIndex * 0.1 }}
          className="relative"
        >
          <header className="flex justify-between items-end mb-10 border-b border-white/5 pb-6">
            <div className="relative">
              <span className="absolute -left-12 top-0 text-[100px] font-serif italic text-white/[0.02] -z-10 select-none">
                {day.day}
              </span>
              <h3 className="text-6xl font-serif tracking-tighter vibrant-text italic">Day {day.day < 10 ? `0${day.day}` : day.day}</h3>
              <p className="text-sm font-serif italic text-white/30 mt-2 tracking-wide uppercase">{day.date}</p>
            </div>
            <div className="text-right pb-1">
              <p className="label-tiny text-accent">Synthesis Capacity</p>
              <p className="text-2xl font-mono text-white/80 font-black">{day.activities.length} <span className="text-[10px] text-white/20 uppercase font-bold tracking-widest">Events</span></p>
            </div>
          </header>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={(e) => handleDragEnd(dayIndex, e)}
          >
            <SortableContext
              items={day.activities.map(a => a.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {day.activities.map((activity, actIndex) => (
                  <SortableActivity 
                    key={activity.id} 
                    activity={activity} 
                    index={actIndex} 
                    onClick={onActivityClick}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </motion.div>
      ))}
    </div>
  );
}
