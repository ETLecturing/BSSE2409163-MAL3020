let io = null;

export const setIO = (socketIO) => {
  io = socketIO;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized! Call setIO first.");
  }
  return io;
};


export { io };