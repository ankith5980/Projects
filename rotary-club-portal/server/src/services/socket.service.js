import { logger } from '../config/logger.js';

let io;

export const initializeSocketIO = (socketIO) => {
  io = socketIO;

  io.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.id}`);

    // Join user-specific room
    socket.on('join', (userId) => {
      socket.join(`user:${userId}`);
      logger.info(`User ${userId} joined their room`);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id}`);
    });
  });

  logger.info('Socket.IO initialized');
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  return io;
};

// Emit event to specific user
export const emitToUser = (userId, event, data) => {
  try {
    const io = getIO();
    io.to(`user:${userId}`).emit(event, data);
  } catch (error) {
    logger.error('Error emitting to user:', error);
  }
};

// Emit event to all connected clients
export const emitToAll = (event, data) => {
  try {
    const io = getIO();
    io.emit(event, data);
  } catch (error) {
    logger.error('Error emitting to all:', error);
  }
};

// Emit event to specific room
export const emitToRoom = (room, event, data) => {
  try {
    const io = getIO();
    io.to(room).emit(event, data);
  } catch (error) {
    logger.error('Error emitting to room:', error);
  }
};
