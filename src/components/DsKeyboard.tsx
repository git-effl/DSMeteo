import React from 'react';
import { dsSound } from '../utils/audio';

interface DsKeyboardProps {
  onKeyPress: (char: string) => void;
  onBackspace: () => void;
  onClear: () => void;
  onSubmit: () => void;
}

export const DsKeyboard: React.FC<DsKeyboardProps> = ({
  onKeyPress,
  onBackspace,
  onClear,
  onSubmit,
}) => {
  const rows = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', '-'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/'],
  ];

  const handleKey = (char: string) => {
    dsSound.playTouch();
    onKeyPress(char);
  };

  const handleBs = () => {
    dsSound.playTouch();
    onBackspace();
  };

  const handleClr = () => {
    dsSound.playCancel();
    onClear();
  };

  const handleSub = () => {
    dsSound.playConfirm();
    onSubmit();
  };

  return (
    <div className="w-full bg-[#f1f5f9] p-1.5 rounded border border-[#cbd5e1] shadow-inner select-none">
      <div className="flex flex-col gap-1">
        {rows.map((row, rIdx) => (
          <div key={rIdx} className="flex gap-1 justify-center">
            {row.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => handleKey(k)}
                className="flex-1 py-1 px-1 bg-white hover:bg-sky-100 active:bg-sky-200 text-slate-800 rounded border border-slate-300 text-[11px] font-bold shadow-2xs active:translate-y-[1px] transition-all flex items-center justify-center font-mono cursor-pointer"
              >
                {k}
              </button>
            ))}
          </div>
        ))}

        {/* Space, Backspace, Clear, Submit */}
        <div className="flex gap-1 mt-0.5">
          <button
            type="button"
            onClick={handleClr}
            className="w-14 py-1 bg-rose-50 hover:bg-rose-100 active:bg-rose-200 text-rose-700 rounded border border-rose-300 text-[10px] font-bold shadow-2xs active:translate-y-[1px] transition-all font-mono cursor-pointer"
          >
            CLEAR
          </button>
          <button
            type="button"
            onClick={() => handleKey(' ')}
            className="flex-1 py-1 bg-white hover:bg-sky-100 active:bg-sky-200 text-slate-800 rounded border border-slate-300 text-[10px] font-bold shadow-2xs active:translate-y-[1px] transition-all font-mono cursor-pointer"
          >
            SPACE
          </button>
          <button
            type="button"
            onClick={handleBs}
            className="w-14 py-1 bg-amber-50 hover:bg-amber-100 active:bg-amber-200 text-amber-800 rounded border border-amber-300 text-[10px] font-bold shadow-2xs active:translate-y-[1px] transition-all font-mono cursor-pointer"
          >
            BKSP ⌫
          </button>
          <button
            type="button"
            onClick={handleSub}
            className="w-16 py-1 bg-[#2e86de] hover:bg-[#0984e3] active:bg-[#0867b2] text-white rounded border border-[#104f91] text-[10px] font-bold shadow-2xs active:translate-y-[1px] transition-all font-mono cursor-pointer"
          >
            SEARCH ↵
          </button>
        </div>
      </div>
    </div>
  );
};
