/**
 * Side-effecting module: install a localStorage stub before any game module
 * that reads it at import time (SoundManager constructs its singleton on load
 * and calls localStorage.getItem). Import this FIRST in tests that pull in
 * audio-dependent modules via static imports.
 */
if (!globalThis.localStorage) {
  const store = new Map([['game_muted', 'true']]);
  globalThis.localStorage = {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, String(value)),
    removeItem: (key) => store.delete(key),
    clear: () => {
      store.clear();
      store.set('game_muted', 'true');
    }
  };
}
