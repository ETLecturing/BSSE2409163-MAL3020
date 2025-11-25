import { describe, it, expect, beforeEach, vi } from 'vitest';
import { login, register } from '../../api/auth';

describe('auth API', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        fetch.mockClear();
    });

    describe('login', () => {
        it('should call fetch with correct URL and credentials', async () => {
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ token: 'abc123', _id: 'user1', username: 'test' }),
            });

            await login('testuser', 'password123');

            expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: 'testuser', password: 'password123' }),
            });
        });

        it('should store token and user data in localStorage', async () => {
            const mockData = { token: 'abc123', _id: 'user1', username: 'testuser' };
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockData,
            });

            await login('testuser', 'password123');

            expect(localStorage.getItem('token')).toBe('abc123');
            expect(localStorage.getItem('userId')).toBe('user1');
            expect(localStorage.getItem('username')).toBe('testuser');
        });

        it('should throw error when login fails', async () => {
            fetch.mockResolvedValueOnce({
                ok: false,
            });

            await expect(login('test', 'wrong')).rejects.toThrow('Login failed');
        });
    });

    describe('register', () => {
        it('should call fetch with correct registration data', async () => {
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ success: true, token: 'token123' }),
            });

            await register({ name: 'Test', username: 'test', password: 'pass123' });

            expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: 'Test', username: 'test', password: 'pass123' }),
            });
        });

        it('should handle network errors', async () => {
            fetch.mockRejectedValueOnce(new Error('Network error'));

            const result = await register({ name: 'Test', username: 'test', password: 'pass' });

            expect(result).toEqual({ success: false, message: 'Network error' });
        });
    });
});
