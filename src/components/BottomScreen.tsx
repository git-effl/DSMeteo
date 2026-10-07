import React, { useState } from 'react';
import { CityItem, TemperatureUnit } from '../types/weather';
import { searchCities, DEFAULT_CITIES } from '../services/weatherService';
import { DsKeyboard } from './DsKeyboard';
import { dsSound } from '../utils/audio';
import {
  PlusCircle,
  MapPin,
  Thermometer,
  LogOut,
  Search,
  Check,
  Trash2,
  Volume2,
  VolumeX,
  RotateCw,
  Sparkles,
} from 'lucide-react';

interface BottomScreenProps {
  cities: CityItem[];
  selectedCity: CityItem;
  unit: TemperatureUnit;
  onSelectCity: (city: CityItem) => void;
  onAddCity: (city: CityItem) => void;
  onDeleteCity: (cityId: string) => void;
  onChangeUnit: (unit: TemperatureUnit) => void;
  onExitToLauncher: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

type BottomTab = 'use-city' | 'add-city' | 'indicators';

export const BottomScreen: React.FC<BottomScreenProps> = ({
  cities,
  selectedCity,
  unit,
  onSelectCity,
  onAddCity,
  onDeleteCity,
  onChangeUnit,
  onExitToLauncher,
  onRefresh,
  isRefreshing,
}) => {
  const [activeTab, setActiveTab] = useState<BottomTab>('use-city');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<CityItem[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showKeyboard, setShowKeyboard] = useState<boolean>(true);

  // Tab switching with sound
  const handleTabChange = (tab: BottomTab) => {
    dsSound.playTouch();
    setActiveTab(tab);
  };

  // Perform search
  const handleSearch = async (queryText?: string) => {
    const q = (queryText !== undefined ? queryText : searchQuery).trim();
    if (!q) return;
    setIsSearching(true);
    dsSound.playTouch();
    try {
      const results = await searchCities(q);
      setSearchResults(results);
    } finally {
      setIsSearching(false);
    }
  };

  // Select city
  const handleUseCity = (city: CityItem) => {
    dsSound.playConfirm();
    onSelectCity(city);
  };

  // Add new city
  const handleAddAndSelect = (city: CityItem) => {
    dsSound.playConfirm();
    onAddCity(city);
    onSelectCity(city);
    setActiveTab('use-city');
    setSearchQuery('');
    setSearchResults([]);
  };

  // Unit change
  const handleUnitChange = (newUnit: TemperatureUnit) => {
    dsSound.playSwitch();
    onChangeUnit(newUnit);
  };

  // Exit button
  const handleExit = () => {
    dsSound.playCancel();
    onExitToLauncher();
  };

  // Sound toggle
  const toggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    dsSound.enabled = nextState;
    if (nextState) dsSound.playConfirm();
  };

  return (
    <div className="relative w-full aspect-[4/3] max-w-[480px] mx-auto bg-[#dfe6e9] text-slate-800 rounded-lg overflow-hidden border-[6px] border-[#222f3e] shadow-[inset_0_2px_8px_rgba(0,0,0,0.5),0_8px_20px_rgba(0,0,0,0.4)] flex flex-col font-noto select-none">
      {/* Touch screen subtle grid overlay */}
      <div className="absolute inset-0 pointer-events-none ds-scanlines opacity-25 z-20" />

      {/* Top Touch Screen Nav Header */}
      <div className="h-8 bg-[#34495e] text-white px-2 flex items-center justify-between text-xs font-bold border-b-2 border-[#1e272e] z-10 shrink-0">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span className="text-[11px] tracking-wider text-slate-100 font-bold">TOUCH SCREEN CONTROLS</span>
        </div>

        {/* Quick Utilities */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh Meteo Data"
            className="p-1 hover:bg-slate-600 rounded text-sky-300 transition-colors cursor-pointer active:scale-95"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
          <button
            type="button"
            onClick={toggleSound}
            title={soundEnabled ? 'Mute DS Sound' : 'Enable DS Sound'}
            className="p-1 hover:bg-slate-600 rounded text-slate-200 transition-colors cursor-pointer active:scale-95"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-300" /> : <VolumeX className="w-3.5 h-3.5 text-rose-300" />}
          </button>
        </div>
      </div>

      {/* Navigation Buttons Row: Add City, Use City, Indicators, Exit to Launcher */}
      <div className="grid grid-cols-4 gap-1 p-1.5 bg-[#cbd5e1] border-b border-[#94a3b8] z-10 shrink-0">
        <button
          type="button"
          onClick={() => handleTabChange('use-city')}
          className={`py-1 px-1 rounded flex flex-col items-center justify-center text-[10px] font-extrabold cursor-pointer transition-all ds-btn-bevel ${
            activeTab === 'use-city'
              ? 'bg-[#2e86de] text-white border border-[#104f91]'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
          }`}
        >
          <MapPin className="w-3 h-3 mb-0.5" />
          <span>USE CITY</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('add-city')}
          className={`py-1 px-1 rounded flex flex-col items-center justify-center text-[10px] font-extrabold cursor-pointer transition-all ds-btn-bevel ${
            activeTab === 'add-city'
              ? 'bg-[#2e86de] text-white border border-[#104f91]'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
          }`}
        >
          <PlusCircle className="w-3 h-3 mb-0.5" />
          <span>ADD CITY</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('indicators')}
          className={`py-1 px-1 rounded flex flex-col items-center justify-center text-[10px] font-extrabold cursor-pointer transition-all ds-btn-bevel ${
            activeTab === 'indicators'
              ? 'bg-[#2e86de] text-white border border-[#104f91]'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
          }`}
        >
          <Thermometer className="w-3 h-3 mb-0.5" />
          <span>INDICATORS</span>
        </button>

        <button
          type="button"
          onClick={handleExit}
          className="py-1 px-1 rounded flex flex-col items-center justify-center text-[10px] font-extrabold cursor-pointer transition-all ds-btn-bevel bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white border border-rose-700"
        >
          <LogOut className="w-3 h-3 mb-0.5" />
          <span>LAUNCHER</span>
        </button>
      </div>

      {/* Main Touch Content Area */}
      <div className="flex-1 p-2 bg-[#f8fafc] overflow-y-auto z-10 flex flex-col">
        {/* TAB 1: USE CITY (City Manager & Selector) */}
        {activeTab === 'use-city' && (
          <div className="flex-1 flex flex-col justify-between space-y-1.5">
            <div>
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 mb-1 px-1">
                <span>SAVED CITIES ({cities.length})</span>
                <span className="text-[10px] text-blue-600 font-semibold">TAP CITY TO DISPLAY</span>
              </div>

              <div className="grid grid-cols-2 gap-1.5 max-h-[145px] overflow-y-auto pr-0.5">
                {cities.map((city) => {
                  const isSelected = selectedCity.id === city.id || selectedCity.name.toLowerCase() === city.name.toLowerCase();
                  return (
                    <div
                      key={city.id}
                      onClick={() => handleUseCity(city)}
                      className={`p-2 rounded border cursor-pointer transition-all flex items-center justify-between group ${
                        isSelected
                          ? 'bg-[#e0f2fe] border-[#0284c7] shadow-xs'
                          : 'bg-white hover:bg-slate-50 border-slate-300 shadow-2xs'
                      }`}
                    >
                      <div className="min-w-0 pr-1">
                        <div className="flex items-center gap-1">
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0"></span>}
                          <span className={`text-[12px] font-bold leading-tight truncate ${isSelected ? 'text-blue-900 font-black' : 'text-slate-800'}`}>
                            {city.name}
                          </span>
                        </div>
                        <div className="text-[9px] text-slate-500 truncate pl-2.5">
                          {city.country || city.region || 'World'}
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        {isSelected ? (
                          <span className="text-[9px] bg-blue-600 text-white font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                            <Check className="w-2.5 h-2.5" />
                            ACTIVE
                          </span>
                        ) : (
                          <span className="text-[9px] text-slate-400 group-hover:text-blue-600 font-bold px-1 py-0.5">
                            USE
                          </span>
                        )}

                        {city.custom && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              dsSound.playCancel();
                              onDeleteCity(city.id);
                            }}
                            title="Remove city"
                            className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick switcher helper banner */}
            <div className="bg-[#f1f5f9] p-1.5 rounded border border-slate-300 flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-1 text-slate-600">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Currently Active:</span>
                <span className="font-black text-slate-900">{selectedCity.name} ({selectedCity.country})</span>
              </div>
              <button
                type="button"
                onClick={() => handleTabChange('add-city')}
                className="text-[9px] bg-[#2e86de] text-white px-2 py-0.5 rounded font-bold hover:bg-[#0984e3] cursor-pointer"
              >
                + ADD MORE
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: ADD CITY (Search + Virtual Keyboard) */}
        {activeTab === 'add-city' && (
          <div className="flex-1 flex flex-col justify-between space-y-1">
            {/* Search Input Bar */}
            <div className="flex gap-1 items-center">
              <div className="flex-1 relative flex items-center">
                <Search className="w-3.5 h-3.5 absolute left-2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSearch();
                  }}
                  placeholder="Enter city (e.g. Madrid, Kyoto, Oslo)..."
                  className="w-full pl-7 pr-2 py-1 text-[11px] font-bold bg-white text-slate-800 rounded border border-slate-300 focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                type="button"
                onClick={() => handleSearch()}
                disabled={isSearching}
                className="px-2.5 py-1 bg-[#2e86de] hover:bg-[#0984e3] text-white rounded text-[10px] font-bold border border-[#104f91] cursor-pointer"
              >
                {isSearching ? 'FINDING...' : 'SEARCH'}
              </button>
              <button
                type="button"
                onClick={() => setShowKeyboard(!showKeyboard)}
                className="px-1.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-[9px] font-bold border border-slate-400 cursor-pointer"
              >
                {showKeyboard ? 'KEYBOARD ▼' : 'KEYBOARD ▲'}
              </button>
            </div>

            {/* Quick popular city presets */}
            <div className="flex items-center gap-1 overflow-x-auto py-0.5">
              <span className="text-[9px] font-bold text-slate-500 shrink-0">PRESETS:</span>
              {DEFAULT_CITIES.slice(0, 5).map((dc) => (
                <button
                  key={dc.id}
                  type="button"
                  onClick={() => {
                    setSearchQuery(dc.name);
                    handleSearch(dc.name);
                  }}
                  className="text-[9px] px-1.5 py-0.5 bg-slate-100 hover:bg-sky-100 text-slate-700 font-semibold rounded border border-slate-300 shrink-0 cursor-pointer"
                >
                  {dc.name}
                </button>
              ))}
            </div>

            {/* Results or Keyboard container */}
            {searchResults.length > 0 ? (
              <div className="flex-1 max-h-[105px] overflow-y-auto bg-white rounded border border-slate-300 p-1 space-y-1">
                <div className="text-[9px] font-bold text-slate-400 px-1">SEARCH RESULTS:</div>
                {searchResults.map((res) => (
                  <div
                    key={res.id}
                    className="p-1 px-2 rounded hover:bg-sky-50 flex items-center justify-between border border-transparent hover:border-sky-200 text-slate-800"
                  >
                    <div>
                      <div className="text-[11px] font-bold text-slate-900">{res.name}</div>
                      <div className="text-[9px] text-slate-500">
                        {res.region ? `${res.region}, ` : ''}{res.country}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddAndSelect(res)}
                      className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[9px] font-bold shadow-2xs cursor-pointer"
                    >
                      + USE THIS
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              showKeyboard && (
                <DsKeyboard
                  onKeyPress={(char) => setSearchQuery((prev) => prev + char)}
                  onBackspace={() => setSearchQuery((prev) => prev.slice(0, -1))}
                  onClear={() => setSearchQuery('')}
                  onSubmit={() => handleSearch()}
                />
              )
            )}
          </div>
        )}

        {/* TAB 3: INDICATORS (Fahrenheit, Celsius, Kelvin) */}
        {activeTab === 'indicators' && (
          <div className="flex-1 flex flex-col justify-between py-1">
            <div>
              <div className="text-[11px] font-bold text-slate-600 mb-2 px-1">
                SELECT METEOROLOGICAL TEMPERATURE INDICATOR:
              </div>

              <div className="grid grid-cols-3 gap-2">
                {/* CELSIUS */}
                <button
                  type="button"
                  onClick={() => handleUnitChange('celsius')}
                  className={`p-3 rounded-lg border-2 flex flex-col items-center justify-center cursor-pointer transition-all ds-btn-bevel ${
                    unit === 'celsius'
                      ? 'bg-gradient-to-b from-sky-500 to-blue-600 text-white border-blue-800 shadow-md ring-2 ring-blue-300'
                      : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300'
                  }`}
                >
                  <span className="text-2xl font-black font-mono">°C</span>
                  <span className="text-[11px] font-extrabold mt-1">CELSIUS</span>
                  <span className={`text-[8px] mt-0.5 ${unit === 'celsius' ? 'text-sky-100' : 'text-slate-400'}`}>
                    Standard Metric
                  </span>
                  {unit === 'celsius' && (
                    <span className="mt-1.5 px-2 py-0.5 bg-white text-blue-700 rounded-full text-[9px] font-black">
                      ACTIVE
                    </span>
                  )}
                </button>

                {/* FAHRENHEIT */}
                <button
                  type="button"
                  onClick={() => handleUnitChange('fahrenheit')}
                  className={`p-3 rounded-lg border-2 flex flex-col items-center justify-center cursor-pointer transition-all ds-btn-bevel ${
                    unit === 'fahrenheit'
                      ? 'bg-gradient-to-b from-amber-500 to-orange-600 text-white border-orange-800 shadow-md ring-2 ring-orange-300'
                      : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300'
                  }`}
                >
                  <span className="text-2xl font-black font-mono">°F</span>
                  <span className="text-[11px] font-extrabold mt-1">FAHRENHEIT</span>
                  <span className={`text-[8px] mt-0.5 ${unit === 'fahrenheit' ? 'text-orange-100' : 'text-slate-400'}`}>
                    Imperial Scale
                  </span>
                  {unit === 'fahrenheit' && (
                    <span className="mt-1.5 px-2 py-0.5 bg-white text-orange-700 rounded-full text-[9px] font-black">
                      ACTIVE
                    </span>
                  )}
                </button>

                {/* KELVIN */}
                <button
                  type="button"
                  onClick={() => handleUnitChange('kelvin')}
                  className={`p-3 rounded-lg border-2 flex flex-col items-center justify-center cursor-pointer transition-all ds-btn-bevel ${
                    unit === 'kelvin'
                      ? 'bg-gradient-to-b from-purple-500 to-indigo-600 text-white border-indigo-800 shadow-md ring-2 ring-indigo-300'
                      : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300'
                  }`}
                >
                  <span className="text-2xl font-black font-mono">K</span>
                  <span className="text-[11px] font-extrabold mt-1">KELVIN</span>
                  <span className={`text-[8px] mt-0.5 ${unit === 'kelvin' ? 'text-purple-100' : 'text-slate-400'}`}>
                    Scientific Base
                  </span>
                  {unit === 'kelvin' && (
                    <span className="mt-1.5 px-2 py-0.5 bg-white text-indigo-700 rounded-full text-[9px] font-black">
                      ACTIVE
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Conversion guide */}
            <div className="bg-slate-100 p-2 rounded border border-slate-300 text-[10px] text-slate-600 font-mono flex items-center justify-between">
              <span>0°C = 32°F = 273.15 K</span>
              <span className="font-bold text-blue-600">CHANGES INSTANTLY APPLIED</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Footer Ribbon with Exit to Launcher button prominent */}
      <div className="h-7 bg-[#2f3542] px-2 flex items-center justify-between text-[10px] text-slate-300 border-t border-[#1e272e] z-10 shrink-0">
        <span className="font-mono text-slate-400">TOUCH WITH STYLUS OR MOUSE</span>
        <button
          type="button"
          onClick={handleExit}
          className="px-2 py-0.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded text-[9px] flex items-center gap-1 cursor-pointer transition-colors"
        >
          <LogOut className="w-2.5 h-2.5" />
          EXIT TO LAUNCHER
        </button>
      </div>
    </div>
  );
};
