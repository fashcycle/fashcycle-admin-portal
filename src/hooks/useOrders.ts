import { useState } from 'react';
import globalRequest from '../services/globalRequest';
import { useAppState } from '../contexts/AppStateContext';
import apiRoutes from '../utils/apiRoutes';

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
    productImage: {
      id: string;
      frontLook: string | null;
      backLook: string | null;
      sideLook: string | null;
      closeUpLook: string | null;
      optional1: string | null;
      optional2: string | null;
      productId: string;
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
  paymentStatus: string;
  shippingAddressId: string;
  pickupAddressId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  orderedAt: string;
  updatedAt: string;
  deliveredAt: string | null;
  returnDeliveredAt: string | null;
  securityAmount: number;
  convenienceFee: number;
  items: OrderItem[];
}

interface OrderListResponse {
  orders: Order[];
  total: number;
  currentPage: number;
  limit: number;
}

interface GetOrdersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  paymentStatus?: string;
}

export const useOrders = () => {
  const [orderList, setOrderList] = useState<Order[]>([]);
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
          }
        }
      );
      
      const data: OrderListResponse = response;
      setOrderList(data.orders || []);
      setTotalOrders(data.total || 0);
      setCurrentPage(data.currentPage || 1);
      return data;
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    orderList,
    totalOrders,
    currentPage,
    getOrderList,
  };
}; 