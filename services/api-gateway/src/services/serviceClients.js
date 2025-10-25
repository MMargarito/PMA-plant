const axios = require('axios');
const logger = require('../config/logger');

/**
 * Create axios instance with default config and interceptors
 */
const createServiceClient = (baseURL, serviceName) => {
  const client = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // Request interceptor
  client.interceptors.request.use(
    (config) => {
      logger.debug(`${serviceName} request: ${config.method?.toUpperCase()} ${config.url}`);
      return config;
    },
    (error) => {
      logger.error(`${serviceName} request error:`, error);
      return Promise.reject(error);
    }
  );

  // Response interceptor
  client.interceptors.response.use(
    (response) => {
      logger.debug(`${serviceName} response: ${response.status}`);
      return response;
    },
    (error) => {
      logger.error(`${serviceName} error:`, error.message);
      return Promise.reject(error);
    }
  );

  return client;
};

// Service clients
const userService = createServiceClient(
  process.env.USER_SERVICE_URL || 'http://localhost:4001',
  'UserService'
);

const projectService = createServiceClient(
  process.env.PROJECT_SERVICE_URL || 'http://localhost:4002',
  'ProjectService'
);

const taskService = createServiceClient(
  process.env.TASK_SERVICE_URL || 'http://localhost:4003',
  'TaskService'
);

const notificationService = createServiceClient(
  process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:4004',
  'NotificationService'
);

module.exports = {
  userService,
  projectService,
  taskService,
  notificationService
};

