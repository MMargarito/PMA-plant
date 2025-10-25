const { GraphQLError } = require('graphql');
const { GraphQLDateTime, GraphQLJSON } = require('graphql-scalars');
const { 
  userService, 
  projectService, 
  taskService, 
  notificationService 
} = require('../services/serviceClients');
const logger = require('../config/logger');

/**
 * Helper to add auth token to service requests
 */
const getAuthHeader = (context) => {
  return context.token ? { Authorization: `Bearer ${context.token}` } : {};
};

/**
 * Helper to handle service errors
 */
const handleServiceError = (error, defaultMessage) => {
  logger.error('Service error:', error);
  throw new GraphQLError(
    error.response?.data?.error || defaultMessage,
    {
      extensions: {
        code: error.response?.status === 401 ? 'UNAUTHENTICATED' : 'BAD_REQUEST',
        http: { status: error.response?.status || 500 }
      }
    }
  );
};

const resolvers = {
  DateTime: GraphQLDateTime,
  JSON: GraphQLJSON,

  Query: {
    // User queries
    me: async (_, __, context) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }
      try {
        const response = await userService.get('/api/users/profile', {
          headers: getAuthHeader(context)
        });
        return response.data.user;
      } catch (error) {
        handleServiceError(error, 'Failed to fetch user profile');
      }
    },

    user: async (_, { id }, context) => {
      try {
        const response = await userService.get(`/api/users/${id}`, {
          headers: getAuthHeader(context)
        });
        return response.data.user;
      } catch (error) {
        handleServiceError(error, 'Failed to fetch user');
      }
    },

    // Project queries
    projects: async (_, { status, search, page = 1, limit = 20 }, context) => {
      try {
        const response = await projectService.get('/api/projects', {
          headers: getAuthHeader(context),
          params: { status, search, page, limit }
        });
        return response.data;
      } catch (error) {
        handleServiceError(error, 'Failed to fetch projects');
      }
    },

    project: async (_, { id }, context) => {
      try {
        const response = await projectService.get(`/api/projects/${id}`, {
          headers: getAuthHeader(context)
        });
        return response.data.project;
      } catch (error) {
        handleServiceError(error, 'Failed to fetch project');
      }
    },

    // Task queries
    tasks: async (_, args, context) => {
      try {
        const response = await taskService.get('/api/tasks', {
          headers: getAuthHeader(context),
          params: args
        });
        return response.data;
      } catch (error) {
        handleServiceError(error, 'Failed to fetch tasks');
      }
    },

    task: async (_, { id }, context) => {
      try {
        const response = await taskService.get(`/api/tasks/${id}`, {
          headers: getAuthHeader(context)
        });
        return response.data.task;
      } catch (error) {
        handleServiceError(error, 'Failed to fetch task');
      }
    },

    projectStats: async (_, { project_id }, context) => {
      try {
        const response = await taskService.get('/api/tasks/stats', {
          headers: getAuthHeader(context),
          params: { project_id }
        });
        return response.data.stats;
      } catch (error) {
        handleServiceError(error, 'Failed to fetch project statistics');
      }
    },

    // Notification queries
    notifications: async (_, { unread_only, page = 1, limit = 20 }, context) => {
      try {
        const response = await notificationService.get('/api/notifications', {
          headers: getAuthHeader(context),
          params: { unread_only, page, limit }
        });
        return response.data;
      } catch (error) {
        handleServiceError(error, 'Failed to fetch notifications');
      }
    },

    notificationPreferences: async (_, __, context) => {
      try {
        const response = await notificationService.get('/api/notifications/preferences', {
          headers: getAuthHeader(context)
        });
        return response.data.preferences;
      } catch (error) {
        handleServiceError(error, 'Failed to fetch notification preferences');
      }
    }
  },

  Mutation: {
    // Authentication
    register: async (_, { input }) => {
      try {
        const response = await userService.post('/api/auth/register', input);
        return response.data;
      } catch (error) {
        handleServiceError(error, 'Registration failed');
      }
    },

    login: async (_, { input }) => {
      try {
        const response = await userService.post('/api/auth/login', input);
        return response.data;
      } catch (error) {
        handleServiceError(error, 'Login failed');
      }
    },

    refreshToken: async (_, { refreshToken }) => {
      try {
        const response = await userService.post('/api/auth/refresh', { refreshToken });
        return response.data;
      } catch (error) {
        handleServiceError(error, 'Token refresh failed');
      }
    },

    logout: async (_, { refreshToken }, context) => {
      try {
        await userService.post('/api/auth/logout', 
          { refreshToken },
          { headers: getAuthHeader(context) }
        );
        return true;
      } catch (error) {
        handleServiceError(error, 'Logout failed');
      }
    },

    // User mutations
    updateProfile: async (_, { input }, context) => {
      try {
        const response = await userService.put('/api/users/profile', input, {
          headers: getAuthHeader(context)
        });
        return response.data.user;
      } catch (error) {
        handleServiceError(error, 'Failed to update profile');
      }
    },

    changePassword: async (_, { current_password, new_password }, context) => {
      try {
        await userService.put('/api/users/password', 
          { current_password, new_password },
          { headers: getAuthHeader(context) }
        );
        return true;
      } catch (error) {
        handleServiceError(error, 'Failed to change password');
      }
    },

    // Project mutations
    createProject: async (_, { input }, context) => {
      try {
        const response = await projectService.post('/api/projects', input, {
          headers: getAuthHeader(context)
        });
        return response.data.project;
      } catch (error) {
        handleServiceError(error, 'Failed to create project');
      }
    },

    updateProject: async (_, { id, input }, context) => {
      try {
        const response = await projectService.put(`/api/projects/${id}`, input, {
          headers: getAuthHeader(context)
        });
        return response.data.project;
      } catch (error) {
        handleServiceError(error, 'Failed to update project');
      }
    },

    deleteProject: async (_, { id }, context) => {
      try {
        await projectService.delete(`/api/projects/${id}`, {
          headers: getAuthHeader(context)
        });
        return true;
      } catch (error) {
        handleServiceError(error, 'Failed to delete project');
      }
    },

    addProjectMember: async (_, { project_id, user_id, role }, context) => {
      try {
        const response = await projectService.post(
          `/api/projects/${project_id}/members`,
          { user_id, role },
          { headers: getAuthHeader(context) }
        );
        return response.data.member;
      } catch (error) {
        handleServiceError(error, 'Failed to add project member');
      }
    },

    removeProjectMember: async (_, { project_id, member_id }, context) => {
      try {
        await projectService.delete(
          `/api/projects/${project_id}/members/${member_id}`,
          { headers: getAuthHeader(context) }
        );
        return true;
      } catch (error) {
        handleServiceError(error, 'Failed to remove project member');
      }
    },

    updateMemberRole: async (_, { project_id, member_id, role }, context) => {
      try {
        const response = await projectService.put(
          `/api/projects/${project_id}/members/${member_id}`,
          { role },
          { headers: getAuthHeader(context) }
        );
        return response.data.member;
      } catch (error) {
        handleServiceError(error, 'Failed to update member role');
      }
    },

    // Task mutations
    createTask: async (_, { input }, context) => {
      try {
        const response = await taskService.post('/api/tasks', input, {
          headers: getAuthHeader(context)
        });
        return response.data.task;
      } catch (error) {
        handleServiceError(error, 'Failed to create task');
      }
    },

    updateTask: async (_, { id, input }, context) => {
      try {
        const response = await taskService.put(`/api/tasks/${id}`, input, {
          headers: getAuthHeader(context)
        });
        return response.data.task;
      } catch (error) {
        handleServiceError(error, 'Failed to update task');
      }
    },

    deleteTask: async (_, { id }, context) => {
      try {
        await taskService.delete(`/api/tasks/${id}`, {
          headers: getAuthHeader(context)
        });
        return true;
      } catch (error) {
        handleServiceError(error, 'Failed to delete task');
      }
    },

    addTaskComment: async (_, { task_id, comment }, context) => {
      try {
        const response = await taskService.post(
          `/api/tasks/${task_id}/comments`,
          { comment },
          { headers: getAuthHeader(context) }
        );
        return response.data.comment;
      } catch (error) {
        handleServiceError(error, 'Failed to add comment');
      }
    },

    updateTaskComment: async (_, { task_id, comment_id, comment }, context) => {
      try {
        const response = await taskService.put(
          `/api/tasks/${task_id}/comments/${comment_id}`,
          { comment },
          { headers: getAuthHeader(context) }
        );
        return response.data.comment;
      } catch (error) {
        handleServiceError(error, 'Failed to update comment');
      }
    },

    deleteTaskComment: async (_, { task_id, comment_id }, context) => {
      try {
        await taskService.delete(
          `/api/tasks/${task_id}/comments/${comment_id}`,
          { headers: getAuthHeader(context) }
        );
        return true;
      } catch (error) {
        handleServiceError(error, 'Failed to delete comment');
      }
    },

    // Notification mutations
    markNotificationAsRead: async (_, { id }, context) => {
      try {
        await notificationService.put(
          `/api/notifications/${id}/read`,
          {},
          { headers: getAuthHeader(context) }
        );
        return true;
      } catch (error) {
        handleServiceError(error, 'Failed to mark notification as read');
      }
    },

    markAllNotificationsAsRead: async (_, __, context) => {
      try {
        await notificationService.put(
          '/api/notifications/read-all',
          {},
          { headers: getAuthHeader(context) }
        );
        return true;
      } catch (error) {
        handleServiceError(error, 'Failed to mark all notifications as read');
      }
    },

    deleteNotification: async (_, { id }, context) => {
      try {
        await notificationService.delete(`/api/notifications/${id}`, {
          headers: getAuthHeader(context)
        });
        return true;
      } catch (error) {
        handleServiceError(error, 'Failed to delete notification');
      }
    },

    updateNotificationPreferences: async (_, { input }, context) => {
      try {
        const response = await notificationService.put(
          '/api/notifications/preferences',
          input,
          { headers: getAuthHeader(context) }
        );
        return response.data.preferences;
      } catch (error) {
        handleServiceError(error, 'Failed to update notification preferences');
      }
    }
  }
};

module.exports = resolvers;

