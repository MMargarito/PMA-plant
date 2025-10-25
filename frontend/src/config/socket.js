import { io } from 'socket.io-client';

let socket = null;

export const initializeSocket = (token) => {
  if (socket) {
    socket.disconnect();
  }

  socket = io(process.env.REACT_APP_WS_URL || 'http://localhost:4004', {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5
  });

  socket.on('connect', () => {
    console.log('WebSocket connected');
  });

  socket.on('disconnect', () => {
    console.log('WebSocket disconnected');
  });

  socket.on('connect_error', (error) => {
    console.error('WebSocket connection error:', error);
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const subscribeToNotifications = (callback) => {
  if (!socket) return;
  
  socket.on('notification', callback);
  
  return () => {
    socket.off('notification', callback);
  };
};

export const subscribeToUnreadCount = (callback) => {
  if (!socket) return;
  
  socket.on('unread_count', callback);
  
  return () => {
    socket.off('unread_count', callback);
  };
};

export const subscribeToProject = (projectId) => {
  if (!socket) return;
  socket.emit('subscribe_project', projectId);
};

export const unsubscribeFromProject = (projectId) => {
  if (!socket) return;
  socket.emit('unsubscribe_project', projectId);
};

