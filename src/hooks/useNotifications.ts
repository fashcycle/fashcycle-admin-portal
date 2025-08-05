import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import globalRequest from '../services/globalRequest';
import apiRoutes from '../utils/apiRoutes';

interface NotificationResponse {
  success: boolean;
  data: any[];
  unreadCount: number;
  readCount: number;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const useNotifications = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const fetchNotificationCount = async () => {
    try {
      setLoading(true);
      const response = await globalRequest(
        apiRoutes.notifications,
        'get',
        {},
        {
          params: {
            page: 1,
            limit: 1
          }
        }
      );
      
      const data: NotificationResponse = response;
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error('Failed to fetch notification count:', error);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  };

  const clearUnreadCount = () => {
    setUnreadCount(0);
  };

  useEffect(() => {
    fetchNotificationCount();
  }, [location.pathname]);

  return {
    unreadCount,
    loading,
    fetchNotificationCount,
    clearUnreadCount
  };
}; 