import { jest } from '@jest/globals';

// Mock all dependencies BEFORE imports
jest.unstable_mockModule('../../models/projectModel.js', () => {
  const mockProject = jest.fn().mockImplementation((data) => ({
    ...data,
    save: jest.fn().mockResolvedValue({ _id: 'p1', ...data }),
  }));

  mockProject.find = jest.fn().mockReturnValue({
    populate: jest.fn().mockResolvedValue([]),
    select: jest.fn().mockReturnThis(),
  });
  mockProject.findById = jest.fn().mockReturnValue({
    populate: jest.fn().mockResolvedValue(null),
    select: jest.fn().mockReturnThis(),
  });
  mockProject.findByIdAndUpdate = jest.fn().mockReturnValue({
    populate: jest.fn().mockResolvedValue(null),
  });
  mockProject.findByIdAndDelete = jest.fn().mockResolvedValue(null);

  return { default: mockProject };
});

jest.unstable_mockModule('../../socket.js', () => ({
  io: {
    emit: jest.fn(),
    on: jest.fn(),
    to: jest.fn().mockReturnThis(),
  },
  setIO: jest.fn(),
  getIO: jest.fn(),
}));

jest.unstable_mockModule('../../middleware/auth.js', () => ({
  protect: (req, res, next) => {
    req.user = { _id: 'user1' };
    next();
  },
}));

jest.unstable_mockModule('../../middleware/authorize.js', () => ({
  checkProjectAccess: (req, res, next) => {
    req.project = {
      _id: 'project1',
      createdBy: { equals: jest.fn().mockReturnValue(true) },
    };
    next();
  },
}));

// Import after all mocks are set up
const { default: request } = await import('supertest');
const { default: express } = await import('express');
const { default: projectRoutes } = await import('../../routes/projectRoutes.js');
const { default: Project } = await import('../../models/projectModel.js');
const { io } = await import('../../socket.js');

const app = express();
app.use(express.json());
app.use('/api/projects', projectRoutes);

describe('Project Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/projects', () => {
    it('should return user\'s projects', async () => {
      const mockProjects = [{ _id: 'p1', name: 'Project 1' }];
      
      Project.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockProjects),
      });

      const response = await request(app).get('/api/projects');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockProjects);
    });

    it('should handle errors', async () => {
      Project.find.mockReturnValue({
        populate: jest.fn().mockRejectedValue(new Error('Database error')),
      });

      const response = await request(app).get('/api/projects');

      expect(response.status).toBe(500);
    });
  });

  describe('POST /api/projects', () => {
    it('should create a project', async () => {
      const newProject = { name: 'New Project' };
      
      Project.mockImplementation((data) => ({
        save: jest.fn().mockResolvedValue({ _id: 'p1', ...data }),
      }));

      const response = await request(app).post('/api/projects').send(newProject);

      expect(response.status).toBe(201);
      expect(io.emit).toHaveBeenCalledWith('REFRESH_PROJECT');
    });

    it('should auto-add creator to team', async () => {
      let capturedData;
      Project.mockImplementation((data) => {
        capturedData = data;
        return {
          save: jest.fn().mockResolvedValue({ _id: 'p1', ...data }),
        };
      });

      await request(app).post('/api/projects').send({
        name: 'Project',
        team: ['user2'],
      });

      expect(capturedData.team).toContain('user1');
    });

    it('should handle validation errors', async () => {
      Project.mockImplementation(() => ({
        save: jest.fn().mockRejectedValue(new Error('Validation failed')),
      }));

      const response = await request(app).post('/api/projects').send({});

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/projects/:id', () => {
    it('should update a project', async () => {
      const updated = { _id: 'p1', name: 'Updated' };
      
      Project.findByIdAndUpdate.mockReturnValue({
        populate: jest.fn().mockResolvedValue(updated),
      });

      const response = await request(app)
        .put('/api/projects/p1')
        .send({ name: 'Updated' });

      expect(response.status).toBe(200);
      expect(io.emit).toHaveBeenCalledWith('REFRESH_PROJECT');
    });

    it('should not allow updating createdBy', async () => {
      Project.findByIdAndUpdate.mockReturnValue({
        populate: jest.fn().mockResolvedValue({ _id: 'p1' }),
      });

      await request(app)
        .put('/api/projects/p1')
        .send({ name: 'Updated', createdBy: 'hacker' });

      const [, updates] = Project.findByIdAndUpdate.mock.calls[0];
      expect(updates).not.toHaveProperty('createdBy');
    });

    it('should handle update errors', async () => {
      Project.findByIdAndUpdate.mockReturnValue({
        populate: jest.fn().mockRejectedValue(new Error('Update failed')),
      });

      const response = await request(app)
        .put('/api/projects/p1')
        .send({ name: 'Updated' });

      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /api/projects/:id', () => {
    it('should delete project', async () => {
      Project.findByIdAndDelete.mockResolvedValue({ _id: 'p1' });

      const response = await request(app).delete('/api/projects/p1');

      expect(response.status).toBe(200);
      expect(io.emit).toHaveBeenCalledWith('REFRESH_PROJECT');
    });

    it('should handle deletion errors', async () => {
      Project.findByIdAndDelete.mockRejectedValue(new Error('Delete failed'));

      const response = await request(app).delete('/api/projects/p1');

      expect(response.status).toBe(500);
    });
  });
});