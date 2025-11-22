export const io = {
  emit: jest.fn(),
  on: jest.fn(),
  to: jest.fn().mockReturnThis(),
};

export const setIO = jest.fn();
export const getIO = jest.fn().mockReturnValue(io);