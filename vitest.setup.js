import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Node 25's experimental --localstorage-file feature ships a stub that overrides
// jsdom/happy-dom's window.localStorage. Replace both with a working in-memory
// implementation so tests can rely on it.
function makeStorageShim() {
  let map = new Map();
  return {
    get length() { return map.size; },
    clear() { map = new Map(); },
    getItem(k) { return map.has(k) ? map.get(k) : null; },
    setItem(k, v) { map.set(String(k), String(v)); },
    removeItem(k) { map.delete(k); },
    key(i) { return Array.from(map.keys())[i] || null; },
  };
}

const localShim = makeStorageShim();
const sessionShim = makeStorageShim();

Object.defineProperty(globalThis, 'localStorage', { value: localShim, configurable: true, writable: true });
Object.defineProperty(globalThis, 'sessionStorage', { value: sessionShim, configurable: true, writable: true });
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'localStorage', { value: localShim, configurable: true, writable: true });
  Object.defineProperty(window, 'sessionStorage', { value: sessionShim, configurable: true, writable: true });
}

beforeEach(() => {
  localShim.clear();
  sessionShim.clear();
});

afterEach(() => {
  cleanup();
});
