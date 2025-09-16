import React, { useState, useEffect } from 'react';
import { Bell, Check, X, CheckCircle, Package, User, Heart, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import globalRequest from '../services/globalRequest';
import { useAppState } from '../contexts/AppStateContext';

interface NotificationMetadata {
  userId?: string;
  userEmail?: string;
  userName?: string;
  productId?: string;
  productName?: string;
  rentFrom?: string;
  rentTo?: string;
  actionType?: string;
  cartItemId?: string;
  notificationCategory?: string;
}

interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string;
  metadata: NotificationMetadata;
  notificationType: string;
  read: boolean;
  createdAt: string;
}



interface PaginationState {
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { setLoading: setGlobalLoading, setMessage } = useAppState();
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    totalPages: 1,
    hasMore: false
  });
  const navigate = useNavigate();

  type TabType = 'all' | 'users' | 'products' | 'wishlist' | 'cart' | 'orders' | 'reviews';
  const [activeTab, setActiveTab] = useState<TabType>('all');

  const tabs: { id: TabType; label: string; icon: React.ReactNode; types?: string[] }[] = [
    { 
      id: 'all', 
      label: 'All', 
      icon: <Bell className="h-4 w-4" /> 
    },
    { 
      id: 'users', 
      label: 'Users', 
      icon: <User className="h-4 w-4" />, 
      types: ['USER_REGISTRATION'] 
    },
    { 
      id: 'products', 
      label: 'Products', 
      icon: <Package className="h-4 w-4" />, 
      types: [
        'PRODUCT_LISTING',
        'PRODUCT_AVAILABILITY_CONFIRMED',
        'PRODUCT_AVAILABILITY_REJECTED',
        'NO_RESPONSE_IN_FIRST_STAGE_ALERT'
      ] 
    },
    { 
      id: 'wishlist', 
      label: 'Wishlist', 
      icon: <Heart className="h-4 w-4" />, 
      types: ['WISHLIST_ADDITION', 'WISHLIST_REMOVAL'] 
    },
    { 
      id: 'cart', 
      label: 'Cart', 
      icon: <ShoppingCart className="h-4 w-4" />, 
      types: ['CART_ITEM_ADDED'] 
    },
    { 
      id: 'orders', 
      label: 'Orders', 
      icon: <Package className="h-4 w-4" />, 
      types: ['NEW_ORDER_PLACED', 'ORDER_CANCELLED'] 
    },
    { 
      id: 'reviews', 
      label: 'Reviews', 
      icon: <CheckCircle className="h-4 w-4" />, 
      types: ['NEW_REVIEW'] 
    }
  ];

  const fetchNotifications = async (types?: string[], page: number = 1, append: boolean = false) => {
    try {
      setLoading(true);
      setGlobalLoading(true);
      const queryParams: Record<string, string | string[]> = {
        limit: '20',
        page: page.toString()
      };
      if (types && types.length > 0) {
        queryParams.type = types;
      }
      
      const response = await globalRequest(
        `/admin/notifications?${new URLSearchParams(
          Object.entries(queryParams).flatMap(([key, value]) => 
            Array.isArray(value) 
              ? value.map(v => [key, v]) 
              : [[key, value]]
          )
        ).toString()}`,
        'get'
      );
      
      console.log('API Response:', response); // Debug log
      
      if (response.success) {
        const { data, unreadCount, pagination: paginationData } = response;
        setNotifications(prev => append ? [...prev, ...data] : data);
        setUnreadCount(unreadCount);
        setPagination({
          currentPage: paginationData.page,
          totalPages: paginationData.totalPages,
          hasMore: paginationData.page < paginationData.totalPages
        });
      } else {
        setMessage(response.message || 'Failed to fetch notifications', 'error');
      }
    } catch (error: any) {
      console.error('Error fetching notifications:', error);
      setMessage(error?.response?.data?.message || 'Failed to fetch notifications', 'error');
    } finally {
      setLoading(false);
      setGlobalLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

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



  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'USER_LOGIN':
        return <User className="h-5 w-5 text-blue-500" />;
      case 'CART_ITEM_ADDED':
        return <ShoppingCart className="h-5 w-5 text-green-500" />;
      case 'WISHLIST_ADDITION':
      case 'WISHLIST_REMOVAL':
        return <Heart className="h-5 w-5 text-red-500" />;
      case 'PRODUCT_APPROVAL':
        return <CheckCircle className="h-5 w-5 text-yellow-500" />;
      case 'ORDER_CREATED':
      case 'ORDER_UPDATED':
      case 'ORDER_CANCELLED':
        return <Package className="h-5 w-5 text-purple-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getNotificationBorderColor = (type: string) => {
    switch (type) {
      case 'USER_LOGIN':
        return 'border-l-blue-500';
      case 'CART_ITEM_ADDED':
        return 'border-l-green-500';
      case 'WISHLIST_ADDITION':
      case 'WISHLIST_REMOVAL':
        return 'border-l-red-500';
      case 'PRODUCT_APPROVAL':
        return 'border-l-yellow-500';
      case 'ORDER_CREATED':
      case 'ORDER_UPDATED':
      case 'ORDER_CANCELLED':
        return 'border-l-purple-500';
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
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setPagination({ currentPage: 1, totalPages: 1, hasMore: false });
                fetchNotifications(tab.types, 1, false);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.id === 'all' && unreadCount > 0 && (
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
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading notifications...</p>
          </div>
        ) : (
          notifications.map((notification) => (
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
                          {notification.body}
                      </p>
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                          {formatTimeAgo(notification.createdAt)}
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
                  
                    {notification.metadata && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {notification.metadata.userId && (
                          <button 
                            onClick={() => navigate(`/dashboard/users/${notification.metadata.userId}`)}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                          >
                            <User className="h-3 w-3 mr-1" />
                            View User
                          </button>
                        )}
                        {notification.metadata.productId && (
                          <button 
                            onClick={() => navigate(`/dashboard/products/${notification.metadata.productId}/view`)}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                          >
                            <Package className="h-3 w-3 mr-1" />
                            View Product
                          </button>
                        )}
                        {notification.metadata.cartItemId && (
                          <button 
                            onClick={() => navigate(`/dashboard/orders/${notification.metadata.cartItemId}`)}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                          >
                            <ShoppingCart className="h-3 w-3 mr-1" />
                            View Order
                      </button>
                        )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          ))
        )}
      </div>

      {!loading && notifications.length === 0 && (
        <div className="text-center py-12">
          <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No notifications found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {activeTab === 'all' 
              ? "You're all caught up! No notifications to show."
              : `No notifications in ${tabs.find(t => t.id === activeTab)?.label || activeTab} category.`
            }
          </p>
        </div>
      )}

      {/* Load More Button */}
      {!loading && pagination.hasMore && notifications.length > 0 && (
        <div className="mt-6 text-center">
          <button
            onClick={() => fetchNotifications(tabs.find(t => t.id === activeTab)?.types, pagination.currentPage + 1, true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            Load More
            {loading && (
              <span className="ml-2">
                <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
              </span>
            )}
          </button>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Showing {notifications.length} of {pagination.totalPages * 20} notifications
          </p>
        </div>
      )}
    </div>
  );
};

export default Notifications;