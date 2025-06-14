import React, { useState } from 'react';
import { Search, Filter, Eye, ChevronDown, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Order {
  id: string;
  orderId: string;
  product: string;
  buyer: string;
  seller: string;
  type: 'rent' | 'sell';
  date: string;
  amount: number;
  paymentStatus: 'completed' | 'pending';
  deliveryStatus: 'delivered' | 'in transit' | 'processing';
}

const Orders: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('');
  const [selectedDeliveryStatus, setSelectedDeliveryStatus] = useState('');

  const orders: Order[] = [
    {
      id: '1',
      orderId: 'ORD001',
      product: 'Blue Lehenga Set',
      buyer: 'Meera Patel',
      seller: 'Priya Sharma',
      type: 'sell',
      date: '2024-01-20',
      amount: 15000,
      paymentStatus: 'completed',
      deliveryStatus: 'delivered'
    },
    {
      id: '2',
      orderId: 'ORD002',
      product: 'Red Anarkali Suit',
      buyer: 'Anita Singh',
      seller: 'Meera Patel',
      type: 'rent',
      date: '2024-01-18',
      amount: 2500,
      paymentStatus: 'completed',
      deliveryStatus: 'in transit'
    },
    {
      id: '3',
      orderId: 'ORD003',
      product: 'Green Sharara Set',
      buyer: 'Priya Sharma',
      seller: 'Anita Singh',
      type: 'rent',
      date: '2024-01-16',
      amount: 3000,
      paymentStatus: 'pending',
      deliveryStatus: 'processing'
    }
  ];

  const paymentStatuses = ['completed', 'pending'];
  const deliveryStatuses = ['delivered', 'in transit', 'processing'];

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.buyer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.seller.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPaymentStatus = !selectedPaymentStatus || order.paymentStatus === selectedPaymentStatus;
    const matchesDeliveryStatus = !selectedDeliveryStatus || order.deliveryStatus === selectedDeliveryStatus;
    
    return matchesSearch && matchesPaymentStatus && matchesDeliveryStatus;
  });

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'pending':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getDeliveryStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'in transit':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'processing':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'rent':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'sell':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Orders Management
        </h1>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="relative">
              <select
                value={selectedPaymentStatus}
                onChange={(e) => setSelectedPaymentStatus(e.target.value)}
                className="appearance-none px-4 py-2.5 pr-8 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">Payment Status</option>
                {paymentStatuses.map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
              <ChevronDown className="h-4 w-4 text-gray-400 absolute right-2 top-3.5 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={selectedDeliveryStatus}
                onChange={(e) => setSelectedDeliveryStatus(e.target.value)}
                className="appearance-none px-4 py-2.5 pr-8 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">Delivery Status</option>
                {deliveryStatuses.map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
              <ChevronDown className="h-4 w-4 text-gray-400 absolute right-2 top-3.5 pointer-events-none" />
            </div>

            <button className="flex items-center space-x-2 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Calendar className="h-4 w-4" />
              <span>Date Range</span>
            </button>

            <button className="flex items-center space-x-2 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Filter className="h-4 w-4" />
              <span>More Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Order ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Product
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Buyer
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Seller
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Payment
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Delivery
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {order.orderId}
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">
                    {order.product}
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">
                    {order.buyer}
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">
                    {order.seller}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(order.type)}`}>
                      {order.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">
                    {order.date}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    ₹{order.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDeliveryStatusColor(order.deliveryStatus)}`}>
                      {order.deliveryStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      to={`/dashboard/orders/${order.id}`}
                      className="p-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                      title="View Order"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;