import { describe, it, expect, beforeEach, vi } from 'vitest';
import { pinProject, unpinProject } from '../../api/pinning,jsx';

describe('pinning API', () => {
    const mockUserId = 'user123';
    const mockProjectId = 'project123';
    const mockToken = 'test-token-123';

    beforeEach(() => {
        vi.clearAllMocks();
        fetch.mockClear();
    });

    describe('pinProject', () => {
        it('should send PUT request to pin project', async () => {
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ success: true }),
            });

            await pinProject(mockUserId, mockProjectId, mockToken);

            expect(fetch).toHaveBeenCalledWith(
                `http://localhost:5000/api/users/${mockUserId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${mockToken}`,
                    },
                    body: JSON.stringify({ $push: { pinnedProjects: mockProjectId } }),
                }
            );
        });
    });

    describe('unpinProject', () => {
        it('should send PUT request to unpin project', async () => {
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ success: true }),
            });

            await unpinProject(mockUserId, mockProjectId, mockToken);

            expect(fetch).toHaveBeenCalledWith(
                `http://localhost:5000/api/users/${mockUserId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${mockToken}`,
                    },
                    body: JSON.stringify({ $pull: { pinnedProjects: mockProjectId } }),
                }
            );
        });
    });
});
