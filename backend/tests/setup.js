global.jest = jest;

// Global test setup
if (typeof jest !== 'undefined') {
    jest.setTimeout(10000);
}

// Suppress console warnings in tests
global.console = {
    ...console,
    warn: jest.fn(),
};