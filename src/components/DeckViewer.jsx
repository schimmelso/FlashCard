import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

export const DeckViewer = ({ deck }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setCurrentIndex(0);
  }, [deck]);

  const cards = deck.cards;
  const currentCard = cards[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % cards.length);
    setShowSuccess(false);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    setShowSuccess(false);
  };

  const handleFlip = () => {
    setShowSuccess(true);
    // Hide success after a delay
    setTimeout(() => setShowSuccess(false), 2000);
  };

  if (!cards || cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <p className="text-2xl text-slate-500">No cards in this deck yet.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto px-4 py-8">
      <div className="relative w-full flex justify-center items-center">
        {/* Success Overlay */}
        {showSuccess && (
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10 flex items-center justify-center">
            <div className="animate-bounce-short">
              <CheckCircle2 className="w-24 h-24 text-green-500 fill-green-50 opacity-80" />
            </div>
          </div>
        )}

        <button 
          onClick={handlePrev}
          className="absolute left-[-20px] md:left-[-60px] p-2 rounded-full bg-white shadow-lg hover:bg-slate-50 transition-colors z-20"
          aria-label="Previous card"
        >
          <ChevronLeft className="w-8 h-8 text-slate-600" />
        </button>

        <Card 
          key={currentCard.id} 
          card={currentCard} 
          onFlip={handleFlip}
        />

        <button 
          onClick={handleNext}
          className="absolute right-[-20px] md:right-[-60px] p-2 rounded-full bg-white shadow-lg hover:bg-slate-50 transition-colors z-20"
          aria-label="Next card"
        >
          <ChevronRight className="w-8 h-8 text-slate-600" />
        </button>
      </div>

      <div className="mt-8 flex items-center gap-4">
        <div className="text-lg font-medium text-slate-500">
          Card {currentIndex + 1} of {cards.length}
        </div>
      </div>
      
      <style>{`
        @keyframes bounce-short {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.1); }
        }
        .animate-bounce-short {
          animation: bounce-short 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};
