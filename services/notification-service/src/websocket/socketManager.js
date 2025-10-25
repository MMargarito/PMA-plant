const { Server } = require('socket.io');
const { authenticateSocket } = require('../middleware/auth');
const logger = require('../config/logger');

let io = null;
const userSockets = new Map(); // Map of userId -> Set of socket IDs

/**
 * Initialize Socket.IO server
 */
const initializeSocketServer = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN || '*',
      credentials: true
    },
    path: '/socket.io/',
    transports: ['websocket', 'polling']
  });

  // Authentication middleware
  io.use(authenticateSocket);

  // Connection handler
  io.on('connection', (socket) => {
    const userId = socket.userId;
    logger.info(`User connected: ${userId} (${socket.id})`);

    // Store socket connection
    if (!userSockets.has(userId)) {
      userSockets.set(userId, new Set());
    }
    userSockets.get(userId).add(socket.id);

    // Send connection confirmation
    socket.emit('connected', {
      message: 'Connected to notification service',
      userId
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      logger.info(`User disconnected: ${userId} (${socket.id})`);
      
      const sockets = userSockets.get(userId);
      if (sockets) {
        sockets.delete(socket.id);
        if (sockets.size === 0) {
          userSockets.delete(userId);
        }
      }
    });

    // Handle custom events
    socket.on('subscribe_project', (projectId) => {
      socket.join(`project:${projectId}`);
      logger.info(`User ${userId} subscribed to project: ${projectId}`);
    });

    socket.on('unsubscribe_project', (projectId) => {
      socket.leave(`project:${projectId}`);
      logger.info(`User ${userId} unsubscribed from project: ${projectId}`);
    });

    // Ping-pong for connection health
    socket.on('ping', () => {
      socket.emit('pong');
    });
  });

  logger.info('WebSocket server initialized');
  return io;
};

/**
 * Emit event to specific user
 */
const emitToUser = (userId, event, data) => {
  if (!io) return;

  const socketIds = userSockets.get(userId);
  if (socketIds && socketIds.size > 0) {
    socketIds.forEach(socketId => {
      io.to(socketId).emit(event, data);
    });
    logger.debug(`Emitted ${event} to user ${userId} (${socketIds.size} connections)`);
  }
};

/**
 * Emit event to all users in a project
 */
const emitToProject = (projectId, event, data) => {
  if (!io) return;
  
  io.to(`project:${projectId}`).emit(event, data);
  logger.debug(`Emitted ${event} to project ${projectId}`);
};

/**
 * Broadcast event to all connected users
 */
const broadcastToAll = (event, data) => {
  if (!io) return;
  
  io.emit(event, data);
  logger.debug(`Broadcast ${event} to all users`);
};

/**
 * Get connected user count
 */
const getConnectedUserCount = () => {
  return userSockets.size;
};

/**
 * Check if user is connected
 */
const isUserConnected = (userId) => {
  return userSockets.has(userId) && userSockets.get(userId).size > 0;
};

module.exports = {
  initializeSocketServer,
  emitToUser,
  emitToProject,
  broadcastToAll,
  getConnectedUserCount,
  isUserConnected
};

