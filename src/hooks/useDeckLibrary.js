import { useState, useEffect } from 'react';
import { starterDeck } from '../data/starterDeck';

const STORAGE_KEY = 'polyglot_flashcards_decks';
const ACTIVE_DECK_KEY = 'polyglot_flashcards_active_id';

export const useDeckLibrary = () => {
  const [decks, setDecks] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [starterDeck];
  });

  const [activeDeckId, setActiveDeckId] = useState(() => {
    const saved = localStorage.getItem(ACTIVE_DECK_KEY);
    return saved || (decks[0]?.id || starterDeck.id);
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(decks));
  }, [decks]);

  useEffect(() => {
    localStorage.setItem(ACTIVE_DECK_KEY, activeDeckId);
  }, [activeDeckId]);

  const activeDeck = decks.find(d => d.id === activeDeckId) || decks[0];

  const updateActiveDeck = (updatedDeck) => {
    setDecks(prev => prev.map(d => d.id === updatedDeck.id ? updatedDeck : d));
  };

  const addDeck = (deck) => {
    const newDeck = { ...deck, id: deck.id || crypto.randomUUID() };
    setDecks(prev => [...prev, newDeck]);
    setActiveDeckId(newDeck.id);
    return newDeck;
  };

  const deleteDeck = (id) => {
    if (decks.length <= 1) return; // Don't delete last deck
    setDecks(prev => prev.filter(d => d.id !== id));
    if (activeDeckId === id) {
      setActiveDeckId(decks.find(d => d.id !== id).id);
    }
  };

  const importDeck = (deck, overwrite = false) => {
    if (overwrite) {
       // Find if deck with same id or title exists
       const existingIndex = decks.findIndex(d => d.id === deck.id || d.title === deck.title);
       if (existingIndex > -1) {
         const newDecks = [...decks];
         newDecks[existingIndex] = { ...deck, id: newDecks[existingIndex].id };
         setDecks(newDecks);
         setActiveDeckId(newDecks[existingIndex].id);
         return;
       }
    }
    // Otherwise just add it as a new deck
    const newDeck = { ...deck, id: crypto.randomUUID() };
    setDecks(prev => [...prev, newDeck]);
    setActiveDeckId(newDeck.id);
  };

  return {
    decks,
    activeDeck,
    setActiveDeckId,
    updateActiveDeck,
    addDeck,
    deleteDeck,
    importDeck
  };
};
