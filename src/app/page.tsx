"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { WeatherCard } from "@/components/WeatherCard"; 
import { CurrentWeather } from "@/types/weather"; // Import only CurrentWeather, not the dummy data types
import { CITIES as cities, City } from "@/data/cities"; // Import City interface and CITIES array
import { ActionButton } from "@/components/ActionButton";
import { ErrorMessage } from "@/components/ErrorMessage"; // Assume this is a global error component
import { LoadingState } from "@/components/LoadingState"; // Assume this is a global loading component

// --- API Configuration ---
const FAVORITE_CITY_NAMES = ["Houston", "Chicago", "Philadelphia"];
// We filter the CITIES array to get the specific City objects (with coordinates)
const FAVORITE_CITIES = cities.filter(city => FAVORITE_CITY_NAMES.includes(city.name));

const BASE_URL = 'https://api.open-meteo.com/v1/forecast';
// Parameters request: temp, weather code, wind speed, humidity, UV index. Imperial units.
const API_PARAMS = 'current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m,uv_index&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto&forecast_days=1';
const MAX_RETRIES = 3;


// --- TypeScript Interfaces for API Response State ---

// Represents the data structure we store for one city after API fetch attempts
interface CityWeatherState {
  current: CurrentWeather | null;
  error?: string;
}

// Maps city name to its weather state
type WeatherDataMap = Record<string, CityWeatherState>;


export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherDataMap>({});
  const [isLoading, setIsLoading] = useState(true);
  const [globalError, setGlobalError] = useState<string | null>(null);

  /**
   * Fetches weather for a single city with retry logic.
   * @param city The City object containing name, lat, and lon.
   */
  const fetchCityWeather = async (city: City, attempt = 1): Promise<CityWeatherState> => {
    const url = `${BASE_URL}?latitude=${city.latitude}&longitude=${city.longitude}&${API_PARAMS}`;
    
    // Exponential backoff delay
    if (attempt > 1) {
      const delay = Math.pow(2, attempt) * 100;
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      
      const json = await response.json();

      if (json.error) {
        throw new Error(`API Error: ${json.reason || 'Invalid request parameters'}`);
      }

      // Map API response to the CurrentWeather type structure
      return {
        current: {
          temperature: Math.round(json.current.temperature_2m),
          feelsLike: Math.round(json.current.apparent_temperature || json.current.temperature_2m),
          humidity: json.current.relative_humidity_2m,
          windSpeed: json.current.wind_speed_10m,
          uvIndex: json.current.uv_index || 0,
          condition: {
            code: json.current.weather_code,
            description: "Live data loaded", // Description is determined by WeatherIcon logic
          },
        },
        error: undefined
      };
    } catch (err: any) {
      if (attempt < MAX_RETRIES) {
        // Retry
        return fetchCityWeather(city, attempt + 1);
      }
      // Max retries reached
      return { current: null, error: err.message || "Failed to fetch weather data." };
    }
  };


  useEffect(() => {
    // We only fetch once on mount
    const fetchAllWeather = async () => {
      setIsLoading(true);
      setGlobalError(null);
      
      try {
        // Create an array of Promises, one for each city fetch
        const cityPromises = FAVORITE_CITIES.map(city => fetchCityWeather(city));
        
        // Wait for all promises to resolve
        const results = await Promise.all(cityPromises);

        // Map results back to the state object keyed by city name
        const newWeatherData: WeatherDataMap = {};
        FAVORITE_CITIES.forEach((city, index) => {
          newWeatherData[city.name] = results[index];
        });
        
        setWeatherData(newWeatherData);
        
      } catch (err: any) {
        setGlobalError(err.message || "An unknown error occurred during fetch.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllWeather();
  }, []); // Empty dependency array ensures this runs only once


  // --- Rendering Logic ---

  if (isLoading) {
    // Show a global loading indicator while all data is being fetched
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4 py-12">
        <LoadingState />
      </div>
    );
  }

  if (globalError) {
    // Show a global error message if the entire fetch operation failed catastrophically
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4 py-12">
        <ErrorMessage message={`Critical Error: ${globalError}`} />
      </div>
    );
  }

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
          <h2 className="text-2xl font-semibold mb-6 text-center">cities you've traveled to:</h2> 
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"> 
            {FAVORITE_CITIES.map((city) => {
              // Get the live data for this city
              const data = weatherData[city.name];

              // If data is null or has an error, render the error state card
              if (!data || data.error) {
                return (
                  <WeatherCard
                    key={city.name}
                    city={city.name}
                    // Pass the specific error message to the card
                    error={data?.error || "Data unavailable"}
                    weather={null} // Pass null to weather prop
                  />
                );
              } 
              
              // Use live API data (asserting that 'current' is present)
              const currentWeather = data.current!; 
              
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