import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, User, CreditCard, Truck, MapPin, Calendar, Edit } from 'lucide-react';

const OrderDetail: React.FC = () => {
  const { id } = useParams();
  const [paymentStatus, setPaymentStatus] = useState('completed');
  const [deliveryStatus, setDeliveryStatus] = useState('returned');
  const [adminNotes, setAdminNotes] = useState('');

  // Mock order data
  const order = {
    id: '1',
    orderId: 'ORD001',
    product: {
      name: 'Blue Lehenga Set',
      type: 'sell',
      price: 15000,
      image: 'https://images.pexels.com/photos/1374064/pexels-photo-1374064.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    buyer: {
      name: 'Meera Patel',
      email: 'meera.patel@email.com',
      phone: '+91 98765 43210'
    },
    seller: {
      name: 'Priya Sharma',
      email: 'priya.sharma@email.com',
      phone: '+91 87654 32109'
    },
    timeline: {
      orderPlaced: '2024-01-20',
      estimatedDelivery: '2024-01-25'
    },
    shippingAddress: '456 Fashion Avenue, Andheri East, Mumbai, Maharashtra - 400069',
    orderNotes: 'Handle with care - delicate embroidery work',
    shippingProgress: [
      { status: 'Order Placed', date: '2024-01-20', completed: true },
      { status: 'Order Confirmed', date: '2024-01-20', completed: true },
      { status: 'Packed', date: '2024-01-21', completed: true },
      { status: 'Shipped', date: '2024-01-22', completed: true },
      { status: 'Out for Delivery', date: '2024-01-24', completed: true },
      { status: 'Delivered', date: '2024-01-25', completed: true },
      { status: 'Returned', date: '2024-01-28', completed: true }
    ]
  };

  const handleAddNotes = () => {
    // Handle adding admin notes
    console.log('Adding notes:', adminNotes);
    setAdminNotes('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'returned':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/dashboard/orders"
            className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Orders</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Order Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Information */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2 mb-6">
              <Package className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Order Information
              </h2>
            </div>

            <div className="flex items-start space-x-4">
              <img
                src={order.product.image}
                alt={order.product.name}
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {order.product.name}
                </h3>
                <div className="flex items-center space-x-3 mb-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
                    {order.product.type}
                  </span>
                  <Link
                    to={`/dashboard/products/${order.id}/view`}
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                  >
                    View Product
                  </Link>
                </div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  ₹{order.product.price.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Buyer and Seller Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Buyer */}
            <div className="bg-green-50 dark:bg-green-900/10 p-6 rounded-xl border border-green-200 dark:border-green-800">
              <div className="flex items-center space-x-2 mb-4">
                <User className="h-5 w-5 text-green-600 dark:text-green-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Buyer
                </h3>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Name:</span>
                  <p className="text-gray-900 dark:text-white">{order.buyer.name}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Email:</span>
                  <p className="text-gray-900 dark:text-white">{order.buyer.email}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone:</span>
                  <p className="text-gray-900 dark:text-white">{order.buyer.phone}</p>
                </div>
              </div>
              <button className="mt-4 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 text-sm font-medium">
                View Profile
              </button>
            </div>

            {/* Seller */}
            <div className="bg-orange-50 dark:bg-orange-900/10 p-6 rounded-xl border border-orange-200 dark:border-orange-800">
              <div className="flex items-center space-x-2 mb-4">
                <User className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Seller
                </h3>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Name:</span>
                  <p className="text-gray-900 dark:text-white">{order.seller.name}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Email:</span>
                  <p className="text-gray-900 dark:text-white">{order.seller.email}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone:</span>
                  <p className="text-gray-900 dark:text-white">{order.seller.phone}</p>
                </div>
              </div>
              <button className="mt-4 text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 text-sm font-medium">
                View Profile
              </button>
            </div>
          </div>

          {/* Order Timeline */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2 mb-6">
              <Calendar className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Order Timeline
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Order Placed:</span>
                <p className="text-gray-900 dark:text-white">{order.timeline.orderPlaced}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Estimated Delivery:</span>
                <p className="text-gray-900 dark:text-white">{order.timeline.estimatedDelivery}</p>
              </div>
            </div>

            {/* Shipping Progress */}
            <div className="space-y-4">
              {order.shippingProgress.map((step, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className={`w-4 h-4 rounded-full ${
                    step.completed 
                      ? 'bg-blue-600' 
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className={`font-medium ${
                        step.completed 
                          ? 'text-gray-900 dark:text-white' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {step.status}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {step.date}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2 mb-4">
              <MapPin className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Shipping Address
              </h3>
            </div>
            <p className="text-gray-900 dark:text-white">
              {order.shippingAddress}
            </p>
          </div>

          {/* Order Notes */}
          <div className="bg-yellow-50 dark:bg-yellow-900/10 p-6 rounded-xl border border-yellow-200 dark:border-yellow-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Order Notes
            </h3>
            <p className="text-gray-900 dark:text-white">
              {order.orderNotes}
            </p>
          </div>
        </div>

        {/* Right Column - Status and Actions */}
        <div className="space-y-6">
          {/* Payment Status */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2 mb-4">
              <CreditCard className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Payment Status
              </h3>
            </div>
            <div className="space-y-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(paymentStatus)}`}>
                {paymentStatus}
              </span>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Update Payment Status
                </label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
            </div>
          </div>

          {/* Delivery Status */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2 mb-4">
              <Truck className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Delivery Status
              </h3>
            </div>
            <div className="space-y-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(deliveryStatus)}`}>
                {deliveryStatus}
              </span>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Update Delivery Status
                </label>
                <select
                  value={deliveryStatus}
                  onChange={(e) => setDeliveryStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="returned">Returned</option>
                </select>
              </div>
            </div>
          </div>

          {/* Admin Notes */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2 mb-4">
              <Edit className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Admin Notes
              </h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Add Notes
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={4}
                  placeholder="Add internal notes about this order..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <button
                onClick={handleAddNotes}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Notes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;