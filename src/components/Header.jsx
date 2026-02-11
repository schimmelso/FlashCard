import React from 'react';
import { Share2, Edit3, Eye, PlusCircle, Trash2, Check } from 'lucide-react';
import { generateShareUrl } from '../utils/compression';

export const Header = ({ 
  decks, 
  activeDeck, 
  setActiveDeckId, 
  mode, 
  setMode, 
  onAddDeck,
  onDeleteDeck 
}) => {
  const [showCopySuccess, setShowCopySuccess] = React.useState(false);

  const handleShare = () => {
    const url = generateShareUrl(activeDeck);
    navigator.clipboard.writeText(url).then(() => {
      setShowCopySuccess(true);
      setTimeout(() => setShowCopySuccess(false), 2000);
    });
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-hidden">
          <h1 className="text-xl font-black text-blue-600 hidden sm:block">POLYGLOT</h1>
          
          <select 
            value={activeDeck.id}
            onChange={(e) => setActiveDeckId(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 max-w-[150px] sm:max-w-[200px]"
            aria-label="Select Deck"
          >
            {decks.map(deck => (
              <option key={deck.id} value={deck.id}>{deck.title}</option>
            ))}
          </select>

          <button 
            onClick={onAddDeck}
            className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
            title="Create New Deck"
            aria-label="Create New Deck"
          >
            <PlusCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setMode('view')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${
                mode === 'view' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
              aria-label="View Mode"
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:block">View</span>
            </button>
            <button
              onClick={() => setMode('edit')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${
                mode === 'edit' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
              aria-label="Edit Mode"
            >
              <Edit3 className="w-4 h-4" />
              <span className="hidden sm:block">Edit</span>
            </button>
          </div>

          <button
            onClick={handleShare}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              showCopySuccess ? 'bg-green-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
            }`}
            aria-label="Share Deck"
          >
            {showCopySuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span className="hidden sm:block">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:block">Share</span>
              </>
            )}
          </button>

          {decks.length > 1 && mode === 'edit' && (
            <button
              onClick={() => onDeleteDeck(activeDeck.id)}
              className="p-2 text-slate-400 hover:text-red-600 transition-colors"
              title="Delete Current Deck"
              aria-label="Delete Current Deck"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
