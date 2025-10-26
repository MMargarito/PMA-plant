import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, gql } from '@apollo/client';
import { ArrowLeftIcon, PencilIcon, PlusIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const GET_PROJECT = gql`
  query GetProject($id: ID!) {
    project(id: $id) {
      id
      name
      description
      status
      priority
      progress
      color
      start_date
      end_date
      created_at
      members {
        id
        user_id
        role
        user {
          id
          first_name
          last_name
          email
        }
      }
      tasks {
        id
        title
        description
        status
        priority
        assigned_to
        due_date
        created_at
        assignee {
          id
          first_name
          last_name
          email
        }
      }
    }
  }
`;

const UPDATE_PROJECT = gql`
  mutation UpdateProject($id: ID!, $input: UpdateProjectInput!) {
    updateProject(id: $id, input: $input) {
      id
      name
      description
      status
      priority
      progress
      color
    }
  }
`;

const CREATE_TASK = gql`
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
      id
      title
      description
      status
      priority
      assigned_to
      due_date
    }
  }
`;

const UPDATE_TASK = gql`
  mutation UpdateTask($id: ID!, $input: UpdateTaskInput!) {
    updateTask(id: $id, input: $input) {
      id
      title
      description
      status
      priority
      assigned_to
      due_date
    }
  }
`;

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  
  const [projectFormData, setProjectFormData] = useState({
    name: '',
    description: '',
    status: 'planning',
    priority: 'medium',
    progress: 0,
    color: '#3B82F6',
  });

  const [taskFormData, setTaskFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    assigned_to: '',
    due_date: '',
  });

  const { loading, data, refetch } = useQuery(GET_PROJECT, {
    variables: { id },
  });

  const [updateProject, { loading: updating }] = useMutation(UPDATE_PROJECT);
  const [createTask, { loading: creatingTask }] = useMutation(CREATE_TASK);
  const [updateTask, { loading: updatingTask }] = useMutation(UPDATE_TASK);

  const project = data?.project;

  const handleEditProject = () => {
    if (project) {
      setProjectFormData({
        name: project.name,
        description: project.description || '',
        status: project.status,
        priority: project.priority,
        progress: project.progress,
        color: project.color,
      });
      setShowEditModal(true);
    }
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    try {
      await updateProject({
        variables: {
          id,
          input: projectFormData,
        },
      });
      toast.success('Project updated successfully!');
      setShowEditModal(false);
      refetch();
    } catch (error) {
      toast.error(error.message || 'Failed to update project');
    }
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setTaskFormData({
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      assigned_to: '',
      due_date: '',
    });
    setShowTaskModal(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setTaskFormData({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      assigned_to: task.assigned_to || '',
      due_date: task.due_date ? task.due_date.split('T')[0] : '',
    });
    setShowTaskModal(true);
  };

  const handleSubmitTask = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        // Update existing task
        await updateTask({
          variables: {
            id: editingTask.id,
            input: {
              ...taskFormData,
              assigned_to: taskFormData.assigned_to || null,
              due_date: taskFormData.due_date || null,
            },
          },
        });
        toast.success('Task updated successfully!');
      } else {
        // Create new task
        await createTask({
          variables: {
            input: {
              project_id: id,
              ...taskFormData,
              assigned_to: taskFormData.assigned_to || null,
              due_date: taskFormData.due_date || null,
            },
          },
        });
        toast.success('Task created successfully!');
      }
      setShowTaskModal(false);
      refetch();
    } catch (error) {
      toast.error(error.message || 'Failed to save task');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'done': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'review': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Project not found</p>
      </div>
    );
  }

  const members = project.members || [];
  const tasks = project.tasks || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/projects')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
            <p className="mt-1 text-sm text-gray-500">Project Details</p>
          </div>
        </div>
        <button
          onClick={handleEditProject}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <PencilIcon className="h-4 w-4 mr-2" />
          Edit Project
        </button>
      </div>

      {/* Project Info */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Description</h3>
            <p className="mt-1 text-base text-gray-900">{project.description || 'No description'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Status</h3>
            <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(project.status)}`}>
              {project.status.replace('_', ' ')}
            </span>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Priority</h3>
            <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getPriorityColor(project.priority)}`}>
              {project.priority}
            </span>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Progress</h3>
            <div className="mt-2">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="font-medium text-gray-900">{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all"
                  style={{ 
                    width: `${project.progress}%`,
                    backgroundColor: project.color
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Tasks</h2>
          <button
            onClick={handleCreateTask}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-myceili-gradient hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 transition-all"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            New Task
          </button>
        </div>

        {tasks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No tasks yet. Create your first task!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => handleEditTask(task)}
                className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-base font-semibold text-gray-900">{task.title}</h3>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                        {task.status.replace('_', ' ')}
                      </span>
                    </div>
                    {task.description && (
                      <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                    )}
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      {task.assignee && (
                        <div className="flex items-center space-x-1">
                          <UserCircleIcon className="h-4 w-4" />
                          <span>{task.assignee.first_name} {task.assignee.last_name}</span>
                        </div>
                      )}
                      {task.due_date && (
                        <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Project Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowEditModal(false)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleUpdateProject}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Edit Project
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Project Name
                      </label>
                      <input
                        type="text"
                        required
                        value={projectFormData.name}
                        onChange={(e) => setProjectFormData({ ...projectFormData, name: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        rows={3}
                        value={projectFormData.description}
                        onChange={(e) => setProjectFormData({ ...projectFormData, description: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Status
                        </label>
                        <select
                          value={projectFormData.status}
                          onChange={(e) => setProjectFormData({ ...projectFormData, status: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        >
                          <option value="planning">Planning</option>
                          <option value="active">Active</option>
                          <option value="on_hold">On Hold</option>
                          <option value="completed">Completed</option>
                          <option value="archived">Archived</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Priority
                        </label>
                        <select
                          value={projectFormData.priority}
                          onChange={(e) => setProjectFormData({ ...projectFormData, priority: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="critical">Critical</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Progress (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={projectFormData.progress}
                        onChange={(e) => setProjectFormData({ ...projectFormData, progress: parseInt(e.target.value) })}
                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={updating}
                    className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-myceili-gradient text-base font-medium text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 transition-all"
                  >
                    {updating ? 'Updating...' : 'Update Project'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Task Modal (Create/Edit) */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowTaskModal(false)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmitTask}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    {editingTask ? 'Edit Task' : 'Create New Task'}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Task Title
                      </label>
                      <input
                        type="text"
                        required
                        value={taskFormData.title}
                        onChange={(e) => setTaskFormData({ ...taskFormData, title: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        rows={3}
                        value={taskFormData.description}
                        onChange={(e) => setTaskFormData({ ...taskFormData, description: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Status
                        </label>
                        <select
                          value={taskFormData.status}
                          onChange={(e) => setTaskFormData({ ...taskFormData, status: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        >
                          <option value="todo">To Do</option>
                          <option value="in_progress">In Progress</option>
                          <option value="review">Review</option>
                          <option value="done">Done</option>
                          <option value="archived">Archived</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Priority
                        </label>
                        <select
                          value={taskFormData.priority}
                          onChange={(e) => setTaskFormData({ ...taskFormData, priority: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="critical">Critical</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Assign To
                      </label>
                      <select
                        value={taskFormData.assigned_to}
                        onChange={(e) => setTaskFormData({ ...taskFormData, assigned_to: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      >
                        <option value="">Unassigned</option>
                        {members.map((member) => (
                          <option key={member.user_id} value={member.user_id}>
                            {member.user.first_name} {member.user.last_name} ({member.role})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Due Date
                      </label>
                      <input
                        type="date"
                        value={taskFormData.due_date}
                        onChange={(e) => setTaskFormData({ ...taskFormData, due_date: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={creatingTask || updatingTask}
                    className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-myceili-gradient text-base font-medium text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 transition-all"
                  >
                    {creatingTask || updatingTask ? 'Saving...' : editingTask ? 'Update Task' : 'Create Task'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowTaskModal(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
