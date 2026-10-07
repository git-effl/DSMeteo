import React, { useState, useEffect, useCallback } from 'react';
import { CityItem, TemperatureUnit, WeatherData } from './types/weather';
import { DEFAULT_CITIES, fetchLiveWeather } from './services/weatherService';
import { TopScreen } from './components/TopScreen';
import { BottomScreen } from './components/BottomScreen';
import { DsLauncher } from './components/DsLauncher';
import { DsConsoleFrame } from './components/DsConsoleFrame';
import { dsSound } from './utils/audio';

export default function App() {
  // Cities list with persistent storage
  const [cities, setCities] = useState<CityItem[]>(() => {
    try {
      const saved = localStorage.getItem('nds_weather_cities');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return DEFAULT_CITIES;
  });

  // Selected active city
  const [selectedCity, setSelectedCity] = useState<CityItem>(() => {
    try {
      const saved = localStorage.getItem('nds_weather_active_city');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return DEFAULT_CITIES[0];
  });

  // Temperature unit indicator (°C, °F, K)
  const [unit, setUnit] = useState<TemperatureUnit>(() => {
    try {
      const saved = localStorage.getItem('nds_weather_unit') as TemperatureUnit;
      if (saved && ['celsius', 'fahrenheit', 'kelvin'].includes(saved)) {
        return saved;
      }
    } catch {
      // fallback
    }
    return 'celsius';
  });

  // Launcher state
  const [isLauncherOpen, setIsLauncherOpen] = useState<boolean>(false);

  // Weather data
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Shell theme color & layout mode
  const [shellColor, setShellColor] = useState<string>('white');
  const [isMinimalistMode, setIsMinimalistMode] = useState<boolean>(false);
  const [stylusCursor, setStylusCursor] = useState<boolean>(false);

  // Save cities to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('nds_weather_cities', JSON.stringify(cities));
    } catch {
      // localStorage exception
    }
  }, [cities]);

  // Save selected city to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('nds_weather_active_city', JSON.stringify(selectedCity));
    } catch {
      // localStorage exception
    }
  }, [selectedCity]);

  // Save unit
  useEffect(() => {
    try {
      localStorage.setItem('nds_weather_unit', unit);
    } catch {
      // localStorage exception
    }
  }, [unit]);

  // Load weather for active city
  const loadWeather = useCallback(async (city: CityItem, isBackgroundRefresh: boolean = false) => {
    if (isBackgroundRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const data = await fetchLiveWeather(city);
      setWeather(data);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadWeather(selectedCity);
  }, [selectedCity, loadWeather]);

  // City handlers
  const handleSelectCity = (city: CityItem) => {
    setSelectedCity(city);
  };

  const handleAddCity = (city: CityItem) => {
    setCities((prev) => {
      // Avoid duplicate by id or name
      if (prev.some((c) => c.name.toLowerCase() === city.name.toLowerCase())) {
        return prev;
      }
      return [city, ...prev];
    });
  };

  const handleDeleteCity = (cityId: string) => {
    setCities((prev) => {
      const updated = prev.filter((c) => c.id !== cityId);
      if (selectedCity.id === cityId && updated.length > 0) {
        setSelectedCity(updated[0]);
      }
      return updated;
    });
  };

  // Unit handler
  const handleChangeUnit = (newUnit: TemperatureUnit) => {
    setUnit(newUnit);
  };

  // Cycle unit for physical button X
  const cycleUnit = () => {
    const cycle: Record<TemperatureUnit, TemperatureUnit> = {
      celsius: 'fahrenheit',
      fahrenheit: 'kelvin',
      kelvin: 'celsius',
    };
    const next = cycle[unit];
    setUnit(next);
    dsSound.playSwitch();
  };

  // Next / Previous city for D-Pad
  const cycleCity = (direction: 1 | -1) => {
    const currentIndex = cities.findIndex((c) => c.id === selectedCity.id || c.name === selectedCity.name);
    let nextIndex = currentIndex + direction;
    if (nextIndex < 0) nextIndex = cities.length - 1;
    if (nextIndex >= cities.length) nextIndex = 0;
    setSelectedCity(cities[nextIndex]);
    dsSound.playTouch();
  };

  // Refresh handler
  const handleRefresh = () => {
    dsSound.playTouch();
    loadWeather(selectedCity, true);
  };

  return (
    <div className={`min-h-screen bg-[#0f172a] text-slate-100 flex flex-col items-center justify-between p-2 sm:p-4 select-none ${stylusCursor ? 'cursor-cell' : ''}`}>
      {/* Top Universal Navbar / Quick Bar */}
      <header className="w-full max-w-xl mx-auto flex items-center justify-between py-2 px-3 bg-slate-800/80 backdrop-blur-md rounded-xl border border-slate-700 shadow-md text-xs mb-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-[#2e86de] flex items-center justify-center font-black text-white text-[10px] shadow-sm">
            DS
          </div>
          <div>
            <div className="font-extrabold text-white tracking-wide text-xs">NINTENDO DS WEATHER</div>
            <div className="text-[9px] text-slate-400 font-mono">NOTO SANS ENGINE • DUAL LCD</div>
          </div>
        </div>

        {/* View toggles */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setStylusCursor(!stylusCursor)}
            className={`px-2 py-1 rounded text-[10px] font-bold border cursor-pointer transition-colors ${
              stylusCursor ? 'bg-sky-600 text-white border-sky-400' : 'bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600'
            }`}
          >
            {stylusCursor ? '🖊 STYLUS ACTIVE' : 'STYLUS CURSOR'}
          </button>

          <button
            type="button"
            onClick={() => setIsMinimalistMode(!isMinimalistMode)}
            className="px-2 py-1 rounded text-[10px] font-bold bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600 cursor-pointer"
          >
            {isMinimalistMode ? 'CONSOLE VIEW' : 'MINIMALIST VIEW'}
          </button>
        </div>
      </header>

      {/* Main Dual-Screen Experience */}
      <main className="w-full flex-1 flex items-center justify-center">
        {isLauncherOpen ? (
          <DsLauncher
            onLaunchWeather={() => setIsLauncherOpen(false)}
            shellColor={shellColor}
            onSelectShellColor={(c) => setShellColor(c)}
          />
        ) : (
          <DsConsoleFrame
            shellColor={shellColor}
            isMinimalistMode={isMinimalistMode}
            onToggleMinimalist={() => setIsMinimalistMode(!isMinimalistMode)}
            onDpadUp={() => cycleCity(-1)}
            onDpadDown={() => cycleCity(1)}
            onButtonA={() => dsSound.playConfirm()}
            onButtonB={() => setIsLauncherOpen(true)}
            onButtonX={cycleUnit}
            onButtonY={() => {
              // Add city action shortcut
              dsSound.playTouch();
            }}
          >
            {{
              topScreen: (
                <TopScreen
                  weather={weather}
                  unit={unit}
                  isLoading={isLoading}
                  onRefresh={handleRefresh}
                />
              ),
              bottomScreen: (
                <BottomScreen
                  cities={cities}
                  selectedCity={selectedCity}
                  unit={unit}
                  onSelectCity={handleSelectCity}
                  onAddCity={handleAddCity}
                  onDeleteCity={handleDeleteCity}
                  onChangeUnit={handleChangeUnit}
                  onExitToLauncher={() => setIsLauncherOpen(true)}
                  onRefresh={handleRefresh}
                  isRefreshing={isRefreshing}
                />
              ),
            }}
          </DsConsoleFrame>
        )}
      </main>

      {/* Retro instructions footer */}
      <footer className="w-full max-w-xl mx-auto text-center py-2 text-[10px] text-slate-400 font-mono mt-2">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <span>▲/▼ D-PAD: Switch City</span>
          <span>•</span>
          <span>X: Cycle Unit (°C/°F/K)</span>
          <span>•</span>
          <span>B: Exit to Launcher</span>
          <span>•</span>
          <span>Touch: Interactive Stylus</span>
        </div>
      </footer>
    </div>
  );
}
