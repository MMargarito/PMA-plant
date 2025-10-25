import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

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
    }
  }
`;

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loading, data } = useQuery(GET_PROJECT, {
    variables: { id },
  });

  const project = data?.project;

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

  return (
    <div className="space-y-6">
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

      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Description</h3>
            <p className="mt-1 text-base text-gray-900">{project.description || 'No description'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Status</h3>
            <p className="mt-1 text-base text-gray-900 capitalize">{project.status}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Priority</h3>
            <p className="mt-1 text-base text-gray-900 capitalize">{project.priority}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Progress</h3>
            <p className="mt-1 text-base text-gray-900">{project.progress}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;

