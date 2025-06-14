import React, { useState } from 'react';
import { Bell, Check, X, AlertCircle, Info, CheckCircle, Package, User, Calendar, CreditCard } from 'lucide-react';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actionText?: string;
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'info',
      title: 'New Product Request',
      message: 'Sarah Johnson has submitted a new evening dress for approval. Review required.',
      timestamp: '2024-01-20T10:30:00Z',
      read: false,
      actionUrl: '/dashboard/products',
      actionText: 'Review Product'
    },
    {
      id: '2',
      type: 'success',
      title: 'Order Completed',
      message: 'Order RH-2024-001 has been successfully completed. Customer feedback received.',
      timestamp: '2024-01-20T09:15:00Z',
      read: false,
      actionUrl: '/dashboard/orders',
      actionText: 'View Order'
    },
    {
      id: '3', 
      type: 'warning',
      title: 'Payment Pending',
      message: 'Order RH-2024-004 payment is still pending. Customer may need assistance.',
      timestamp: '2024-01-19T16:45:00Z',
      read: true,
      actionUrl: '/dashboard/orders',
      actionText: 'Check Payment'
    },
    {
      id: '4',
      type: 'info',
      title: 'Product Approved',
      message: 'Classic Business Suit by Hugo Boss has been approved and is now live.',
      timestamp: '2024-01-19T14:20:00Z',
      read: true,
      actionUrl: '/dashboard/products/approved',
      actionText: 'View Product'
    },
    {
      id: '5',
      type: 'error',
      title: 'Order Cancelled',
      message: 'Order RH-2024-002 has been cancelled by the customer. Refund processing required.',
      timestamp: '2024-01-18T11:30:00Z',
      read: true,
      actionUrl: '/dashboard/orders',
      actionText: 'Process Refund'
    },
    {
      id: '6',
      type: 'success',
      title: 'New User Registration',
      message: 'Michael Rodriguez has registered as a new user and is ready to rent products.',
      timestamp: '2024-01-18T09:20:00Z',
      read: true
    }
  ]);

  const [filter, setFilter] = useState<'all' | 'unread' | 'info' | 'success' | 'warning' | 'error'>('all');

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <X className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getNotificationBorderColor = (type: string) => {
    switch (type) {
      case 'info':
        return 'border-l-blue-500';
      case 'success':
        return 'border-l-green-500';
      case 'warning':
        return 'border-l-yellow-500';
      case 'error':
        return 'border-l-red-500';
      default:
        return 'border-l-gray-300';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Yesterday';
    return `${diffInDays} days ago`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
            <Bell className="h-7 w-7" />
            <span>Notifications</span>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Stay updated with all your admin activities
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              Mark all as read
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-2">
          {['all', 'unread', 'info', 'success', 'warning', 'error'].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === filterType
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              {filterType === 'unread' && unreadCount > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 border-l-4 ${getNotificationBorderColor(notification.type)} ${
              !notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
            } transition-colors hover:shadow-md`}
          >
            <div className="p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className={`text-sm font-medium ${
                        !notification.read ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {notification.title}
                        {!notification.read && (
                          <span className="ml-2 h-2 w-2 bg-blue-600 rounded-full inline-block" />
                        )}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {notification.message}
                      </p>
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                        {formatTimeAgo(notification.timestamp)}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                          title="Mark as read"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        title="Delete notification"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  {notification.actionUrl && notification.actionText && (
                    <div className="mt-4">
                      <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                        {notification.actionText}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredNotifications.length === 0 && (
        <div className="text-center py-12">
          <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No notifications found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {filter === 'all' 
              ? "You're all caught up! No notifications to show."
              : `No ${filter} notifications to display.`
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default Notifications;