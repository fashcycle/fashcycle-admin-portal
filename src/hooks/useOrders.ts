import { useState } from 'react';
import globalRequest from '../services/globalRequest';
import { useAppState } from '../contexts/AppStateContext';
import apiRoutes from '../utils/apiRoutes';

interface OrderHistory {
  id: string;
  orderId: string;
  status: string;
  changedAt: string;
  updatedBy: string;
  admin: {
    id: string;
    name: string;
    role: string;
  };
}

interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  price: number;
  rentFrom: string;
  rentTo: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  product: {
    id: string;
    productName: string;
    mobileNumber: string;
    categoryName: string;
    size: string;
    sizeFlexibility: string;
    color: string;
    productImage: {
      frontLook: string;
    };
  };
}

interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  rentAmount: number;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  securityStatus: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  pickupAddressId: string;
  shippingAddressId: string;
  deliveredAt: string;
  returnDeliveredAt: string;
  orderedAt: string;
  updatedAt: string;
  securityAmount: number;
  convenienceFee: number;
  items: OrderItem;
  // Additional fields for order detail
  user?: {
    id: string;
    name: string;
    email: string;
    mobile: string;
  };
  seller?: {
    id: string;
    name: string;
    email: string;
    mobile: string;
  };
  shippingAddress?: {
    id: string;
    userId: string;
    pincodeId: string;
    landmark: string;
    addressLine1: string;
    addressLine2: string | null;
    addressType: string;
    isDeleted: boolean;
    pincode: {
      city: string;
      state: string;
      country: string;
      pincode: string;
    };
  };
  pickupAddress?: {
    id: string;
    userId: string;
    pincodeId: string;
    landmark: string;
    addressLine1: string;
    addressLine2: string | null;
    addressType: string;
    isDeleted: boolean;
    pincode: {
      city: string;
      state: string;
      country: string;
      pincode: string;
    };
  };
  orderNotes?: string;
  adminNotes?: string;
  timeline?: {
    orderPlaced: string;
    orderConfirmed?: string;
    packed?: string;
    shipped?: string;
    outForDelivery?: string;
    delivered?: string;
    returned?: string;
  };
  history?: OrderHistory[];
}

interface OrderListResponse {
  list: Order[];
  total: number;
  page: number;
  limit: number;
}

interface GetOrdersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  paymentStatus?: string;
  paymentMethod?: string;
}

interface UpdateOrderStatusParams {
  status?: string;
  securityStatus?: string;
  paymentStatus?: string;
  rentalStatus?: string;
}

export const useOrders = () => {
  const [orderList, setOrderList] = useState<Order[]>([]);
  const [orderDetail, setOrderDetail] = useState<Order | null>(null);
  const [totalOrders, setTotalOrders] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const { setLoading } = useAppState();

  const getOrderList = async (params: GetOrdersParams = {}) => {
    try {
      setLoading(true);
      const response = await globalRequest(
        apiRoutes.orderList,
        'get',
        {},
        {
          params: {
            page: params.page || 1,
            limit: params.limit || 10,
            search: params.search || '',
            status: params.status || '',
            paymentStatus: params.paymentStatus || '',
            paymentMethod: params.paymentMethod || '',
          }
        }
      );
      
      const data: OrderListResponse = response;
      setOrderList(data.list || []);
      setTotalOrders(data.total || 0);
      setCurrentPage(data.page || 1);
      return data;
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getOrderDetail = async (orderId: string) => {
    if (!orderId) return null;

    try {
      setLoading(true);
      const response = await globalRequest(
        apiRoutes.orderDetail(orderId),
        'get'
      );
      
      if (response.success && response.order) {
        setOrderDetail(response.order);
        return response.order;
      } else {
        throw new Error('Failed to fetch order details');
      }
    } catch (error) {
      console.error('Failed to fetch order details:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, params: UpdateOrderStatusParams) => {
    if (!orderId) return null;
    try {
      setLoading(true);
      const response = await globalRequest(
        apiRoutes.orderStatusUpdate(orderId),
        'put',
        params
      );
      
      if (response.success) {
        // Update the order detail if it's currently loaded
        if (orderDetail && orderDetail.id === orderId) {
          setOrderDetail({
            ...orderDetail,
            ...(params.status && { status: params.status }),
            ...(params.securityStatus && { securityStatus: params.securityStatus }),
            ...(params.paymentStatus && { paymentStatus: params.paymentStatus })
          });
        }
        return response;
      } else {
        throw new Error('Failed to update order status');
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    orderList,
    orderDetail,
    totalOrders,
    currentPage,
    getOrderList,
    getOrderDetail,
    updateOrderStatus,
  };
}; 