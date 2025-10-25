import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { subscribeToNotifications, subscribeToUnreadCount } from '../config/socket';
import { addNotification, setUnreadCount } from '../store/slices/notificationsSlice';

const Layout = () => {
  const dispatch = useDispatch();
  const { sidebarOpen } = useSelector((state) => state.ui);

  useEffect(() => {
    // Subscribe to real-time notifications
    const unsubscribeNotifications = subscribeToNotifications((notification) => {
      dispatch(addNotification(notification));
    });

    const unsubscribeUnreadCount = subscribeToUnreadCount((data) => {
      dispatch(setUnreadCount(data.count));
    });

    return () => {
      if (unsubscribeNotifications) unsubscribeNotifications();
      if (unsubscribeUnreadCount) unsubscribeUnreadCount();
    };
  }, [dispatch]);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <Navbar />
        
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;

