import React, { useState } from 'react';
import { Plus, Trash2, Save, X, AlertTriangle } from 'lucide-react';
import { isApproachingLimit } from '../utils/compression';

export const DeckEditor = ({ deck, onUpdateDeck }) => {
  const [editingCardId, setEditingCardId] = useState(null);
  const [formData, setFormData] = useState(null);

  const approachingLimit = isApproachingLimit(deck);

  const startEdit = (card) => {
    setEditingCardId(card.id);
    setFormData({ ...card });
  };

  const startAdd = () => {
    if (approachingLimit) return;
    const newCard = {
      id: crypto.randomUUID(),
      emoji: '✨',
      word_en: '',
      sent_en: '',
      word_de: '',
      sent_de: '',
      word_zh: '',
      word_jyut: '',
      sent_zh: ''
    };
    setEditingCardId(newCard.id);
    setFormData(newCard);
  };

  const handleSave = () => {
    let updatedCards;
    if (deck.cards.find(c => c.id === editingCardId)) {
      updatedCards = deck.cards.map(c => c.id === editingCardId ? formData : c);
    } else {
      updatedCards = [...deck.cards, formData];
    }
    onUpdateDeck({ ...deck, cards: updatedCards });
    setEditingCardId(null);
    setFormData(null);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this card?')) {
      const updatedCards = deck.cards.filter(c => c.id !== id);
      onUpdateDeck({ ...deck, cards: updatedCards });
    }
  };

  const handleTitleChange = (e) => {
    onUpdateDeck({ ...deck, title: e.target.value });
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-500 mb-1">Deck Title</label>
          <input
            type="text"
            value={deck.title}
            onChange={handleTitleChange}
            className="text-2xl font-bold bg-transparent border-b-2 border-slate-200 focus:border-blue-500 outline-none w-full pb-1"
          />
        </div>
        
        <button
          onClick={startAdd}
          disabled={approachingLimit}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
            approachingLimit 
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
          }`}
          title={approachingLimit ? "Deck capacity reached for sharing" : ""}
        >
          <Plus className="w-5 h-5" />
          Add Card
        </button>
      </div>

      {approachingLimit && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3 text-amber-800">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">Deck capacity reached for sharing. You cannot add more cards to this deck.</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {deck.cards.map((card) => (
          <div key={card.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="text-3xl">{card.emoji}</div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-slate-900 truncate">{card.word_en} / {card.word_de} / {card.word_zh}</h3>
              <p className="text-sm text-slate-500 truncate">{card.sent_en}</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => startEdit(card)}
                className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
              >
                Edit
              </button>
              <button 
                onClick={() => handleDelete(card.id)}
                className="p-2 text-slate-400 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingCardId && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900">Edit Card</h2>
              <button onClick={() => setEditingCardId(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Emoji</label>
                  <input
                    type="text"
                    value={formData.emoji}
                    onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-2xl text-center"
                    maxLength={10}
                  />
                </div>
                <div className="col-span-3">
                  <label className="block text-sm font-medium text-slate-700 mb-1">English Word</label>
                  <input
                    type="text"
                    value={formData.word_en}
                    onChange={(e) => setFormData({ ...formData, word_en: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg"
                    placeholder="e.g. Dog"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">English Sentence</label>
                <input
                  type="text"
                  value={formData.sent_en}
                  onChange={(e) => setFormData({ ...formData, sent_en: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg"
                  placeholder="e.g. The dog is happy."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-bold text-green-700 text-sm uppercase tracking-wider">German</h4>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Word (with article)</label>
                    <input
                      type="text"
                      value={formData.word_de}
                      onChange={(e) => setFormData({ ...formData, word_de: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg"
                      placeholder="e.g. Der Hund"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Sentence</label>
                    <input
                      type="text"
                      value={formData.sent_de}
                      onChange={(e) => setFormData({ ...formData, sent_de: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold text-orange-700 text-sm uppercase tracking-wider">Cantonese</h4>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Traditional Characters</label>
                    <input
                      type="text"
                      value={formData.word_zh}
                      onChange={(e) => setFormData({ ...formData, word_zh: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg"
                      placeholder="e.g. 狗"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Jyutping</label>
                    <input
                      type="text"
                      value={formData.word_jyut}
                      onChange={(e) => setFormData({ ...formData, word_jyut: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg"
                      placeholder="e.g. gau2"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Sentence</label>
                    <input
                      type="text"
                      value={formData.sent_zh}
                      onChange={(e) => setFormData({ ...formData, sent_zh: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex gap-4">
              <button
                onClick={() => setEditingCardId(null)}
                className="flex-1 py-3 px-4 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-3 px-4 bg-blue-600 rounded-xl font-bold text-white hover:bg-blue-700 shadow-lg transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                Save Card
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
