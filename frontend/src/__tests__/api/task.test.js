import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createTask, updateTask, deleteTask } from '../../api/task';

describe('task API', () => {
    const mockToken = 'test-token-123';

    beforeEach(() => {
        vi.clearAllMocks();
        fetch.mockClear();
    });

    describe('createTask', () => {
        it('should send POST request with task data and projectId', async () => {
            const taskData = {
                title: 'Test Task',
                description: 'Test description',
            };
            const projectId = 'project123';

            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ _id: 'task1', ...taskData, projectId }),
            });

            await createTask(mockToken, projectId, taskData);

            expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${mockToken}`,
                },
                body: JSON.stringify({ ...taskData, projectId }),
            });
        });
    });

    describe('updateTask', () => {
        it('should send PUT request with updated task data', async () => {
            const updates = { title: 'Updated Title', status: 'Completed' };
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ _id: 'task1', ...updates }),
            });

            await updateTask(mockToken, 'task1', updates);

            expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/tasks/task1', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${mockToken}`,
                },
                body: JSON.stringify(updates),
            });
        });
    });

    describe('deleteTask', () => {
        it('should send DELETE request', async () => {
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ message: 'Deleted' }),
            });

            await deleteTask(mockToken, 'task123');

            expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/tasks/task123', {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${mockToken}`,
                },
            });
        });
    });
});
