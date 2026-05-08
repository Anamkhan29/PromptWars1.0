import { useEffect, useState } from 'react';
import { Cloud, Sun, CloudRain, Thermometer } from 'lucide-react';

interface WeatherData {
  temp: number;
  condition: string;
  icon: 'sun' | 'cloud' | 'rain';
}

export function WeatherStatus({ destination }: { destination: string }) {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    // Simulate real-time weather fetching
    const conditions: WeatherData['condition'][] = ['Clear Skies', 'Partly Cloudy', 'Light Rain'];
    const icons: WeatherData['icon'][] = ['sun', 'cloud', 'rain'];
    const idx = Math.floor(Math.random() * conditions.length);

    const timer = setTimeout(() => {
      setWeather({
        temp: 18 + Math.floor(Math.random() * 10),
        condition: conditions[idx],
        icon: icons[idx],
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, [destination]);

  if (!weather) {
    return (
      <div className="animate-pulse flex items-center gap-3">
        <div className="w-8 h-8 bg-white/5 rounded-full" />
        <div className="h-3 w-20 bg-white/5 rounded" />
      </div>
    );
  }

  const Icon = weather.icon === 'sun' ? Sun : weather.icon === 'cloud' ? Cloud : CloudRain;

  return (
    <div className="flex items-center gap-4 group glass-panel p-3 rounded-2xl border-white/5 hover:border-primary/20 transition-all">
      <div className="w-10 h-10 rounded-full bg-vibrant-gradient flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover:scale-110">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="label-tiny text-accent mb-0.5">Live Atmosphere</p>
        <div className="flex items-center gap-2">
           <span className="text-sm font-black text-white">{weather.temp}°C</span>
           <span className="text-xs text-white/50 italic font-serif tracking-tight">{weather.condition}</span>
        </div>
      </div>
    </div>
  );
}
