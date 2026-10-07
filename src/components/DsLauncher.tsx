import React, { useState, useRef } from 'react';
import { dsSound } from '../utils/audio';
import { CloudSun, MessageSquare, Radio, Settings, RotateCcw } from 'lucide-react';

interface DsLauncherProps {
  onLaunchWeather: () => void;
  shellColor: string;
  onSelectShellColor: (color: string) => void;
}

export const DsLauncher: React.FC<DsLauncherProps> = ({
  onLaunchWeather,
  shellColor,
  onSelectShellColor,
}) => {
  const [activeApp, setActiveApp] = useState<'menu' | 'pictochat' | 'settings'>('menu');
  const [pictoLines, setPictoLines] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Current real-time date
  const now = new Date();
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const dateStr = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`;
  const dayStr = days[now.getDay()];

  const handleLaunch = () => {
    dsSound.playBoot();
    onLaunchWeather();
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#1e293b';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    dsSound.playCancel();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const sendPicto = () => {
    dsSound.playConfirm();
    setPictoLines((prev) => [...prev, `Doodle ${prev.length + 1} sent at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`]);
    clearCanvas();
  };

  const shellColors = [
    { id: 'white', name: 'Polar White', bg: 'bg-slate-100', border: 'border-slate-300' },
    { id: 'black', name: 'Onyx Black', bg: 'bg-zinc-800', border: 'border-zinc-900' },
    { id: 'crimson', name: 'Crimson Red', bg: 'bg-red-700', border: 'border-red-900' },
    { id: 'cobalt', name: 'Cobalt Blue', bg: 'bg-blue-700', border: 'border-blue-900' },
    { id: 'silver', name: 'Metallic Silver', bg: 'bg-slate-400', border: 'border-slate-500' },
  ];

  return (
    <div className="flex flex-col gap-3 w-full max-w-[480px] mx-auto select-none font-noto">
      {/* Top Screen: Authentic DS Firmware Splash */}
      <div className="relative w-full aspect-[4/3] bg-gradient-to-b from-[#74b9ff] via-[#0984e3] to-[#0652dd] text-white rounded-lg overflow-hidden border-[6px] border-[#222f3e] shadow-[inset_0_2px_8px_rgba(0,0,0,0.5),0_8px_20px_rgba(0,0,0,0.4)] flex flex-col justify-between p-4">
        {/* Scanlines */}
        <div className="absolute inset-0 pointer-events-none ds-scanlines opacity-30 z-20" />

        {/* Top Header */}
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-black tracking-wider text-white drop-shadow-md">
              Nintendo DS™
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span>{dateStr} ({dayStr})</span>
            <div className="w-5 h-2.5 border border-white rounded-[2px] p-[1px] flex gap-[1px]">
              <span className="flex-1 bg-emerald-400"></span>
              <span className="flex-1 bg-emerald-400"></span>
              <span className="flex-1 bg-emerald-400"></span>
            </div>
          </div>
        </div>

        {/* Middle Top Banner */}
        <div className="my-auto text-center z-10 py-3 bg-black/20 backdrop-blur-xs rounded-xl border border-white/20">
          <div className="text-[11px] font-bold tracking-widest text-sky-200 uppercase">
            NINTENDO DS SYSTEM MENU
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white drop-shadow-md mt-0.5">
            WEATHER DS
          </h2>
          <p className="text-[11px] text-sky-100 font-medium mt-1">
            Slot-1: Weather DS Cartridge is ready.
          </p>
        </div>

        {/* Footer instructions */}
        <div className="text-center text-[10px] text-sky-200 z-10 font-bold tracking-wider">
          TOUCH THE CARTRIDGE BELOW TO RESUME WEATHER APP
        </div>
      </div>

      {/* Bottom Screen: Firmware Launcher Touch Menu */}
      <div className="relative w-full aspect-[4/3] bg-[#dfe6e9] text-slate-800 rounded-lg overflow-hidden border-[6px] border-[#222f3e] shadow-[inset_0_2px_8px_rgba(0,0,0,0.5),0_8px_20px_rgba(0,0,0,0.4)] flex flex-col">
        <div className="absolute inset-0 pointer-events-none ds-scanlines opacity-25 z-20" />

        {/* Launcher Header */}
        <div className="h-7 bg-[#2d3436] text-white px-3 flex items-center justify-between text-xs font-bold border-b border-[#1e272e] z-10">
          <span className="tracking-wider">TOUCH SCREEN</span>
          <span className="text-[10px] text-slate-300">USER: GEMINI</span>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-3 z-10 flex flex-col justify-between bg-[#f1f2f6]">
          {activeApp === 'menu' && (
            <div className="flex-1 flex flex-col justify-between">
              {/* Slot 1: WEATHER DS CARTRIDGE */}
              <button
                type="button"
                onClick={handleLaunch}
                className="w-full p-3 rounded-lg bg-gradient-to-r from-sky-400 to-blue-600 hover:from-sky-300 hover:to-blue-500 text-white flex items-center gap-3 border-2 border-blue-700 shadow-md cursor-pointer transition-transform active:scale-[0.99] group"
              >
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center border border-white/40 shrink-0">
                  <CloudSun className="w-8 h-8 text-amber-300 group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-left flex-1">
                  <div className="text-[10px] font-bold text-sky-100 tracking-wider">SLOT-1 CARTRIDGE</div>
                  <div className="text-base font-black text-white leading-tight">WEATHER DS</div>
                  <div className="text-[10px] text-sky-100">Tap here to launch weather radar & forecast</div>
                </div>
                <span className="px-2.5 py-1 bg-white text-blue-700 font-black text-xs rounded-full shadow-xs">
                  BOOT ▶
                </span>
              </button>

              {/* Other 3 tiles */}
              <div className="grid grid-cols-3 gap-2 my-2">
                {/* Pictochat */}
                <button
                  type="button"
                  onClick={() => {
                    dsSound.playTouch();
                    setActiveApp('pictochat');
                  }}
                  className="p-2 bg-white hover:bg-slate-50 rounded-lg border border-slate-300 flex flex-col items-center justify-center text-center shadow-xs cursor-pointer"
                >
                  <MessageSquare className="w-5 h-5 text-indigo-500 mb-1" />
                  <span className="text-[10px] font-bold text-slate-800">PictoChat</span>
                  <span className="text-[8px] text-slate-400">Room A</span>
                </button>

                {/* Download play */}
                <button
                  type="button"
                  onClick={() => {
                    dsSound.playTouch();
                    alert('DS Download Play: Searching for nearby Nintendo DS systems...');
                  }}
                  className="p-2 bg-white hover:bg-slate-50 rounded-lg border border-slate-300 flex flex-col items-center justify-center text-center shadow-xs cursor-pointer"
                >
                  <Radio className="w-5 h-5 text-amber-500 mb-1" />
                  <span className="text-[10px] font-bold text-slate-800">Download Play</span>
                  <span className="text-[8px] text-slate-400">Wireless</span>
                </button>

                {/* Settings */}
                <button
                  type="button"
                  onClick={() => {
                    dsSound.playTouch();
                    setActiveApp('settings');
                  }}
                  className="p-2 bg-white hover:bg-slate-50 rounded-lg border border-slate-300 flex flex-col items-center justify-center text-center shadow-xs cursor-pointer"
                >
                  <Settings className="w-5 h-5 text-emerald-500 mb-1" />
                  <span className="text-[10px] font-bold text-slate-800">DS Settings</span>
                  <span className="text-[8px] text-slate-400">Customise</span>
                </button>
              </div>

              {/* Quick Resume Button */}
              <button
                type="button"
                onClick={handleLaunch}
                className="w-full py-1.5 bg-[#2e86de] hover:bg-[#0984e3] text-white font-bold text-xs rounded border border-[#104f91] cursor-pointer shadow-xs"
              >
                ◀ RETURN TO NINTENDO DS WEATHER
              </button>
            </div>
          )}

          {/* Pictochat Mini Mode */}
          {activeApp === 'pictochat' && (
            <div className="flex-1 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-indigo-700">PICTOCHAT - ROOM A</span>
                <button
                  type="button"
                  onClick={() => setActiveApp('menu')}
                  className="text-[10px] text-slate-600 hover:text-slate-900 font-bold"
                >
                  BACK TO MENU ✕
                </button>
              </div>

              {/* Pictochat Canvas */}
              <div className="relative border-2 border-slate-400 rounded bg-white overflow-hidden shadow-inner flex-1 flex flex-col">
                <canvas
                  ref={canvasRef}
                  width={380}
                  height={110}
                  className="w-full h-full cursor-crosshair touch-none"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 mt-1">
                <button
                  type="button"
                  onClick={clearCanvas}
                  className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-[10px] font-bold"
                >
                  CLEAR
                </button>
                <button
                  type="button"
                  onClick={sendPicto}
                  className="flex-1 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-[10px] font-bold"
                >
                  SEND DOODLE ↵
                </button>
                <button
                  type="button"
                  onClick={handleLaunch}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-[10px] font-bold"
                >
                  WEATHER ▶
                </button>
              </div>
            </div>
          )}

          {/* DS Settings Mode */}
          {activeApp === 'settings' && (
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700">NINTENDO DS SYSTEM SETTINGS</span>
                  <button
                    type="button"
                    onClick={() => setActiveApp('menu')}
                    className="text-[10px] text-slate-600 hover:text-slate-900 font-bold"
                  >
                    BACK ✕
                  </button>
                </div>

                <div className="text-[10px] font-bold text-slate-500 mb-1">SELECT DS CHASSIS COLOR:</div>
                <div className="grid grid-cols-5 gap-1.5 mb-3">
                  {shellColors.map((sc) => (
                    <button
                      key={sc.id}
                      type="button"
                      onClick={() => {
                        dsSound.playTouch();
                        onSelectShellColor(sc.id);
                      }}
                      className={`p-1.5 rounded-lg border-2 flex flex-col items-center justify-center cursor-pointer transition-all ${
                        shellColor === sc.id ? 'ring-2 ring-blue-500 scale-105' : ''
                      } ${sc.bg} ${sc.border}`}
                    >
                      <span className={`text-[9px] font-bold ${sc.id === 'black' ? 'text-white' : 'text-slate-800'}`}>
                        {sc.name.split(' ')[0]}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="bg-slate-100 p-2 rounded border border-slate-300 text-[10px] text-slate-600">
                  <div><strong>Firmware Version:</strong> DS Weather OS v1.4</div>
                  <div><strong>Stylus Calibration:</strong> Aligned (4-point matrix)</div>
                  <div><strong>Audio Engine:</strong> Synthesized Web Audio DSP</div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLaunch}
                className="w-full py-1.5 bg-[#2e86de] hover:bg-[#0984e3] text-white font-bold text-xs rounded border border-[#104f91] cursor-pointer"
              >
                BOOT WEATHER DS ▶
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
