export interface TravelPreferences {
  destination: string;
  startDate: string;
  endDate: string;
  budget: 'budget' | 'moderate' | 'luxury';
  interests: string[];
  accessibility: string[];
  transportMode: 'DRIVING' | 'WALKING' | 'BICYCLING' | 'TRANSIT';
  travelersCount: number;
}

export interface Activity {
  id: string;
  time: string;
  title: string;
  description: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  duration: string;
  costEstimate: number;
  type: 'sightseeing' | 'dining' | 'activity' | 'travel' | 'rest';
}

export interface DayPlan {
  day: number;
  date: string;
  activities: Activity[];
}

export interface Itinerary {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  days: DayPlan[];
  totalBudget: number;
  estimatedCost: number;
}
