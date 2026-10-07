import React, { useState, useEffect } from 'react';
import { TemperatureUnit, WeatherData } from '../types/weather';
import { interpretWeatherCode, formatTempString } from '../services/weatherService';
import { WeatherSymbol } from './WeatherSymbol';
import { Droplets, Wind, Gauge, SunMedium, Compass } from 'lucide-react';

interface TopScreenProps {
  weather: WeatherData | null;
  unit: TemperatureUnit;
  isLoading: boolean;
  onRefresh?: () => void;
}

export const TopScreen: React.FC<TopScreenProps> = ({
  weather,
  unit,
  isLoading,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
      );
      const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const date = String(now.getDate()).padStart(2, '0');
      const day = days[now.getDay()];
      setCurrentDate(`${year}/${month}/${date} (${day})`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const condition = weather
    ? interpretWeatherCode(weather.weatherCode, weather.isDay)
    : { code: 0, label: 'LOADING...', category: 'sunny' as const, description: 'Fetching forecast' };

  return (
    <div className="relative w-full aspect-[4/3] max-w-[480px] mx-auto bg-[#c8d6e5] text-slate-800 rounded-lg overflow-hidden border-[6px] border-[#222f3e] shadow-[inset_0_2px_8px_rgba(0,0,0,0.5),0_8px_20px_rgba(0,0,0,0.4)] flex flex-col font-noto select-none">
      {/* DS Screen Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none ds-scanlines opacity-40 z-20" />

      {/* Top DS System Bar (Status Header) */}
      <div className="h-7 bg-[#2e86de] text-white px-2.5 flex items-center justify-between text-[11px] font-semibold tracking-wider border-b-2 border-[#104f91] shadow-sm z-10 shrink-0">
        <div className="flex items-center gap-2">
          {/* Nintendo DS Wi-Fi icon */}
          <div className="flex items-end gap-0.5 h-3" title="DS Wireless Signal">
            <span className="w-1 h-1.5 bg-emerald-300 rounded-[1px]"></span>
            <span className="w-1 h-2 bg-emerald-300 rounded-[1px]"></span>
            <span className="w-1 h-3 bg-emerald-300 rounded-[1px]"></span>
          </div>
          <span className="text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)] font-bold">WEATHER DS</span>
        </div>

        {/* DS Clock & Date */}
        <div className="flex items-center gap-2 font-mono text-[11px] text-sky-100">
          <span>{currentDate}</span>
          <span className="bg-[#104f91] px-1.5 py-0.5 rounded text-white font-bold">{currentTime || '--:--:--'}</span>
        </div>

        {/* DS Battery Indicator */}
        <div className="flex items-center gap-1" title="DS Battery Full">
          <div className="w-5 h-2.5 border border-white rounded-[2px] p-[1px] flex gap-[1px]">
            <span className="flex-1 bg-emerald-300 rounded-[1px]"></span>
            <span className="flex-1 bg-emerald-300 rounded-[1px]"></span>
            <span className="flex-1 bg-emerald-300 rounded-[1px]"></span>
          </div>
          <span className="w-0.5 h-1.5 bg-white rounded-r-[1px]"></span>
        </div>
      </div>

      {/* Main Top Screen Display Area */}
      <div className="flex-1 p-3 flex flex-col justify-between bg-gradient-to-b from-[#eef2f7] via-[#e2e8f0] to-[#cbd5e1] overflow-hidden relative z-10">
        {isLoading && (
          <div className="absolute inset-0 bg-[#e2e8f0]/80 backdrop-blur-xs flex flex-col items-center justify-center z-30">
            <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mb-2" />
            <p className="text-xs font-bold text-slate-700 tracking-wider">CONNECTING TO METEO SATELLITE...</p>
          </div>
        )}

        {/* Upper Half: Weather Text (Left) & Weather Symbol (Right) */}
        <div className="grid grid-cols-12 gap-2 items-center bg-white/90 rounded border-2 border-[#94a3b8] p-2.5 shadow-sm">
          {/* Left: Weather Text */}
          <div className="col-span-7 flex flex-col justify-center space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 bg-[#2e86de] text-white rounded">
                LOCATION
              </span>
              <span className="text-[10px] text-slate-500 truncate">{weather?.country || 'GLOBAL'}</span>
            </div>

            {/* City Title */}
            <h1 className="text-lg font-black text-slate-900 tracking-tight leading-tight truncate">
              {weather?.city || 'SELECTING CITY...'}
            </h1>

            {/* Large Temperature Readout */}
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#0984e3] tracking-tighter drop-shadow-xs">
                {weather ? formatTempString(weather.temperature, unit) : '--'}
              </span>
              <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-300">
                FEELS {weather ? formatTempString(weather.feelsLike, unit) : '--'}
              </span>
            </div>

            {/* Condition label badge */}
            <div className="pt-0.5">
              <span className="inline-block text-[11px] font-extrabold uppercase tracking-wide text-slate-800 bg-amber-100/90 text-amber-900 px-2 py-0.5 rounded border border-amber-300/80">
                {condition.label}
              </span>
            </div>

            <p className="text-[10px] text-slate-600 italic leading-snug line-clamp-1">
              {condition.description}
            </p>
          </div>

          {/* Right/Adjacent: The Weather Symbol */}
          <div className="col-span-5 flex flex-col items-center justify-center p-1 bg-gradient-to-br from-sky-50 to-indigo-50/50 rounded border border-slate-300/80 shadow-inner relative overflow-hidden">
            <div className="absolute top-1 left-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
              RADAR
            </div>
            <div className="p-1 my-0.5">
              <WeatherSymbol condition={condition} size="md" animated={true} />
            </div>
            <div className="text-[9px] font-mono text-slate-500 font-semibold bg-white/80 px-2 py-0.5 rounded-full border border-slate-200">
              {weather ? (weather.isDay ? 'DAY CYCLE' : 'NIGHT CYCLE') : 'METEO'}
            </div>
          </div>
        </div>

        {/* Environmental Indicators Row (Compact DS LCD metrics) */}
        <div className="grid grid-cols-4 gap-1.5 my-1.5">
          <div className="bg-white/85 p-1 rounded border border-slate-300 flex items-center gap-1.5 shadow-2xs">
            <Droplets className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <div className="min-w-0">
              <div className="text-[8px] text-slate-400 uppercase font-bold leading-none">HUMIDITY</div>
              <div className="text-[11px] font-bold text-slate-800 leading-tight">
                {weather ? `${weather.humidity}%` : '--'}
              </div>
            </div>
          </div>

          <div className="bg-white/85 p-1 rounded border border-slate-300 flex items-center gap-1.5 shadow-2xs">
            <Wind className="w-3.5 h-3.5 text-teal-500 shrink-0" />
            <div className="min-w-0">
              <div className="text-[8px] text-slate-400 uppercase font-bold leading-none">WIND</div>
              <div className="text-[11px] font-bold text-slate-800 leading-tight truncate">
                {weather ? `${Math.round(weather.windSpeed)} km/h` : '--'}
              </div>
            </div>
          </div>

          <div className="bg-white/85 p-1 rounded border border-slate-300 flex items-center gap-1.5 shadow-2xs">
            <Gauge className="w-3.5 h-3.5 text-purple-500 shrink-0" />
            <div className="min-w-0">
              <div className="text-[8px] text-slate-400 uppercase font-bold leading-none">PRESSURE</div>
              <div className="text-[11px] font-bold text-slate-800 leading-tight">
                {weather ? `${Math.round(weather.pressure)} hPa` : '--'}
              </div>
            </div>
          </div>

          <div className="bg-white/85 p-1 rounded border border-slate-300 flex items-center gap-1.5 shadow-2xs">
            <SunMedium className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <div className="min-w-0">
              <div className="text-[8px] text-slate-400 uppercase font-bold leading-none">UV INDEX</div>
              <div className="text-[11px] font-bold text-slate-800 leading-tight">
                {weather ? `${weather.uvIndex} IDX` : '--'}
              </div>
            </div>
          </div>
        </div>

        {/* 5-Day Mini DS Forecast Strip */}
        <div className="bg-white/95 rounded border border-slate-300 p-1.5 shadow-sm">
          <div className="flex items-center justify-between text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1 px-1">
            <span>5-DAY FORECAST TELEMETRY</span>
            <span className="font-mono text-slate-400">UNIT: {unit.toUpperCase()}</span>
          </div>

          <div className="grid grid-cols-5 gap-1">
            {weather?.dailyForecast && weather.dailyForecast.length > 0 ? (
              weather.dailyForecast.map((day, idx) => {
                const dayCond = interpretWeatherCode(day.weatherCode, true);
                return (
                  <div
                    key={day.date || idx}
                    className="flex flex-col items-center bg-slate-50 hover:bg-sky-50 transition-colors p-1 rounded border border-slate-200 text-center"
                  >
                    <span className="text-[9px] font-bold text-slate-700">{day.dayName}</span>
                    <div className="my-0.5">
                      <WeatherSymbol condition={dayCond} size="sm" animated={false} />
                    </div>
                    <div className="text-[10px] font-bold text-slate-800">
                      {formatTempString(day.tempMax, unit)}
                    </div>
                    <div className="text-[8px] text-slate-400">
                      {formatTempString(day.tempMin, unit)}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-5 text-center text-xs text-slate-400 py-2">
                No forecast telemetry available
              </div>
            )}
          </div>
        </div>

        {/* DS Bottom Info Bar */}
        <div className="flex items-center justify-between text-[9px] text-slate-500 px-1 pt-1 font-mono">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            LIVE DS SATELLITE SYNC
          </span>
          <span>UPDATED: {weather?.lastUpdated || '--:--'}</span>
        </div>
      </div>
    </div>
  );
};
