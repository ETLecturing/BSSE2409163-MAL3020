import { describe, it, expect, beforeEach, vi } from 'vitest';
import { searchUsers } from '../../api/user';

describe('user API', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        fetch.mockClear();
    });

    describe('searchUsers', () => {
        it('should search users by username', async () => {
            const mockUsers = [
                { _id: 'user1', username: 'testuser', name: 'Test User' },
            ];
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockUsers,
            });

            const result = await searchUsers('test');

            expect(fetch).toHaveBeenCalledWith(
                'http://localhost:5000/api/users/search?username=test'
            );
            expect(result).toEqual(mockUsers);
        });

        it('should return empty array when username is empty', async () => {
            const result = await searchUsers('');

            expect(fetch).not.toHaveBeenCalled();
            expect(result).toEqual([]);
        });
    });
});
