import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  HomeIcon,
  FolderIcon,
  CheckCircleIcon,
  BellIcon,
  UserCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { toggleSidebar } from '../store/slices/uiSlice';

const Sidebar = () => {
  const dispatch = useDispatch();
  const { sidebarOpen } = useSelector((state) => state.ui);
  const { unreadCount } = useSelector((state) => state.notifications);

  const navigation = [
    { name: 'Dashboard', to: '/dashboard', icon: HomeIcon },
    { name: 'Projects', to: '/projects', icon: FolderIcon },
    { name: 'Tasks', to: '/tasks', icon: CheckCircleIcon },
    { name: 'Notifications', to: '/notifications', icon: BellIcon, badge: unreadCount },
    { name: 'Profile', to: '/profile', icon: UserCircleIcon },
  ];

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200 transition-all duration-300 ${
        sidebarOpen ? 'w-64' : 'w-16'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
        {sidebarOpen ? (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-myceili-gradient rounded-lg flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="10" y1="18" x2="10" y2="4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="10" cy="4" r="2" fill="white"/>
                <line x1="10" y1="8" x2="5" y2="8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="5" cy="8" r="2" fill="white"/>
                <line x1="10" y1="8" x2="15" y2="8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="15" cy="8" r="2" fill="white"/>
                <line x1="10" y1="14" x2="5" y2="14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="5" cy="14" r="2" fill="white"/>
                <line x1="10" y1="14" x2="15" y2="14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="15" cy="14" r="2" fill="white"/>
              </svg>
            </div>
            <h1 className="text-xl font-bold bg-myceili-gradient bg-clip-text text-transparent">Myceili</h1>
          </div>
        ) : (
          <div className="w-8 h-8 bg-myceili-gradient rounded-lg flex items-center justify-center mx-auto">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="10" y1="18" x2="10" y2="4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="10" cy="4" r="2" fill="white"/>
              <line x1="10" y1="8" x2="5" y2="8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="5" cy="8" r="2" fill="white"/>
              <line x1="10" y1="8" x2="15" y2="8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="15" cy="8" r="2" fill="white"/>
              <line x1="10" y1="14" x2="5" y2="14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="5" cy="14" r="2" fill="white"/>
              <line x1="10" y1="14" x2="15" y2="14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="15" cy="14" r="2" fill="white"/>
            </svg>
          </div>
        )}
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="p-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {sidebarOpen ? (
            <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronRightIcon className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all relative ${
                isActive
                  ? 'bg-gradient-to-r from-myceili-light to-primary-50 text-secondary-700 shadow-sm'
                  : 'text-gray-700 hover:bg-gray-50'
              }`
            }
          >
            <item.icon className="w-6 h-6 flex-shrink-0" />
            {sidebarOpen && (
              <>
                <span className="ml-3">{item.name}</span>
                {item.badge > 0 && (
                  <span className="ml-auto inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                    {item.badge}
                  </span>
                )}
              </>
            )}
            {!sidebarOpen && item.badge > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;

