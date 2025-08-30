import { useState } from 'react';
import globalRequest from '../services/globalRequest';
import { useAppState } from '../contexts/AppStateContext';
import apiRoutes from '../utils/apiRoutes';


interface User {
  id: string;
  name: string;
  email: string;
}

interface Product {
  id: string;
  productName: string;
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
}

export interface Payout {
  id: string;
  userId: string;
  productId: string;
  orderItemId: string;
  type: string;
  totalEarningAmount: number;
  totalPaidByAdmin: number;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  remarks: string | null;
  recordStatus: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  user: User;
  product: Product;
  orderItem: OrderItem;
  remainingAmount: number;
}

interface PayoutListResponse {
  earnings: Payout[];
  totalItems: number;
  page: number;
  limit: number;
}

interface GetPayoutListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export const usePayouts = () => {
  const [payoutList, setPayoutList] = useState<PayoutListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPayouts, setTotalPayouts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const { setLoading } = useAppState();

  const getPayoutList = async (params: GetPayoutListParams = {}) => {
    console.log('params', params);
    try {
      setLoading(true);
      setIsLoading(true);
      const response = await globalRequest(
        apiRoutes.payoutList,
        'get',
        {},
        {
          params: {
            page: params.page || 1,
            limit: params.limit || 10,
            ...(params.search ? { search: params.search } : {}),
            status: params.status ? params.status.toUpperCase() : '',
          }
        }
      );
      
      const data = response as PayoutListResponse;
      setPayoutList(data);
      setTotalPayouts(data.totalItems);
      setCurrentPage(data.page);
      return response;
    } catch (error) {
      console.error('Failed to fetch payouts:', error);
      throw error;
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };

  const settlePayout = async (earningId: string, amount: string, note: string) => {
    try {
      setLoading(true);
      await globalRequest(
        apiRoutes.settlePayout,
        'post',
        {
          earningId,
          amount,
          note
        }
      );
      // Refresh the list after settling
      await getPayoutList({
        page: currentPage,
        limit: 10
      });
      return true;
    } catch (error) {
      console.error('Failed to settle payout:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getPayoutDetail = async (id: string) => {
    try {
      setLoading(true);
      const response = await globalRequest(
        apiRoutes.payoutDetail(id),
        'get'
      );
      return response;
    } catch (error) {
      console.error('Failed to fetch payout details:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    payoutList,
    totalPayouts,
    currentPage,
    getPayoutList,
    getPayoutDetail,
    settlePayout,
    isLoading,
  };
};
