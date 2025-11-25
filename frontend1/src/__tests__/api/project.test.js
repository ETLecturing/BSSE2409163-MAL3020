import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createProject, updateProject, deleteProject } from '../../api/project';

describe('project API', () => {
    const mockToken = 'test-token-123';

    beforeEach(() => {
        vi.clearAllMocks();
        fetch.mockClear();
    });

    describe('createProject', () => {
        it('should send POST request with project data', async () => {
            const projectData = { name: 'Test Project', description: 'Test', team: [] };
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ _id: 'project1', ...projectData }),
            });

            await createProject(mockToken, projectData);

            expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${mockToken}`,
                },
                body: JSON.stringify(projectData),
            });
        });

        it('should include auth token in headers', async () => {
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({}),
            });

            await createProject(mockToken, { name: 'Project', team: [] });

            const callArgs = fetch.mock.calls[0];
            expect(callArgs[1].headers.Authorization).toBe(`Bearer ${mockToken}`);
        });
    });

    describe('updateProject', () => {
        it('should send PUT request with updated data', async () => {
            const updates = { name: 'Updated Name' };
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ _id: 'p1', ...updates }),
            });

            await updateProject(mockToken, 'p1', updates);

            expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/projects/p1', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${mockToken}`,
                },
                body: JSON.stringify(updates),
            });
        });
    });

    describe('deleteProject', () => {
        it('should send DELETE request', async () => {
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ message: 'Deleted' }),
            });

            await deleteProject(mockToken, 'project123');

            expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/projects/project123', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${mockToken}`,
                },
            });
        });
    });
});
