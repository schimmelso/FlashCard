import React, { useState, useEffect } from 'react';
import { useDeckLibrary } from './hooks/useDeckLibrary';
import { Header } from './components/Header';
import { DeckViewer } from './components/DeckViewer';
import { DeckEditor } from './components/DeckEditor';
import { getDeckFromUrl } from './utils/compression';
import { X } from 'lucide-react';

function App() {
  const { 
    decks, 
    activeDeck, 
    setActiveDeckId, 
    updateActiveDeck, 
    addDeck, 
    deleteDeck, 
    importDeck 
  } = useDeckLibrary();

  const [mode, setMode] = useState('view');
  const [sharedDeck, setSharedDeck] = useState(null);

  useEffect(() => {
    const deckFromUrl = getDeckFromUrl();
    if (deckFromUrl) {
      setSharedDeck(deckFromUrl);
      // Clear hash to avoid re-triggering on reload
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  const handleImport = (overwrite) => {
    importDeck(sharedDeck, overwrite);
    setSharedDeck(null);
  };

  const handleCreateDeck = () => {
    const title = prompt('Enter deck title:');
    if (title) {
      addDeck({ title, cards: [] });
      setMode('edit');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header 
        decks={decks}
        activeDeck={activeDeck}
        setActiveDeckId={setActiveDeckId}
        mode={mode}
        setMode={setMode}
        onAddDeck={handleCreateDeck}
        onDeleteDeck={deleteDeck}
      />

      <main className="flex-1 overflow-y-auto">
        {mode === 'view' ? (
          <DeckViewer deck={activeDeck} />
        ) : (
          <DeckEditor deck={activeDeck} onUpdateDeck={updateActiveDeck} />
        )}
      </main>

      {/* Import Prompt Modal */}
      {sharedDeck && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <span className="text-3xl">🎁</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">New Deck Shared!</h2>
            <p className="text-slate-600 mb-8">
              "<strong>{sharedDeck.title}</strong>" has been shared with you. 
              Would you like to save it to your library?
            </p>
            
            <div className="flex flex-col w-full gap-3">
              <button
                onClick={() => handleImport(false)}
                className="w-full py-4 bg-blue-600 rounded-xl font-bold text-white hover:bg-blue-700 shadow-lg transition-all"
              >
                Add to My Library
              </button>
              <button
                onClick={() => handleImport(true)}
                className="w-full py-4 border-2 border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all"
              >
                Overwrite Current Deck
              </button>
              <button
                onClick={() => setSharedDeck(null)}
                className="mt-2 text-slate-400 font-medium hover:text-slate-600 flex items-center justify-center gap-1"
              >
                <X className="w-4 h-4" />
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
