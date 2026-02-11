import LZString from 'lz-string';

/**
 * Compresses a deck object into a URI-safe string.
 * @param {Object} deck - The deck object to compress.
 * @returns {string} The compressed string.
 */
export const compressDeck = (deck) => {
  const jsonString = JSON.stringify(deck);
  return LZString.compressToEncodedURIComponent(jsonString);
};

/**
 * Decompress a URI-safe string into a deck object.
 * @param {string} compressed - The compressed string.
 * @returns {Object|null} The decompressed deck object or null if failed.
 */
export const decompressDeck = (compressed) => {
  try {
    const jsonString = LZString.decompressFromEncodedURIComponent(compressed);
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Failed to decompress deck:', error);
    return null;
  }
};

/**
 * Generates a shareable URL for a deck.
 * @param {Object} deck - The deck object.
 * @returns {string} The full shareable URL.
 */
export const generateShareUrl = (deck) => {
  const compressed = compressDeck(deck);
  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}#deck=${compressed}`;
};

/**
 * Extracts a deck from the URL hash if present.
 * @returns {Object|null} The extracted deck or null.
 */
export const getDeckFromUrl = () => {
  const hash = window.location.hash;
  if (hash.startsWith('#deck=')) {
    const compressed = hash.substring(6);
    return decompressDeck(compressed);
  }
  return null;
};

export const CHARACTER_LIMIT = 7000;

/**
 * Checks if adding a card would likely exceed the sharing limit.
 * @param {Object} deck - Current deck.
 * @returns {boolean} True if approaching limit.
 */
export const isApproachingLimit = (deck) => {
  const compressed = compressDeck(deck);
  return compressed.length >= CHARACTER_LIMIT;
};
