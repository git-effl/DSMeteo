import { CityItem, DailyForecast, TemperatureUnit, WeatherCondition, WeatherData } from '../types/weather';

export const DEFAULT_CITIES: CityItem[] = [
  { id: 'rome', name: 'Rome', country: 'Italy', region: 'Lazio', latitude: 41.8919, longitude: 12.5113 },
  { id: 'tokyo', name: 'Tokyo', country: 'Japan', region: 'Kanto', latitude: 35.6895, longitude: 139.6917 },
  { id: 'new-york', name: 'New York', country: 'United States', region: 'New York', latitude: 40.7128, longitude: -74.0060 },
  { id: 'london', name: 'London', country: 'United Kingdom', region: 'England', latitude: 51.5074, longitude: -0.1278 },
  { id: 'paris', name: 'Paris', country: 'France', region: 'Île-de-France', latitude: 48.8566, longitude: 2.3522 },
  { id: 'sydney', name: 'Sydney', country: 'Australia', region: 'New South Wales', latitude: -33.8688, longitude: 151.2093 },
];

/**
 * Maps WMO Weather interpretation codes (WW) to Nintendo DS weather categories and descriptions
 */
export function interpretWeatherCode(code: number, isDay: boolean = true): WeatherCondition {
  // Clear sky
  if (code === 0) {
    return {
      code,
      label: isDay ? 'CLEAR SUN' : 'CLEAR NIGHT',
      category: isDay ? 'sunny' : 'night',
      description: isDay ? 'Clear sunny sky' : 'Crisp starry night',
    };
  }
  // Mainly clear, partly cloudy
  if (code === 1 || code === 2) {
    return {
      code,
      label: 'PARTLY CLOUDY',
      category: 'cloudy',
      description: 'Scattered clouds with sunshine',
    };
  }
  // Overcast
  if (code === 3) {
    return {
      code,
      label: 'OVERCAST',
      category: 'cloudy',
      description: 'Heavy blanket of clouds',
    };
  }
  // Fog and depositing rime fog
  if (code === 45 || code === 48) {
    return {
      code,
      label: 'FOGGY MIST',
      category: 'fog',
      description: 'Reduced visibility and mist',
    };
  }
  // Drizzle
  if (code >= 51 && code <= 57) {
    return {
      code,
      label: 'LIGHT DRIZZLE',
      category: 'rain',
      description: 'Gentle misty rainfall',
    };
  }
  // Rain (slight, moderate, heavy)
  if (code >= 61 && code <= 67) {
    const isHeavy = code === 65 || code === 67;
    return {
      code,
      label: isHeavy ? 'HEAVY RAIN' : 'RAINING',
      category: 'rain',
      description: isHeavy ? 'Intense downpour' : 'Steady rain showers',
    };
  }
  // Snow fall
  if (code >= 71 && code <= 77) {
    const isHeavy = code === 75 || code === 77;
    return {
      code,
      label: isHeavy ? 'HEAVY SNOW' : 'SNOWFALL',
      category: 'snow',
      description: isHeavy ? 'Blizzard snow flurry' : 'Gentle falling snow',
    };
  }
  // Rain showers
  if (code >= 80 && code <= 82) {
    return {
      code,
      label: 'RAIN SHOWERS',
      category: 'rain',
      description: 'Passing rain clouds',
    };
  }
  // Snow showers
  if (code >= 85 && code <= 86) {
    return {
      code,
      label: 'SNOW SHOWERS',
      category: 'snow',
      description: 'Periodic snowfall',
    };
  }
  // Thunderstorm
  if (code >= 95 && code <= 99) {
    return {
      code,
      label: 'THUNDERSTORM',
      category: 'thunder',
      description: 'Severe storm with lightning & thunder',
    };
  }

  // Fallback
  return {
    code,
    label: 'CLOUDY',
    category: 'cloudy',
    description: 'Cloudy skies',
  };
}

/**
 * Temperature Unit Converter
 */
export function convertTemperature(celsius: number, unit: TemperatureUnit): { value: number; unitLabel: string } {
  switch (unit) {
    case 'fahrenheit':
      return {
        value: Math.round((celsius * 9) / 5 + 32),
        unitLabel: '°F',
      };
    case 'kelvin':
      return {
        value: Math.round(celsius + 273.15),
        unitLabel: ' K',
      };
    case 'celsius':
    default:
      return {
        value: Math.round(celsius),
        unitLabel: '°C',
      };
  }
}

export function formatTempString(celsius: number, unit: TemperatureUnit): string {
  const { value, unitLabel } = convertTemperature(celsius, unit);
  return `${value}${unitLabel}`;
}

const DAY_NAMES = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

/**
 * Fetch live weather from Open-Meteo
 */
export async function fetchLiveWeather(city: CityItem): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,surface_pressure,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Weather fetch failed: ${res.statusText}`);
    }
    const data = await res.json();
    const current = data.current;
    const daily = data.daily;

    const dailyForecast: DailyForecast[] = (daily?.time || []).slice(0, 5).map((t: string, idx: number) => {
      const dateObj = new Date(t);
      const dayName = DAY_NAMES[dateObj.getDay()] || 'DAY';
      return {
        date: t,
        dayName,
        weatherCode: daily.weather_code?.[idx] ?? 0,
        tempMax: daily.temperature_2m_max?.[idx] ?? 20,
        tempMin: daily.temperature_2m_min?.[idx] ?? 12,
        precipitationProb: daily.precipitation_probability_max?.[idx] ?? 10,
      };
    });

    return {
      city: city.name,
      country: city.country,
      region: city.region,
      latitude: city.latitude,
      longitude: city.longitude,
      temperature: current.temperature_2m ?? 20,
      feelsLike: current.apparent_temperature ?? current.temperature_2m ?? 20,
      weatherCode: current.weather_code ?? 0,
      isDay: current.is_day === 1,
      humidity: current.relative_humidity_2m ?? 50,
      windSpeed: current.wind_speed_10m ?? 12,
      windDirection: current.wind_direction_10m ?? 180,
      pressure: current.surface_pressure ?? 1013,
      uvIndex: 4,
      precipitation: current.precipitation ?? 0,
      cloudCover: current.cloud_cover ?? 20,
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      dailyForecast,
    };
  } catch (error) {
    console.warn(`[WeatherService] Fallback to simulated data for ${city.name}:`, error);
    return getFallbackWeather(city);
  }
}

/**
 * Fallback realistic weather data generator when offline
 */
export function getFallbackWeather(city: CityItem): WeatherData {
  // Deterministic seed based on city name
  const hash = city.name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const baseTemp = 14 + (hash % 16);
  const weatherCodes = [0, 1, 2, 3, 61, 80, 95, 71];
  const chosenCode = weatherCodes[hash % weatherCodes.length];

  const now = new Date();
  const dailyForecast: DailyForecast[] = Array.from({ length: 5 }).map((_, i) => {
    const d = new Date();
    d.setDate(now.getDate() + i);
    const dayName = DAY_NAMES[d.getDay()];
    return {
      date: d.toISOString().split('T')[0],
      dayName,
      weatherCode: weatherCodes[(hash + i) % weatherCodes.length],
      tempMax: baseTemp + 3 + (i % 3),
      tempMin: baseTemp - 4 - (i % 2),
      precipitationProb: ((hash * (i + 1)) % 70),
    };
  });

  return {
    city: city.name,
    country: city.country,
    region: city.region,
    latitude: city.latitude,
    longitude: city.longitude,
    temperature: baseTemp,
    feelsLike: baseTemp - 1,
    weatherCode: chosenCode,
    isDay: true,
    humidity: 45 + (hash % 40),
    windSpeed: 8 + (hash % 18),
    windDirection: (hash * 45) % 360,
    pressure: 1010 + (hash % 12),
    uvIndex: 3 + (hash % 5),
    precipitation: chosenCode >= 61 ? 3.5 : 0,
    cloudCover: (chosenCode === 0) ? 5 : 65,
    lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    dailyForecast,
  };
}

/**
 * Open-Meteo Geocoding API to search any city worldwide
 */
export async function searchCities(query: string): Promise<CityItem[]> {
  const clean = query.trim();
  if (clean.length < 2) return [];

  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(clean)}&count=8&language=en&format=json`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.results || !Array.isArray(data.results)) return [];

    return data.results.map((r: { id?: number; name: string; country?: string; admin1?: string; latitude: number; longitude: number }) => ({
      id: `${r.name}-${r.latitude.toFixed(2)}-${r.longitude.toFixed(2)}`,
      name: r.name,
      country: r.country || 'Unknown',
      region: r.admin1 || '',
      latitude: r.latitude,
      longitude: r.longitude,
      custom: true,
    }));
  } catch (err) {
    console.warn('[WeatherService] City search failed:', err);
    // Local filter fallback
    return DEFAULT_CITIES.filter(c => c.name.toLowerCase().includes(clean.toLowerCase()));
  }
}
