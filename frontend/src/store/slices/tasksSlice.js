import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tasks: [],
  currentTask: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 50,
    pages: 0,
  },
  filters: {
    project_id: null,
    status: null,
    priority: null,
    assigned_to: null,
    search: '',
  },
  stats: null,
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    fetchTasksStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchTasksSuccess: (state, action) => {
      state.tasks = action.payload.tasks;
      state.pagination = action.payload.pagination;
      state.loading = false;
    },
    fetchTasksFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentTask: (state, action) => {
      state.currentTask = action.payload;
    },
    addTask: (state, action) => {
      state.tasks.unshift(action.payload);
    },
    updateTask: (state, action) => {
      const index = state.tasks.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = { ...state.tasks[index], ...action.payload };
      }
      if (state.currentTask?.id === action.payload.id) {
        state.currentTask = { ...state.currentTask, ...action.payload };
      }
    },
    removeTask: (state, action) => {
      state.tasks = state.tasks.filter(t => t.id !== action.payload);
      if (state.currentTask?.id === action.payload) {
        state.currentTask = null;
      }
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setStats: (state, action) => {
      state.stats = action.payload;
    },
    clearTasks: (state) => {
      state.tasks = [];
      state.currentTask = null;
      state.pagination = initialState.pagination;
      state.stats = null;
    },
  },
});

export const {
  fetchTasksStart,
  fetchTasksSuccess,
  fetchTasksFailure,
  setCurrentTask,
  addTask,
  updateTask,
  removeTask,
  setFilters,
  setStats,
  clearTasks,
} = tasksSlice.actions;

export default tasksSlice.reducer;

