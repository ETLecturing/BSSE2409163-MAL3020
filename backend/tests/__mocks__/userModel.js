const User = jest.fn().mockImplementation((data) => ({
  ...data,
  save: jest.fn().mockResolvedValue({ _id: 'mock-id', ...data }),
}));

User.find = jest.fn().mockReturnValue({
  limit: jest.fn().mockReturnValue({
    select: jest.fn().mockResolvedValue([]),
  }),
});

User.findById = jest.fn().mockReturnValue({
  populate: jest.fn().mockResolvedValue(null),
});

User.findByIdAndUpdate = jest.fn().mockResolvedValue(null);
User.findByIdAndDelete = jest.fn().mockResolvedValue(null);

export default User;