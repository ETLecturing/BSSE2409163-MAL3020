import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// Cleanup after each test
afterEach(() => {
    cleanup();
    localStorage.clear();
    vi.clearAllMocks();
});

// Mock localStorage
const localStorageMock = {
    store: {},
    getItem(key) {
        return this.store[key] || null;
    },
    setItem(key, value) {
        this.store[key] = String(value);
    },
    removeItem(key) {
        delete this.store[key];
    },
    clear() {
        this.store = {};
    },
};

global.localStorage = localStorageMock;

// Mock fetch globally
global.fetch = vi.fn();

// Mock window.alert and window.confirm
global.alert = vi.fn();
global.confirm = vi.fn(() => true);
