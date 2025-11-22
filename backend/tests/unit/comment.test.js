import { jest } from '@jest/globals';

// Mock MUST be before imports
jest.unstable_mockModule('../../models/commentModel.js', () => {
  const mockComment = jest.fn().mockImplementation((data) => ({
    ...data,
    save: jest.fn().mockResolvedValue({ _id: 'comment1', ...data }),
  }));

  mockComment.find = jest.fn().mockReturnValue({
    populate: jest.fn().mockResolvedValue([]),
  });
  mockComment.findById = jest.fn().mockResolvedValue(null);
  mockComment.findByIdAndUpdate = jest.fn().mockResolvedValue(null);
  mockComment.findByIdAndDelete = jest.fn().mockResolvedValue(null);

  return { default: mockComment };
});

// Now import after mocking
const { default: request } = await import('supertest');
const { default: express } = await import('express');
const { default: commentRoutes } = await import('../../routes/commentRoutes.js');
const { default: Comment } = await import('../../models/commentModel.js');

const app = express();
app.use(express.json());
app.use('/api/comments', commentRoutes);

describe('Comment Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/comments/task/:taskId', () => {
    it('should return comments for a specific task', async () => {
      const mockComments = [
        {
          _id: 'comment1',
          taskId: 'task1',
          userId: { _id: 'user1', name: 'John Doe' },
          text: 'First comment',
        },
      ];

      Comment.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockComments),
      });

      const response = await request(app).get('/api/comments/task/task1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockComments);
    });

    it('should handle errors', async () => {
      Comment.find.mockReturnValue({
        populate: jest.fn().mockRejectedValue(new Error('Database error')),
      });

      const response = await request(app).get('/api/comments/task/task1');

      expect(response.status).toBe(500);
    });
  });

  describe('POST /api/comments', () => {
    it('should create a comment', async () => {
      const newComment = {
        taskId: 'task1',
        userId: 'user1',
        text: 'New comment',
      };

      Comment.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue({ _id: 'comment1', ...newComment }),
      }));

      const response = await request(app).post('/api/comments').send(newComment);

      expect(response.status).toBe(201);
    });

    it('should handle validation errors', async () => {
      Comment.mockImplementation(() => ({
        save: jest.fn().mockRejectedValue(new Error('Validation failed')),
      }));

      const response = await request(app).post('/api/comments').send({});

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/comments/:id', () => {
    it('should update a comment', async () => {
      const updated = { _id: 'comment1', text: 'Updated' };
      Comment.findByIdAndUpdate.mockResolvedValue(updated);

      const response = await request(app)
        .put('/api/comments/comment1')
        .send({ text: 'Updated' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updated);
    });
  });

  describe('DELETE /api/comments/:id', () => {
    it('should delete a comment', async () => {
      Comment.findByIdAndDelete.mockResolvedValue({ _id: 'comment1' });

      const response = await request(app).delete('/api/comments/comment1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Comment deleted' });
    });
  });
});