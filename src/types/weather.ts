export type TemperatureUnit = 'celsius' | 'fahrenheit' | 'kelvin';

export interface WeatherCondition {
  code: number;
  label: string;
  category: 'sunny' | 'cloudy' | 'rain' | 'thunder' | 'snow' | 'fog' | 'night';
  description: string;
}

export interface DailyForecast {
  date: string;
  dayName: string;
  weatherCode: number;
  tempMax: number; // in Celsius
  tempMin: number; // in Celsius
  precipitationProb: number;
}

export interface WeatherData {
  city: string;
  country: string;
  region?: string;
  latitude: number;
  longitude: number;
  temperature: number; // in Celsius
  feelsLike: number; // in Celsius
  weatherCode: number;
  isDay: boolean;
  humidity: number; // percentage
  windSpeed: number; // km/h
  windDirection: number; // degrees
  pressure: number; // hPa
  uvIndex: number;
  precipitation: number; // mm
  cloudCover: number; // %
  lastUpdated: string;
  dailyForecast: DailyForecast[];
}

export interface CityItem {
  id: string;
  name: string;
  country: string;
  region?: string;
  latitude: number;
  longitude: number;
  custom?: boolean;
}
