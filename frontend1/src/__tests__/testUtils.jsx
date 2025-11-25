import { render } from '@testing-library/react';

// Simple render utility (can be extended later if needed)
export function renderComponent(ui, options = {}) {
    return render(ui, { ...options });
}

// Mock data generators for consistent test data
export const mockUser = {
    _id: 'user123',
    name: 'Test User',
    username: 'testuser',
    token: 'mock-token-123',
};

export const mockProject = {
    _id: 'project123',
    name: 'Test Project',
    description: 'A test project',
    createdBy: 'user123',
    team: ['user123'],
};

export const mockTask = {
    _id: 'task123',
    title: 'Test Task',
    description: 'A test task',
    status: 'Pending',
    projectId: 'project123',
    createdBy: 'user123',
};

// Mock successful API response
export const mockFetchSuccess = (data) => {
    global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => data,
    });
};

// Mock API error response
export const mockFetchError = (message = 'API Error') => {
    global.fetch.mockRejectedValueOnce(new Error(message));
};
