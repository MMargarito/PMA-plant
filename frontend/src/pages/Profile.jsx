import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

const GET_PROFILE = gql`
  query GetProfile {
    me {
      id
      email
      first_name
      last_name
      role
      avatar_url
      created_at
    }
  }
`;

const UPDATE_PROFILE = gql`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      id
      first_name
      last_name
      avatar_url
    }
  }
`;

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { data, loading } = useQuery(GET_PROFILE);
  const [updateProfile, { loading: updating }] = useMutation(UPDATE_PROFILE);
  
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await updateProfile({ variables: { input: formData } });
      dispatch(updateUser(data.updateProfile));
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const profile = data?.me;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account settings
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-myceili-gradient rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-3xl">
                {profile?.first_name?.[0]}{profile?.last_name?.[0]}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {profile?.first_name} {profile?.last_name}
              </h3>
              <p className="text-sm text-gray-500">{profile?.email}</p>
              <p className="text-xs text-gray-400 mt-1 capitalize">Role: {profile?.role}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={updating}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-myceili-gradient hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 disabled:opacity-50 transition-all"
            >
              {updating ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;

