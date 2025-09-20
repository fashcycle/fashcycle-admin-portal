import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, User, CreditCard, Truck, MapPin, Calendar, Edit, Clock } from 'lucide-react';
import { useOrders } from '../../hooks/useOrders';
import { helpers } from '../../utils/helper';

const OrderDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState('completed');
  const [deliveryStatus, setDeliveryStatus] = useState('returned');
  const [securityStatus, setSecurityStatus] = useState('PENDING');
  const [adminNotes, setAdminNotes] = useState('');
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { orderDetail, getOrderDetail, updateOrderStatus } = useOrders();

  // Mock order data structure (will be replaced with API data)
  const [order, setOrder] = useState({
    id: '1',
    orderNumber: 'ORD001',
    rentAmount: 0,
    totalAmount: 15000,
    paymentStatus: 'completed',
    razorpayOrderId: '',
    razorpayPaymentId: '',
    deliveredAt: null as string | null,
    returnDeliveredAt: null as string | null,
    securityAmount: 0,
    convenienceFee: 0,
    items: [] as any[],
    product: {
      id: '',
      name: 'Blue Lehenga Set',
      type: 'sell',
      price: 15000,
      image: 'https://images.pexels.com/photos/1374064/pexels-photo-1374064.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    user: {
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
     pickupAddress: '123 Pickup Street, Andheri West, Mumbai, Maharashtra - 400058',
     orderNotes: 'Handle with care - delicate embroidery work'
  });

  useEffect(() => {
    if (id) {
      loadOrderDetail();
    }
  }, [id]);

  useEffect(() => {
    if (orderDetail) {
      // Update mock data with API data where available
      setOrder(prevOrder => ({
        ...prevOrder,
        id: orderDetail.id || prevOrder.id,
        orderNumber: orderDetail.orderNumber || '',
        rentAmount: orderDetail.rentAmount || 0,
        totalAmount: orderDetail.totalAmount || 0,
        paymentStatus: orderDetail.paymentStatus || '',
        razorpayOrderId: orderDetail.razorpayOrderId || '',
        razorpayPaymentId: orderDetail.razorpayPaymentId || '',
        deliveredAt: orderDetail.deliveredAt || null,
        returnDeliveredAt: orderDetail.returnDeliveredAt || null,
        securityAmount: orderDetail.securityAmount || 0,
        convenienceFee: orderDetail.convenienceFee || 0,
        product: {
          ...prevOrder.product,
          id: orderDetail.items?.productId || prevOrder.product.id,
          name: orderDetail.items?.product?.productName || prevOrder.product.name,
          type: orderDetail.items?.type || prevOrder.product.type,
          price: orderDetail.totalAmount || prevOrder.product.price,
          image: orderDetail.items?.product?.productImage?.frontLook || prevOrder.product.image
        },
        user: {
          name: orderDetail.user?.name || '',
          email: orderDetail.user?.email || '',
          phone: orderDetail.user?.mobile || ''
        },
        seller: {
          name: orderDetail.seller?.name || '',
          email: orderDetail.seller?.email || '',
          phone: orderDetail.seller?.mobile || ''
        },
        timeline: {
          orderPlaced: helpers?.formatDateFunction(orderDetail.orderedAt, "dd/mm/yyyy", true) || prevOrder.timeline.orderPlaced,
          estimatedDelivery: helpers?.formatDateFunction(orderDetail.updatedAt, "dd/mm/yyyy", true) || prevOrder.timeline.estimatedDelivery
        },
        shippingAddress: orderDetail.shippingAddress ? 
          [
            orderDetail.shippingAddress.addressLine1,
            orderDetail.shippingAddress.addressLine2,
            orderDetail.shippingAddress.landmark,
            orderDetail.shippingAddress.pincode?.city,
            orderDetail.shippingAddress.pincode?.state,
            orderDetail.shippingAddress.pincode?.country,
            orderDetail.shippingAddress.pincode?.pincode
          ].filter(Boolean).join(', ') : 
          prevOrder.shippingAddress,
        pickupAddress: orderDetail.pickupAddress ? 
          [
            orderDetail.pickupAddress.addressLine1,
            orderDetail.pickupAddress.addressLine2,
            orderDetail.pickupAddress.landmark,
            orderDetail.pickupAddress.pincode?.city,
            orderDetail.pickupAddress.pincode?.state,
            orderDetail.pickupAddress.pincode?.country,
            orderDetail.pickupAddress.pincode?.pincode
          ].filter(Boolean).join(', ') : 
          'Pickup address not available',
        orderNotes: orderDetail.orderNotes || prevOrder.orderNotes
      }));
      
      setPaymentStatus(orderDetail.paymentStatus || 'completed');
      setDeliveryStatus(orderDetail.status || 'returned');
      setSecurityStatus(orderDetail.securityStatus || 'PENDING');
      setAdminNotes(orderDetail.adminNotes || '');
    }
  }, [orderDetail]);

  const loadOrderDetail = async () => {
    if (!id) return;
    
    setDataLoading(true);
    setError('');
    
    try {
      await getOrderDetail(id);
    } catch (error) {
      console.error('Error loading order details:', error);
      setError('Failed to load order details');
    } finally {
      setDataLoading(false);
    }
  };

  const handleStatusUpdate = async (type: 'payment' | 'delivery' | 'security') => {
    if (!id) return;

    try {
      if (type === 'security') {
        await updateOrderStatus(id, { securityStatus });
        setSuccessMessage('Security status updated successfully!');
      } else if (type === 'payment') {
        await updateOrderStatus(id, { rentalStatus:paymentStatus });
        setSuccessMessage('Payment status updated successfully!');
      } else {
        await updateOrderStatus(id, { status: deliveryStatus });
        setSuccessMessage('Order status updated successfully!');
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error updating order status:', error);
      setError('Failed to update status. Please try again.');
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  };

  const handleAddNotes = () => {
    // Handle adding admin notes
    console.log('Adding notes:', adminNotes);
    setAdminNotes('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      // Payment statuses
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      // case 'processing':
      //   return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'withheld':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'adjusted':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'earned':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'refunded':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      
      // Order statuses
      case 'WAITING_CONFIRMATION':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'ORDER_CONFIRMED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'LEAVE_FOR_PICKUP':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'PICKED_UP':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400';
      case 'PREPARED_FOR_SHIPPING':
        return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-400';
      case 'OUT_FOR_DELIVERY':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'RETURN_INITIATED':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'RETURN_PICKUP_SCHEDULED':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'RETURN_PICKED_FROM_USER':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'RETURN_IN_TRANSIT_TO_OWNER':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'RETURN_DELIVERED_TO_OWNER':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'RETURN_COMPLETED':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      
      // Legacy statuses (keeping for backward compatibility)
      case 'returned':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getSecurityStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "deposited":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "partially_refunded":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
      case "withheld":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "refunded":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  if (dataLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={loadOrderDetail}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                {successMessage}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

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
                  <p className="text-gray-900 dark:text-white">{order?.orderNumber}</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
                    {order.product.type}
                  </span>
                  <Link
                    to={`/dashboard/products/${order?.product.id}/view`}
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
                  <p className="text-gray-900 dark:text-white">{order.user.name}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Email:</span>
                  <p className="text-gray-900 dark:text-white">{order.user.email}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone:</span>
                  <p className="text-gray-900 dark:text-white">{order.user.phone}</p>
                </div>
              </div>
              <button 
                onClick={() => navigate(`/dashboard/users/${orderDetail?.user?.id || ''}`)}
                className="mt-4 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 text-sm font-medium"
              >
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
              <button 
                onClick={() => navigate(`/dashboard/users/${orderDetail?.seller?.id || ''}`)}
                className="mt-4 text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 text-sm font-medium"
              >
                View Profile
              </button>
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

          {/* Pickup Address */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2 mb-4">
              <MapPin className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Pickup Address
              </h3>
            </div>
            <p className="text-gray-900 dark:text-white">
              {order.pickupAddress}
            </p>
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

                         {/* Order History */}
             <div className="space-y-4">
               {orderDetail?.history && orderDetail.history.length > 0 ? (
                 <div className="space-y-3">
                   {orderDetail.history.map((historyItem, index) => (
                     <div key={historyItem.id} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                       <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                       <div className="flex-1 min-w-0">
                         <div className="flex items-center justify-between">
                           <div className="flex items-center space-x-2">
                             <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(historyItem.status)}`}>
                               {historyItem.status.replace(/_/g, ' ')}
                             </span>
                             <span className="text-sm text-gray-500 dark:text-gray-400">
                               by {historyItem.admin.name}
                             </span>
                           </div>
                           <span className="text-xs text-gray-500 dark:text-gray-400">
                             {helpers.formatDate(historyItem.changedAt)}
                           </span>
                         </div>
                         <div className="mt-1 text-xs text-gray-600 dark:text-gray-300">
                           {historyItem.admin.role} • {new Date(historyItem.changedAt).toLocaleTimeString()}
                         </div>
                       </div>
                     </div>
                   ))}
                 </div>
               ) : (
                 <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                   No history available
                 </div>
               )}
             </div>
          </div>

          {/* Order Timeline */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2 mb-6">
              <Calendar className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Order Details
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">

              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Order Number:</span>
                <p className="text-gray-900 dark:text-white">{order.orderNumber}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Rent Amount:</span>
                <p className="text-gray-900 dark:text-white">{order.rentAmount}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Amount:</span>
                <p className="text-gray-900 dark:text-white">{order.totalAmount}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Payment Status:</span>
                <p className="text-gray-900 dark:text-white">{order.paymentStatus}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Razorpay Order Id:</span>
                <p className="text-gray-900 dark:text-white">{order.razorpayOrderId}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Razorpay PaymentId:</span>
                <p className="text-gray-900 dark:text-white">{order.razorpayPaymentId}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Delivered At:</span>
                <p className="text-gray-900 dark:text-white">{order.deliveredAt}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Return Delivered At:</span>
                <p className="text-gray-900 dark:text-white">{order.returnDeliveredAt}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Security Amount:</span>
                <p className="text-gray-900 dark:text-white">{order.securityAmount}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Convenience Fee:</span>
                <p className="text-gray-900 dark:text-white">{order.convenienceFee}</p>
              </div>

            </div>
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
              You Earn
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
                  <option value="PENDING">Pending</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="WITHHELD">Withheld</option>
                  <option value="ADJUSTED">Adjusted</option>
                  <option value="EARNED">Earned</option>
                </select>
                <button
                  onClick={() => handleStatusUpdate('payment')}
                  className="mt-2 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update Payment Status
                </button>
              </div>
            </div>
          </div>
          {/* Security Status */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2 mb-4">
              <CreditCard className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Security Status
              </h3>
            </div>
            <div className="space-y-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getSecurityStatusColor(securityStatus)}`}>
                {securityStatus?.replace('_', ' ')}
              </span>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Update Security Status
                </label>
                <select
                  value={securityStatus}
                  onChange={(e) => setSecurityStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="PENDING">Pending</option>
                  <option value="DEPOSITED">Deposited</option>
                  <option value="PARTIALLY_REFUNDED">Partially Refunded</option>
                  <option value="WITHHELD">Withheld</option>
                  <option value="REFUNDED">Refunded</option>
                </select>
                <button
                  onClick={() => handleStatusUpdate('security')}
                  className="mt-2 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update Security Status
                </button>
              </div>
            </div>
          </div>

          {/* Delivery Status */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2 mb-4">
              <Truck className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Order Status
              </h3>
            </div>
            <div className="space-y-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(deliveryStatus)}`}>
                {deliveryStatus}
              </span>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Update Order Status
                </label>
                <select
                  value={deliveryStatus}
                  onChange={(e) => setDeliveryStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="WAITING_CONFIRMATION">Waiting Confirmation</option>
                  <option value="ORDER_CANCELLED">Order Cancelled</option>
                  <option value="ORDER_CONFIRMED">Order Confirmed</option>                  
                  <option value="LEAVE_FOR_PICKUP">Leave for Pickup</option>
                  <option value="PICKED_UP">Picked Up</option>
                  <option value="PREPARED_FOR_SHIPPING">Prepared for Shipping</option>
                  <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="RETURN_INITIATED">Return Initiated</option>
                  <option value="RETURN_PICKUP_SCHEDULED">Return Pickup Scheduled</option>
                  <option value="RETURN_PICKED_FROM_USER">Return Picked from User</option>
                  <option value="RETURN_IN_TRANSIT_TO_OWNER">Return in Transit to Owner</option>
                  <option value="RETURN_DELIVERED_TO_OWNER">Return Delivered to Owner</option>
                  <option value="RETURN_COMPLETED">Return Completed</option>
                </select>
                <button
                  onClick={() => handleStatusUpdate('delivery')}
                  className="mt-2 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update Order Status
                </button>
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

          {/* Order History */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2 mb-4">
              <Clock className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Order History
              </h3>
            </div>
            <div className="space-y-4">
              {orderDetail?.history && orderDetail.history.length > 0 ? (
                <div className="space-y-3">
                  {orderDetail.history.map((historyItem, index) => (
                    <div key={historyItem.id} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(historyItem.status)}`}>
                              {historyItem.status.replace(/_/g, ' ')}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              by {historyItem.admin.name}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {helpers.formatDate(historyItem.changedAt)}
                          </span>
                        </div>
                        <div className="mt-1 text-xs text-gray-600 dark:text-gray-300">
                          {historyItem.admin.role} • {new Date(historyItem.changedAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                  No history available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;