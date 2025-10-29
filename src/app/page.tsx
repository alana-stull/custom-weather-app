"use client";

import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { WeatherCard } from "@/components/WeatherCard"; 
import { WeatherData } from "@/types/weather"; 
import { CITIES as cities } from "@/data/cities";
import { DUMMY_WEATHER_DATA } from "@/data/weather-data";
import { ActionButton } from "@/components/ActionButton";

const FAVORITE_CITY_NAMES = ["Houston", "Chicago", "Philadelphia"]; // Order matched to your screenshot
const FAVORITE_CITIES = cities.filter(city => FAVORITE_CITY_NAMES.includes(city.name));

export default function Home() {
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4 py-12">
      <main className="w-full max-w-4xl space-y-12">
        
        {/* Header remains the same */}
        <PageHeader
          title="hello sunshine! ☀️"
          subtitle="bringing a little light to your forecast."
        />
        
        {/* 2. Cities You've Traveled To Section */}
        <section className="pt-4"> 
          {/* MODIFICATION: Updated heading text */}
          <h2 className="text-2xl font-semibold mb-6 text-center">cities you've traveled to:</h2> 
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"> 
            {FAVORITE_CITIES.map((city) => {
              const fullWeatherData = DUMMY_WEATHER_DATA[city.name] as WeatherData | undefined;
              
              if (!fullWeatherData) return null; 

              const currentWeather = fullWeatherData.current;

              return (
                <WeatherCard
                  key={city.name}
                  city={city.name}
                  weather={currentWeather} 
                />
              );
            })}
          </div>
        </section>

        {/* Button to all cities page */}
          <div className="text-center pt-8">
              {/* Use ActionButton for the home page */}
                <ActionButton 
                    text="show all saved cities" 
                    href="/all-cities" 
                />
          </div>
      </main>
    </div>
  );
}