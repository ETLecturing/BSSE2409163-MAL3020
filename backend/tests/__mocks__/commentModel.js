const Comment = jest.fn().mockImplementation((data) => ({
  ...data,
  save: jest.fn().mockResolvedValue({ _id: 'mock-id', ...data }),
}));

Comment.find = jest.fn().mockReturnValue({
  populate: jest.fn().mockResolvedValue([]),
});

Comment.findById = jest.fn().mockResolvedValue(null);
Comment.findByIdAndUpdate = jest.fn().mockResolvedValue(null);
Comment.findByIdAndDelete = jest.fn().mockResolvedValue(null);

export default Comment;