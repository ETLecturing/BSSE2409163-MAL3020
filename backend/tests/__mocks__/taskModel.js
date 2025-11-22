const Task = jest.fn().mockImplementation((data) => ({
  ...data,
  save: jest.fn().mockResolvedValue({ _id: 'mock-id', ...data }),
}));

Task.find = jest.fn().mockReturnValue({
  populate: jest.fn().mockResolvedValue([]),
});

Task.findById = jest.fn().mockReturnValue({
  populate: jest.fn().mockResolvedValue(null),
});

Task.findByIdAndUpdate = jest.fn().mockResolvedValue(null);
Task.findByIdAndDelete = jest.fn().mockResolvedValue(null);

export default Task;