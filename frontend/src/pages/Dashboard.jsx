import React, { useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { 
  FolderIcon, 
  CheckCircleIcon, 
  ClockIcon,
  ChartBarIcon 
} from '@heroicons/react/24/outline';

const GET_DASHBOARD_DATA = gql`
  query GetDashboardData {
    projects(limit: 5) {
      projects {
        id
        name
        status
        progress
        color
      }
      pagination {
        total
      }
    }
    tasks(limit: 10) {
      tasks {
        id
        title
        status
        priority
        due_date
      }
      pagination {
        total
      }
    }
  }
`;

const Dashboard = () => {
  const navigate = useNavigate();
  const { loading, data, refetch } = useQuery(GET_DASHBOARD_DATA);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const totalProjects = data?.projects?.pagination?.total || 0;
  const totalTasks = data?.tasks?.pagination?.total || 0;
  const recentProjects = data?.projects?.projects || [];
  const recentTasks = data?.tasks?.tasks || [];

  const stats = [
    {
      name: 'Total Projects',
      value: totalProjects,
      icon: FolderIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'Total Tasks',
      value: totalTasks,
      icon: CheckCircleIcon,
      color: 'bg-green-500',
    },
    {
      name: 'Completed Today',
      value: recentTasks.filter(t => t.status === 'done').length,
      icon: ChartBarIcon,
      color: 'bg-purple-500',
    },
    {
      name: 'Pending',
      value: recentTasks.filter(t => t.status === 'todo').length,
      icon: ClockIcon,
      color: 'bg-orange-500',
    },
  ];

  const getStatusColor = (status) => {
    const colors = {
      planning: 'bg-gray-100 text-gray-800',
      active: 'bg-blue-100 text-blue-800',
      on_hold: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      todo: 'bg-gray-100 text-gray-800',
      in_progress: 'bg-blue-100 text-blue-800',
      review: 'bg-purple-100 text-purple-800',
      done: 'bg-green-100 text-green-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'text-gray-500',
      medium: 'text-blue-500',
      high: 'text-orange-500',
      critical: 'text-red-500',
    };
    return colors[priority] || 'text-gray-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your projects and tasks
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 ${stat.color} rounded-md p-3`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Projects and Tasks */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Projects */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Recent Projects
            </h3>
          </div>
          <ul className="divide-y divide-gray-200">
            {recentProjects.length === 0 ? (
              <li className="px-6 py-4 text-center text-gray-500">
                No projects yet
              </li>
            ) : (
              recentProjects.map((project) => (
                <li
                  key={project.id}
                  onClick={() => navigate(`/projects/${project.id}`)}
                  className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: project.color }}
                      ></div>
                      <p className="text-sm font-medium text-gray-900">
                        {project.name}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                        {project.status.replace('_', ' ')}
                      </span>
                      <span className="text-sm text-gray-500">
                        {project.progress}%
                      </span>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
          {recentProjects.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <button
                onClick={() => navigate('/projects')}
                className="text-sm font-medium text-primary-600 hover:text-primary-500"
              >
                View all projects →
              </button>
            </div>
          )}
        </div>

        {/* Recent Tasks */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Recent Tasks
            </h3>
          </div>
          <ul className="divide-y divide-gray-200">
            {recentTasks.length === 0 ? (
              <li className="px-6 py-4 text-center text-gray-500">
                No tasks yet
              </li>
            ) : (
              recentTasks.map((task) => (
                <li
                  key={task.id}
                  onClick={() => navigate('/tasks')}
                  className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {task.title}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                        {task.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
          {recentTasks.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <button
                onClick={() => navigate('/tasks')}
                className="text-sm font-medium text-primary-600 hover:text-primary-500"
              >
                View all tasks →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

