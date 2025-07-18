import { useState } from 'react';
import globalRequest from '../services/globalRequest';
import { useAppState } from '../contexts/AppStateContext';
import apiRoutes from '../utils/apiRoutes';

interface Pincode {
  id: string;
  pincode: string;
  city: string;
  state: string;
  country: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

interface PincodeListResponse {
  pincodes: Pincode[];
  total: number;
  currentPage: number;
  totalPages: number;
}

interface GetPincodeListParams {
  page?: number;
  limit?: number;
  search?: string;
}

interface CreatePincodeData {
  pincode: string;
  city: string;
  state: string;
  country: string;
}

interface UpdatePincodeData {
  pincode: string;
  city: string;
  state: string;
  country: string;
}

export const usePincode = () => {
  const [pincodeList, setPincodeList] = useState<Pincode[]>([]);
  const [pincodeDetail, setPincodeDetail] = useState<Pincode | null>(null);
  const [totalPincodes, setTotalPincodes] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const { setLoading } = useAppState();

  const getPincodeList = async (params: GetPincodeListParams = {}) => {
    try {
      setLoading(true);
      const response = await globalRequest(
        apiRoutes.pincodeList,
        'get',
        {},
        {
          params: {
            page: params.page || 1,
            limit: params.limit || 10,
            search: params.search || '',
          }
        }
      );
      
      const data: PincodeListResponse = response;
      setPincodeList(data.pincodes || []);
      setTotalPincodes(data.total || 0);
      setCurrentPage(data.currentPage || 1);
      return data;
    } catch (error) {
      console.error('Failed to fetch pincodes:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getPincodeDetail = async (pincodeId: string) => {
    if (!pincodeId) return null;

    try {
      setLoading(true);
      const response = await globalRequest(
        apiRoutes.pincodeDetail(pincodeId),
        'get'
      );
      
      if (response.success && response.pincode) {
        setPincodeDetail(response.pincode);
        return response.pincode;
      } else {
        throw new Error('Failed to fetch pincode details');
      }
    } catch (error) {
      console.error('Failed to fetch pincode details:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    pincodeList,
    pincodeDetail,
    totalPincodes,
    currentPage,
    getPincodeList,
    getPincodeDetail,
  };
};

export const usePincodeMutations = () => {
  const { setLoading } = useAppState();

  const createPincode = async (pincodeData: CreatePincodeData) => {
    try {
      setLoading(true);
      const response = await globalRequest(
        apiRoutes.pincodeCreate,
        'post',
        pincodeData
      );
      
      if (response.success) {
        return response;
      } else {
        throw new Error('Failed to create pincode');
      }
    } catch (error) {
      console.error('Failed to create pincode:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updatePincode = async (pincodeId: string, pincodeData: UpdatePincodeData) => {
    try {
      setLoading(true);
      const response = await globalRequest(
        apiRoutes.pincodeUpdate(pincodeId),
        'put',
        pincodeData
      );
      
      if (response.success) {
        return response;
      } else {
        throw new Error('Failed to update pincode');
      }
    } catch (error) {
      console.error('Failed to update pincode:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deletePincode = async (pincodeId: string, callback: () => void) => {
    try {
      setLoading(true);
      const response = await globalRequest(
        apiRoutes.pincodeDelete(pincodeId),
        'delete'
      );
      
      if (response.success) {
        callback();
        return response;
      } else {
        throw new Error('Failed to delete pincode');
      }
    } catch (error) {
      console.error('Failed to delete pincode:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    createPincode,
    updatePincode,
    deletePincode,
  };
}; 