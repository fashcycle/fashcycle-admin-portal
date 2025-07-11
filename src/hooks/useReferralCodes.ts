import { useState } from 'react';
import globalRequest from '../services/globalRequest';
import { useAppState } from '../contexts/AppStateContext';
import apiRoutes from '../utils/apiRoutes';

interface ReferralCode {
  id: string;
  code: string;
  referrerName: string;
  contactNo: string;
  email: string;
  upiId: string;
  status: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ReferralCodeListResponse {
  referralCodes: ReferralCode[];
  total: number;
  currentPage: number;
  limit: number;
}

interface GetReferralCodesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

interface CreateReferralCodeParams {
  code: string;
  referrerName: string;
  contactNo: string;
  email: string;
  upiId: string;
}

interface UpdateReferralCodeParams {
  code: string;
  referrerName: string;
  contactNo: string;
  email: string;
  upiId: string;
}

export const useReferralCodes = () => {
  const [referralCodeList, setReferralCodeList] = useState<ReferralCode[]>([]);
  const [referralCodeDetail, setReferralCodeDetail] = useState<ReferralCode | null>(null);
  const [totalReferralCodes, setTotalReferralCodes] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const { setLoading } = useAppState();

  const getReferralCodeList = async (params: GetReferralCodesParams = {}) => {
    try {
      setLoading(true);
      const response = await globalRequest(
        apiRoutes.referralCodeList,
        'get',
        {},
        {
          params: {
            page: params.page || 1,
            limit: params.limit || 10,
            search: params.search || '',
            status: params.status || '',
          }
        }
      );
      
      const data = response;
      setReferralCodeList(data.data || []);
      setTotalReferralCodes(data.pagination.total || 0);
      setCurrentPage(data.pagination.page || 1);
      return data;
    } catch (error) {
      console.error('Failed to fetch referral codes:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getReferralCodeDetail = async (referralCodeId: string) => {
    if (!referralCodeId) return null;

    try {
      setLoading(true);
      const response = await globalRequest(
        apiRoutes.referralCodeDetail(referralCodeId),
        'get'
      );
      
      if (response.success && response.referralCode) {
        setReferralCodeDetail(response.referralCode);
        return response.referralCode;
      } else {
        throw new Error('Failed to fetch referral code details');
      }
    } catch (error) {
      console.error('Failed to fetch referral code details:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createReferralCode = async (params: CreateReferralCodeParams) => {
    try {
      setLoading(true);
      const response = await globalRequest(
        apiRoutes.referralCodeCreate,
        'post',
        params
      );
      
      if (response.success) {
        return response;
      } else {
        throw new Error('Failed to create referral code');
      }
    } catch (error) {
      console.error('Failed to create referral code:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateReferralCode = async (referralCodeId: string, params: UpdateReferralCodeParams) => {
    if (!referralCodeId) return null;

    try {
      setLoading(true);
      const response = await globalRequest(
        apiRoutes.referralCodeUpdate(referralCodeId),
        'put',
        params
      );
      
      if (response.success) {
        // Update the referral code detail if it's currently loaded
        if (referralCodeDetail && referralCodeDetail.id === referralCodeId) {
          setReferralCodeDetail({
            ...referralCodeDetail,
            ...params
          });
        }
        return response;
      } else {
        throw new Error('Failed to update referral code');
      }
    } catch (error) {
      console.error('Failed to update referral code:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteReferralCode = async (referralCodeId: string) => {
    if (!referralCodeId) return null;

    try {
      setLoading(true);
      const response = await globalRequest(
        apiRoutes.referralCodeDelete(referralCodeId),
        'delete'
      );
      
      if (response.success) {
        return response;
      } else {
        throw new Error('Failed to delete referral code');
      }
    } catch (error) {
      console.error('Failed to delete referral code:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    referralCodeList,
    referralCodeDetail,
    totalReferralCodes,
    currentPage,
    getReferralCodeList,
    getReferralCodeDetail,
    createReferralCode,
    updateReferralCode,
    deleteReferralCode,
  };
}; 