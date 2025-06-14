import React from 'react';
import { Package, ShoppingCart, Users, TrendingUp, Clock, CheckCircle, AlertCircle, DollarSign } from 'lucide-react';

const Dashboard: React.FC = () => {
  // Mock data for dashboard
  const stats = [
    {
      name: 'Total Products',
      value: '2,847',
      change: '+12%',
      changeType: 'increase',
      icon: Package,
      color: 'blue'
    },
    {
      name: 'Active Orders',
      value: '156',
      change: '+8%',
      changeType: 'increase',
      icon: ShoppingCart,
      color: 'green'
    },
    {
      name: 'Total Users',
      value: '1,429',
      change: '+23%',
      changeType: 'increase',
      icon: Users,
      color: 'purple'
    },
    {
      name: 'Revenue',
      value: '$89,425',
      change: '+18%',
      changeType: 'increase',
      icon: DollarSign,
      color: 'yellow'
    }
  ];

  const recentOrders = [
    {
      id: 'RH-2024-001',
      customer: 'Emily Chen',
      product: 'Designer Evening Dress',
      amount: '$450',
      status: 'active',
      date: '2024-01-20'
    },
    {
      id: 'RH-2024-002',
      customer: 'Michael Rodriguez',
      product: 'Classic Business Suit',
      amount: '$160',
      status: 'confirmed',
      date: '2024-01-19'
    },
    {
      id: 'RH-2024-003',
      customer: 'Jessica Park',
      product: 'Vintage Leather Jacket',
      amount: '$240',
      status: 'completed',
      date: '2024-01-18'
    }
  ];

  const pendingRequests = [
    {
      id: '1',
      product: 'Designer Evening Dress',
      submitter: 'Sarah Johnson',
      category: 'Formal Wear',
      date: '2024-01-15'
    },
    {
      id: '2',
      product: 'Classic Business Suit',
      submitter: 'Michael Brown',
      category: 'Business Wear',
      date: '2024-01-14'
    },
    {
      id: '3',
      product: 'Vintage Leather Jacket',
      submitter: 'Emma Davis',
      category: 'Casual Wear',
      date: '2024-01-13'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case '확인됨':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'completed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatColor = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-500';
      case 'green':
        return 'bg-green-500';
      case 'purple':
        return 'bg-purple-500';
      case 'yellow':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, Admin!</h1>
        <p className="text-blue-100">
          Here's what's happening with your rental platform today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.name}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className={`text-sm ${
                    stat.changeType === 'increase' 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {stat.change} from last month
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${getStatColor(stat.color)}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
              <ShoppingCart className="h-5 w-5" />
              <span>Recent Orders</span>
            </h2>
            <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium transition-colors">
              View all
            </button>
          </div>
          
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {order.id}
                    </span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {order.amount}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {order.customer} • {order.product}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500 dark:text-gray-500">
                      {order.date}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Product Requests */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Pending Requests</span>
            </h2>
            <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium transition-colors">
              View all
            </button>
          </div>
          
          <div className="space-y-4">
            {pendingRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {request.product}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                      <Clock className="h-3 w-3 mr-1" />
                      Pending
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {request.submitter} • {request.category}
                  </p>
                  <span className="text-xs text-gray-500 dark:text-gray-500">
                    Submitted {request.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
            <CheckCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <div className="text-left">
              <p className="font-medium text-gray-900 dark:text-white">Review Products</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">3 pending approvals</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
            <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
            <div className="text-left">
              <p className="font-medium text-gray-900 dark:text-white">View Analytics</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Check performance</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors">
            <AlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            <div className="text-left">
              <p className="font-medium text-gray-900 dark:text-white">Manage Issues</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">2 support tickets</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;