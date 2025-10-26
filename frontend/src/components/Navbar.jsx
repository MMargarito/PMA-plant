import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Menu } from '@headlessui/react';
import { BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/slices/authSlice';
import { useMutation, gql } from '@apollo/client';
import toast from 'react-hot-toast';

const LOGOUT_MUTATION = gql`
  mutation Logout($refreshToken: String) {
    logout(refreshToken: $refreshToken)
  }
`;

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { unreadCount } = useSelector((state) => state.notifications);

  const [logoutMutation] = useMutation(LOGOUT_MUTATION);

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      await logoutMutation({ variables: { refreshToken } });
      dispatch(logout());
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      dispatch(logout());
      navigate('/login');
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Welcome back, {user?.first_name || 'User'}!
        </h2>
      </div>

      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <button
          onClick={() => navigate('/notifications')}
          className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <BellIcon className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
              {unreadCount}
            </span>
          )}
        </button>

        {/* User menu */}
        <Menu as="div" className="relative">
          <Menu.Button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-8 h-8 bg-myceili-gradient rounded-full flex items-center justify-center shadow">
              <span className="text-white font-semibold text-sm">
                {user?.first_name?.[0]}{user?.last_name?.[0]}
              </span>
            </div>
          </Menu.Button>

          <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 focus:outline-none">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => navigate('/profile')}
                  className={`${
                    active ? 'bg-gray-100' : ''
                  } flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                >
                  <UserCircleIcon className="w-5 h-5 mr-2" />
                  Profile
                </button>
              )}
            </Menu.Item>
            <div className="border-t border-gray-200 my-1"></div>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={handleLogout}
                  className={`${
                    active ? 'bg-gray-100' : ''
                  } flex items-center w-full px-4 py-2 text-sm text-red-600`}
                >
                  Logout
                </button>
              )}
            </Menu.Item>
          </Menu.Items>
        </Menu>
      </div>
    </header>
  );
};

export default Navbar;

