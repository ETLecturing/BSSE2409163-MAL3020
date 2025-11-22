const Project = jest.fn().mockImplementation((data) => ({
  ...data,
  save: jest.fn().mockResolvedValue({ _id: 'mock-id', ...data }),
}));

Project.find = jest.fn().mockReturnValue({
  populate: jest.fn().mockResolvedValue([]),
  select: jest.fn().mockReturnThis(),
});

Project.findById = jest.fn().mockReturnValue({
  populate: jest.fn().mockResolvedValue(null),
  select: jest.fn().mockReturnThis(),
});

Project.findByIdAndUpdate = jest.fn().mockReturnValue({
  populate: jest.fn().mockResolvedValue(null),
});

Project.findByIdAndDelete = jest.fn().mockResolvedValue(null);

export default Project;