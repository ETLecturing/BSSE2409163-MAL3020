import { jest } from '@jest/globals';

// Mock all dependencies BEFORE imports
jest.unstable_mockModule('../../models/taskModels.js', () => {
  const mockTask = jest.fn().mockImplementation((data) => ({
    ...data,
    _id: 'task-123',
    save: jest.fn().mockResolvedValue({ _id: 'task-123', ...data }),
  }));

  mockTask.find = jest.fn().mockReturnValue({
    populate: jest.fn().mockResolvedValue([]),
  });
  mockTask.findById = jest.fn().mockResolvedValue(null);
  mockTask.findByIdAndUpdate = jest.fn().mockResolvedValue(null);
  mockTask.findByIdAndDelete = jest.fn().mockResolvedValue(null);

  return { default: mockTask };
});

jest.unstable_mockModule('../../models/projectModel.js', () => {
  const mockProject = {};
  mockProject.find = jest.fn().mockReturnValue({
    select: jest.fn().mockResolvedValue([{ _id: 'project-123' }]),
  });
  mockProject.findById = jest.fn().mockReturnValue({
    select: jest.fn().mockResolvedValue({
      _id: 'project-123',
      team: ['user-123'],
      createdBy: { equals: jest.fn().mockReturnValue(true) },
    }),
  });
  return { default: mockProject };
});

jest.unstable_mockModule('../../socket.js', () => ({
  io: {
    emit: jest.fn(),
  },
}));

jest.unstable_mockModule('../../middleware/auth.js', () => ({
  protect: (req, res, next) => {
    req.user = { _id: 'user-123' };
    next();
  },
}));

// Import after mocks
const { default: request } = await import('supertest');
const { default: express } = await import('express');
const { default: Task } = await import('../../models/taskModels.js');
const { default: Project } = await import('../../models/projectModel.js');
const { io } = await import('../../socket.js');
const { default: taskRoutes } = await import('../../routes/taskRoutes.js');

const app = express();
app.use(express.json());
app.use('/api/tasks', taskRoutes);

describe('Task Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Reset default mocks
    Project.find.mockReturnValue({
      select: jest.fn().mockResolvedValue([{ _id: 'project-123' }]),
    });
    Project.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue({
        _id: 'project-123',
        team: ['user-123'],
        createdBy: { equals: jest.fn().mockReturnValue(true) },
      }),
    });
  });

  describe('GET /api/tasks', () => {
    it('should return tasks for user projects', async () => {
      const mockTasks = [{ _id: 'task-1', title: 'Task 1', projectId: 'project-123' }];

      Task.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockTasks),
      });

      const response = await request(app).get('/api/tasks');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockTasks);
    });
  });

  describe('POST /api/tasks', () => {
    it('should create a task with valid projectId', async () => {
      const newTask = {
        title: 'New Task',
        projectId: 'project-123',
        description: 'Test description',
      };

      const response = await request(app).post('/api/tasks').send(newTask);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('title', 'New Task');
      expect(io.emit).toHaveBeenCalledWith('REFRESH_TASK', { projectId: 'project-123' });
    });

    it('should return 400 when projectId is missing', async () => {
      const response = await request(app).post('/api/tasks').send({
        title: 'Task without project',
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('projectId');
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update an existing task', async () => {
      Task.findById.mockResolvedValue({
        _id: 'task-123',
        projectId: 'project-123',
        title: 'Old Title',
        save: jest.fn().mockResolvedValue({
          _id: 'task-123',
          title: 'Updated Task',
          projectId: 'project-123',
        }),
      });

      const response = await request(app)
        .put('/api/tasks/task-123')
        .send({ title: 'Updated Task' });

      expect(response.status).toBe(200);
      expect(io.emit).toHaveBeenCalled();
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete a task', async () => {
      Task.findById.mockResolvedValue({
        _id: 'task-123',
        projectId: 'project-123',
      });

      Task.findByIdAndDelete.mockResolvedValue({ _id: 'task-123' });

      const response = await request(app).delete('/api/tasks/task-123');

      expect(response.status).toBe(200);
      expect(io.emit).toHaveBeenCalledWith('REFRESH_TASK', { projectId: 'project-123' });
    });
  });
});
