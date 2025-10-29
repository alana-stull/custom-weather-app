"use client";

import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { WeatherCard } from "@/components/WeatherCard";
import { WeatherData } from "@/types/weather"; 
import { CITIES as ALL_CITIES } from "@/data/cities";
import { DUMMY_WEATHER_DATA } from "@/data/weather-data";

export default function AllCitiesPage() {
  
  // Create an array of all available city names to loop through
  // This ensures we only try to display cards for cities that have data
  const citiesWithData = ALL_CITIES.filter(city => DUMMY_WEATHER_DATA[city.name]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4 py-12">
      <main className="w-full max-w-6xl space-y-12">
        
        {/* MODIFICATION 1: Travel-Themed Header */}
        <PageHeader
          title="your global passport 🌍"
          subtitle="a forecast from every destination you've explored."
        />
        
        {/* Back Button */}
        <div className="flex justify-center md:justify-start">
            <Link href="/">
                <Link href="/">
                {/* Reusing the styling from the home page button */}
                <button className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-md shadow-lg transition transform hover:scale-105 whitespace-nowrap">
                    back to featured cities
                </button>
            </Link>
            </Link>
        </div>

        {/* MODIFICATION 2: Grid of ALL Cities */}
        <section> 
          <h2 className="text-3xl font-bold mb-8 text-center">all saved destinations:</h2>
          
          {/* Using a grid to display all cards (e.g., 3-4 per row on large screens) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"> 
            {citiesWithData.map((city) => {
              const fullWeatherData = DUMMY_WEATHER_DATA[city.name] as WeatherData;
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
        
      </main>
    </div>
  );
}