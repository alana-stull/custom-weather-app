import { CurrentWeather } from "@/types/weather";
// IMPORT THE EXISTING ICON COMPONENT
import { WeatherIcon } from "@/components/WeatherIcon"; 

interface WeatherCardProps {
  city: string;
  weather?: CurrentWeather;
  temp?: number;
  condition?: string;
  // NOTE: If you are using 'code', you may need to add it here, 
  // but we assume it's nested in the 'weather' prop.
}

export function WeatherCard({ city, weather, temp, condition }: WeatherCardProps) {
  const temperature = weather?.temperature ?? temp ?? 0;
  const conditionText = weather?.condition.description ?? condition ?? "";
  
  // Assuming the weather code is nested inside weather.condition.code 
  // (adjust this if your data structure is different, e.g., weather.code)
  const weatherCode = weather?.condition.code ?? 0; // Default to 0 (Sunny) if missing

  return (
    <div className="p-6 bg-white/60 dark:bg-zinc-800/60 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-700">
      
      {/* Container for City, Icon, and Temperature (Top Row) */}
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{city}</h2>
        
        {/* Temperature moved to the top right and bolded */}
        <p className="text-2xl font-extrabold text-amber-500 dark:text-amber-400">
          {temperature}°F
        </p>
      </div>

      {/* Weather Condition and Icon */}
      <div className="flex items-center gap-2 mb-4">
        {/* MODIFICATION: Use the WeatherIcon component */}
        <WeatherIcon code={weatherCode} size="sm" /> 
        
        {/* MODIFICATION: Condition text is italicized */}
        <p className="text-base text-zinc-600 dark:text-zinc-300 italic">
          {conditionText}
        </p>
      </div>
      
      {/* Detailed Weather Stats */}
      {weather && (
        <div className="mt-2 text-sm text-zinc-700 dark:text-zinc-300 space-y-1">
          <p>Feels like: {weather.feelsLike}°F</p>
          <p>Humidity: {weather.humidity}%</p>
          <p>Wind: {weather.windSpeed} mph</p>
        </div>
      )}
    </div>
  );
}