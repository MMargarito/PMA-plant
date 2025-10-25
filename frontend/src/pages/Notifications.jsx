import React, { useEffect } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { useDispatch } from 'react-redux';
import { fetchNotificationsSuccess } from '../store/slices/notificationsSlice';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const GET_NOTIFICATIONS = gql`
  query GetNotifications {
    notifications {
      notifications {
        id
        type
        title
        message
        is_read
        created_at
        link
      }
      unreadCount
    }
  }
`;

const MARK_AS_READ = gql`
  mutation MarkNotificationAsRead($id: ID!) {
    markNotificationAsRead(id: $id)
  }
`;

const MARK_ALL_AS_READ = gql`
  mutation MarkAllNotificationsAsRead {
    markAllNotificationsAsRead
  }
`;

const Notifications = () => {
  const dispatch = useDispatch();
  const { loading, data, refetch } = useQuery(GET_NOTIFICATIONS);
  const [markAsRead] = useMutation(MARK_AS_READ);
  const [markAllAsRead] = useMutation(MARK_ALL_AS_READ);

  useEffect(() => {
    if (data?.notifications) {
      dispatch(fetchNotificationsSuccess(data.notifications));
    }
  }, [data, dispatch]);

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead({ variables: { id } });
      refetch();
    } catch (error) {
      toast.error('Failed to mark notification as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      toast.success('All notifications marked as read');
      refetch();
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const notifications = data?.notifications?.notifications || [];
  const unreadCount = data?.notifications?.unreadCount || 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="mt-1 text-sm text-gray-500">
            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No notifications</p>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`px-6 py-4 hover:bg-gray-50 cursor-pointer ${
                !notification.is_read ? 'bg-blue-50' : ''
              }`}
              onClick={() => !notification.is_read && handleMarkAsRead(notification.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    {!notification.is_read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                    <h3 className="text-base font-medium text-gray-900">
                      {notification.title}
                    </h3>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                  <p className="mt-1 text-xs text-gray-400">
                    {format(new Date(notification.created_at), 'PPp')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;

