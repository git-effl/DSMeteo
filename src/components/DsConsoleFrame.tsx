import React from 'react';
import { dsSound } from '../utils/audio';

interface DsConsoleFrameProps {
  children: {
    topScreen: React.ReactNode;
    bottomScreen: React.ReactNode;
  };
  shellColor: string;
  isMinimalistMode: boolean;
  onToggleMinimalist: () => void;
  onDpadUp?: () => void;
  onDpadDown?: () => void;
  onButtonA?: () => void;
  onButtonB?: () => void;
  onButtonX?: () => void;
  onButtonY?: () => void;
}

export const DsConsoleFrame: React.FC<DsConsoleFrameProps> = ({
  children,
  shellColor,
  isMinimalistMode,
  onToggleMinimalist,
  onDpadUp,
  onDpadDown,
  onButtonA,
  onButtonB,
  onButtonX,
  onButtonY,
}) => {
  // Shell styles according to selected color
  const shellThemeMap: Record<string, { body: string; hinge: string; button: string; border: string }> = {
    white: {
      body: 'bg-gradient-to-b from-slate-100 via-slate-200 to-slate-300',
      hinge: 'bg-gradient-to-r from-slate-300 via-slate-200 to-slate-300',
      button: 'bg-slate-300 hover:bg-slate-200 active:bg-slate-400 text-slate-800 border-slate-400',
      border: 'border-slate-300 shadow-[0_15px_35px_rgba(0,0,0,0.5)]',
    },
    black: {
      body: 'bg-gradient-to-b from-zinc-800 via-zinc-900 to-black',
      hinge: 'bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800',
      button: 'bg-zinc-700 hover:bg-zinc-600 active:bg-zinc-800 text-slate-200 border-zinc-600',
      border: 'border-zinc-700 shadow-[0_15px_35px_rgba(0,0,0,0.8)]',
    },
    crimson: {
      body: 'bg-gradient-to-b from-red-700 via-red-800 to-red-950',
      hinge: 'bg-gradient-to-r from-red-800 via-red-700 to-red-800',
      button: 'bg-red-900 hover:bg-red-800 active:bg-red-950 text-red-100 border-red-950',
      border: 'border-red-600 shadow-[0_15px_35px_rgba(0,0,0,0.7)]',
    },
    cobalt: {
      body: 'bg-gradient-to-b from-blue-700 via-blue-800 to-blue-950',
      hinge: 'bg-gradient-to-r from-blue-800 via-blue-700 to-blue-800',
      button: 'bg-blue-900 hover:bg-blue-800 active:bg-blue-950 text-blue-100 border-blue-950',
      border: 'border-blue-600 shadow-[0_15px_35px_rgba(0,0,0,0.7)]',
    },
    silver: {
      body: 'bg-gradient-to-b from-slate-300 via-slate-400 to-slate-500',
      hinge: 'bg-gradient-to-r from-slate-400 via-slate-300 to-slate-400',
      button: 'bg-slate-500 hover:bg-slate-400 active:bg-slate-600 text-white border-slate-600',
      border: 'border-slate-400 shadow-[0_15px_35px_rgba(0,0,0,0.6)]',
    },
  };

  const theme = shellThemeMap[shellColor] || shellThemeMap.white;

  if (isMinimalistMode) {
    return (
      <div className="flex flex-col items-center justify-center p-2 sm:p-4 max-w-lg mx-auto">
        {/* Sleek Minimalist Top Screen */}
        <div className="w-full mb-3">{children.topScreen}</div>

        {/* Minimalist Hinge Gap */}
        <div className="w-full flex items-center justify-between px-6 py-1 bg-slate-800/80 rounded-md my-1 border border-slate-700">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[10px] font-mono text-slate-300 tracking-wider">DS DUAL LCD LINK</span>
          </div>
          <button
            type="button"
            onClick={onToggleMinimalist}
            className="text-[10px] text-sky-400 hover:text-sky-300 font-bold cursor-pointer"
          >
            SHOW CONSOLE CHASSIS ▶
          </button>
        </div>

        {/* Sleek Minimalist Bottom Screen */}
        <div className="w-full mt-2">{children.bottomScreen}</div>
      </div>
    );
  }

  return (
    <div className="relative max-w-[540px] mx-auto p-3 sm:p-6 transition-all duration-300">
      {/* Nintendo DS Handheld Body Shell */}
      <div className={`relative rounded-3xl p-4 sm:p-6 border-4 ${theme.body} ${theme.border} select-none`}>
        {/* Top Shell Housing */}
        <div className="relative mb-3">
          {/* Stereo Speakers (Left and Right of Top Screen) */}
          <div className="absolute top-1/2 -left-3 -translate-y-1/2 flex flex-col gap-1 opacity-60">
            <div className="flex gap-1"><span className="w-1.5 h-1.5 rounded-full bg-black/40"></span><span className="w-1.5 h-1.5 rounded-full bg-black/40"></span></div>
            <div className="flex gap-1"><span className="w-1.5 h-1.5 rounded-full bg-black/40"></span><span className="w-1.5 h-1.5 rounded-full bg-black/40"></span></div>
            <div className="flex gap-1"><span className="w-1.5 h-1.5 rounded-full bg-black/40"></span><span className="w-1.5 h-1.5 rounded-full bg-black/40"></span></div>
          </div>

          <div className="absolute top-1/2 -right-3 -translate-y-1/2 flex flex-col gap-1 opacity-60">
            <div className="flex gap-1"><span className="w-1.5 h-1.5 rounded-full bg-black/40"></span><span className="w-1.5 h-1.5 rounded-full bg-black/40"></span></div>
            <div className="flex gap-1"><span className="w-1.5 h-1.5 rounded-full bg-black/40"></span><span className="w-1.5 h-1.5 rounded-full bg-black/40"></span></div>
            <div className="flex gap-1"><span className="w-1.5 h-1.5 rounded-full bg-black/40"></span><span className="w-1.5 h-1.5 rounded-full bg-black/40"></span></div>
          </div>

          {/* Top Screen */}
          {children.topScreen}
        </div>

        {/* Nintendo DS Central Hinge & Power LEDs */}
        <div className={`h-8 sm:h-9 my-3 rounded-md ${theme.hinge} border-y-2 border-black/30 shadow-inner flex items-center justify-between px-4 sm:px-8 relative`}>
          {/* Left Hinge Joint */}
          <div className="w-5 h-5 rounded-full bg-black/20 border border-black/40 shadow-inner flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-black/30"></div>
          </div>

          {/* Center Brand / Microphone */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-black tracking-wider text-slate-700/80 drop-shadow-xs">
                Nintendo DS
              </span>
            </div>
            {/* Mic hole */}
            <div className="flex items-center gap-0.5" title="MIC">
              <span className="text-[8px] font-bold text-slate-500">MIC</span>
              <span className="w-1.5 h-1.5 rounded-full bg-black/60"></span>
            </div>
          </div>

          {/* Right Hinge Joint & Status LEDs */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              {/* Power LED (Solid green) */}
              <div className="flex flex-col items-center">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]"></span>
                <span className="text-[7px] font-bold text-slate-600">POWER</span>
              </div>
              {/* Wi-Fi LED */}
              <div className="flex flex-col items-center">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_6px_#fbbf24]"></span>
                <span className="text-[7px] font-bold text-slate-600">WIFI</span>
              </div>
            </div>
            <div className="w-5 h-5 rounded-full bg-black/20 border border-black/40 shadow-inner flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-black/30"></div>
            </div>
          </div>
        </div>

        {/* Bottom Shell Housing with Controls */}
        <div className="relative mt-3">
          {/* Bottom Touch Screen */}
          {children.bottomScreen}

          {/* Physical DS Controls Bar Below Screen (Authentic D-Pad & A/B/X/Y) */}
          <div className="flex items-center justify-between mt-4 px-2">
            {/* D-Pad Controls (Scroll cities) */}
            <div className="relative w-20 h-20 flex items-center justify-center">
              {/* Cross background */}
              <div className="absolute w-6 h-18 bg-zinc-700 rounded-md shadow-md border border-zinc-900"></div>
              <div className="absolute w-18 h-6 bg-zinc-700 rounded-md shadow-md border border-zinc-900"></div>
              {/* D-Pad Up Button */}
              <button
                type="button"
                onClick={() => {
                  dsSound.playTouch();
                  onDpadUp?.();
                }}
                title="Scroll Cities Up"
                className="absolute top-0 w-6 h-6 flex items-center justify-center text-slate-300 hover:text-white font-bold text-xs cursor-pointer active:scale-95 z-10"
              >
                ▲
              </button>
              {/* D-Pad Down Button */}
              <button
                type="button"
                onClick={() => {
                  dsSound.playTouch();
                  onDpadDown?.();
                }}
                title="Scroll Cities Down"
                className="absolute bottom-0 w-6 h-6 flex items-center justify-center text-slate-300 hover:text-white font-bold text-xs cursor-pointer active:scale-95 z-10"
              >
                ▼
              </button>
              {/* D-Pad Left Button */}
              <button
                type="button"
                onClick={() => {
                  dsSound.playTouch();
                  onDpadDown?.();
                }}
                className="absolute left-0 w-6 h-6 flex items-center justify-center text-slate-300 hover:text-white font-bold text-xs cursor-pointer active:scale-95 z-10"
              >
                ◀
              </button>
              {/* D-Pad Right Button */}
              <button
                type="button"
                onClick={() => {
                  dsSound.playTouch();
                  onDpadUp?.();
                }}
                className="absolute right-0 w-6 h-6 flex items-center justify-center text-slate-300 hover:text-white font-bold text-xs cursor-pointer active:scale-95 z-10"
              >
                ▶
              </button>
              {/* Center indentation */}
              <div className="w-3 h-3 rounded-full bg-zinc-900 z-10"></div>
            </div>

            {/* START & SELECT BUTTONS */}
            <div className="flex flex-col gap-2 items-center">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    dsSound.playTouch();
                    onButtonX?.();
                  }}
                  className="px-2 py-0.5 bg-zinc-600 hover:bg-zinc-500 rounded-full text-[8px] font-bold text-slate-200 border border-zinc-800 shadow-xs cursor-pointer active:scale-95"
                >
                  START
                </button>
                <button
                  type="button"
                  onClick={() => {
                    dsSound.playTouch();
                    onButtonY?.();
                  }}
                  className="px-2 py-0.5 bg-zinc-600 hover:bg-zinc-500 rounded-full text-[8px] font-bold text-slate-200 border border-zinc-800 shadow-xs cursor-pointer active:scale-95"
                >
                  SELECT
                </button>
              </div>
              <button
                type="button"
                onClick={onToggleMinimalist}
                className="text-[9px] text-slate-600 hover:text-slate-900 font-bold bg-white/50 px-2 py-0.5 rounded-full border border-black/10 cursor-pointer"
              >
                MINIMALIST MODE
              </button>
            </div>

            {/* A / B / X / Y Diamond Buttons */}
            <div className="relative w-20 h-20 flex items-center justify-center">
              {/* X Button (Top) */}
              <button
                type="button"
                onClick={() => {
                  dsSound.playSwitch();
                  onButtonX?.();
                }}
                title="Change Unit (X)"
                className="absolute top-0 w-6 h-6 rounded-full bg-zinc-700 hover:bg-zinc-600 active:bg-zinc-800 text-slate-200 font-bold text-[10px] flex items-center justify-center shadow-md border border-zinc-900 cursor-pointer active:scale-90"
              >
                X
              </button>

              {/* Y Button (Left) */}
              <button
                type="button"
                onClick={() => {
                  dsSound.playTouch();
                  onButtonY?.();
                }}
                title="Add City (Y)"
                className="absolute left-0 w-6 h-6 rounded-full bg-zinc-700 hover:bg-zinc-600 active:bg-zinc-800 text-slate-200 font-bold text-[10px] flex items-center justify-center shadow-md border border-zinc-900 cursor-pointer active:scale-90"
              >
                Y
              </button>

              {/* B Button (Bottom) */}
              <button
                type="button"
                onClick={() => {
                  dsSound.playCancel();
                  onButtonB?.();
                }}
                title="Cancel / Exit (B)"
                className="absolute bottom-0 w-6 h-6 rounded-full bg-rose-700 hover:bg-rose-600 active:bg-rose-800 text-white font-bold text-[10px] flex items-center justify-center shadow-md border border-rose-950 cursor-pointer active:scale-90"
              >
                B
              </button>

              {/* A Button (Right) */}
              <button
                type="button"
                onClick={() => {
                  dsSound.playConfirm();
                  onButtonA?.();
                }}
                title="Confirm / Select (A)"
                className="absolute right-0 w-6 h-6 rounded-full bg-blue-700 hover:bg-blue-600 active:bg-blue-800 text-white font-bold text-[10px] flex items-center justify-center shadow-md border border-blue-950 cursor-pointer active:scale-90"
              >
                A
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
