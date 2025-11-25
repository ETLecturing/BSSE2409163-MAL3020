import { jest } from '@jest/globals';

// Mock dependencies
jest.unstable_mockModule('../../models/userModel.js', () => ({
    default: {
        findById: jest.fn(),
    },
}));

jest.unstable_mockModule('jsonwebtoken', () => ({
    default: {
        verify: jest.fn(),
    },
}));

// Import after mocks
const { default: jwt } = await import('jsonwebtoken');
const { default: User } = await import('../../models/userModel.js');
const { protect } = await import('../../middleware/auth.js');

describe('Auth Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            headers: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    describe('protect middleware', () => {
        test('should reject request without authorization header', async () => {
            await protect(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Not authorized, no token',
            });
            expect(next).not.toHaveBeenCalled();
        });

        test('should reject request without Bearer token', async () => {
            req.headers.authorization = 'InvalidToken';

            await protect(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Not authorized, no token',
            });
        });

        test('should authenticate valid token', async () => {
            const mockUser = { _id: 'user123', name: 'Test User', username: 'testuser' };
            const mockDecoded = { id: 'user123' };

            req.headers.authorization = 'Bearer validtoken123';
            jwt.verify.mockReturnValue(mockDecoded);
            User.findById.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUser),
            });

            await protect(req, res, next);

            expect(jwt.verify).toHaveBeenCalledWith('validtoken123', process.env.JWT_SECRET);
            expect(User.findById).toHaveBeenCalledWith('user123');
            expect(req.user).toEqual(mockUser);
            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
        });

        test('should reject invalid token', async () => {
            req.headers.authorization = 'Bearer invalidtoken';
            jwt.verify.mockImplementation(() => {
                throw new Error('Invalid token');
            });

            await protect(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Not authorized, token failed',
            });
            expect(next).not.toHaveBeenCalled();
        });
    });
});
