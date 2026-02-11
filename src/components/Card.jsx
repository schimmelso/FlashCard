import React, { useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const Card = ({ card, onFlip }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    const newFlipped = !isFlipped;
    setIsFlipped(newFlipped);
    if (newFlipped && onFlip) {
      onFlip();
    }
  };

  return (
    <div 
      className="w-full max-w-sm aspect-[3/4] perspective-1000 cursor-pointer"
      onClick={handleFlip}
    >
      <div className={cn(
        "relative w-full h-full transition-transform duration-500 transform-style-3d",
        isFlipped && "rotate-y-180"
      )}>
        {/* Front Side (English) */}
        <div className="absolute w-full h-full backface-hidden bg-white rounded-3xl shadow-xl border-4 border-blue-400 p-8 flex flex-col items-center justify-center text-center">
          <div className="text-8xl mb-6">{card.emoji}</div>
          <h2 className="text-5xl font-bold text-blue-900 mb-4">{card.word_en}</h2>
          <p className="text-2xl text-slate-600">{card.sent_en}</p>
          <div className="absolute bottom-6 text-slate-400 text-sm font-medium uppercase tracking-widest">English</div>
        </div>

        {/* Back Side (German & Cantonese) */}
        <div className="absolute w-full h-full backface-hidden bg-white rounded-3xl shadow-xl border-4 border-green-400 p-8 flex flex-col items-center justify-center text-center rotate-y-180">
          <div className="text-6xl mb-4">{card.emoji}</div>
          
          <div className="space-y-8 w-full">
            {/* German Section */}
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-4xl font-bold text-green-800">{card.word_de}</h2>
              <p className="text-xl text-slate-600 mt-1">{card.sent_de}</p>
              <div className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Deutsch</div>
            </div>

            {/* Cantonese Section */}
            <div>
              <h2 className="text-4xl font-bold text-orange-800">{card.word_zh}</h2>
              <p className="text-2xl text-orange-600 font-medium">{card.word_jyut}</p>
              <p className="text-xl text-slate-600 mt-2">{card.sent_zh}</p>
              <div className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">廣東話 (Cantonese)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
