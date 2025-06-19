import { useState } from 'react';
import globalRequest from '../services/globalRequest';
import { useAppState } from '../contexts/AppStateContext';
import apiRoutes from '../utils/apiRoutes';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'suspended';
  type: 'customer' | 'vendor' | 'admin';
  bio: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

interface UserListResponse {
  users: User[];
  totalUsers: number;
  page: number;
  limit: number;
}

interface UserDetail {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  type: string;
  joinDate: string;
  bio: string;
  avatar?: string;
  stats: {
    productsListed: number;
    ordersPlaced: number;
    referralCode: string;
    totalReferrals: number;
  };
}

interface UserDetailResponse {
  user: UserDetail;
}

interface GetUserListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  type?: string;
}

export const useUser = () => {
  const [userList, setUserList] = useState<User[]>([]);
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const { setLoading } = useAppState();

  const getUserList = async (params: GetUserListParams = {}) => {
    try {
      setLoading(true);
      const response = await globalRequest(
        apiRoutes.userList,
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
      const data: UserListResponse = response;
      console.log("data", data);
      setUserList(data.users);
      setTotalUsers(data.totalUsers);
      setCurrentPage(data.page);
      return data;
    } catch (error) {
      console.error('Failed to fetch users:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getUserDetail = async (userId: string) => {
    if (!userId) return null;

    try {
      setLoading(true);
      const response = await globalRequest(
        apiRoutes.userDetail(userId),
        'get'
      );

      let user = response?.user;

      const userDetailData = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        status: user.status,
        type: user.type,
        joinDate: user.createdAt,
        bio: user.bio || '',
        avatar: user.avatar || '',
        stats: {
          productsListed: user.stats?.productsListed || 0,
          ordersPlaced: user.stats?.ordersPlaced || 0,
          referralCode: user.stats?.referralCode || '',
          totalReferrals: user.stats?.totalReferrals || 0
        }
      };

      const data: UserDetailResponse = { user: userDetailData };
      setUserDetail(userDetailData);
      return data.user;
    } catch (error) {
      console.error('Failed to fetch user details:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    // State
    userList,
    userDetail,
    totalUsers,
    currentPage,

    // Functions
    getUserList,
    getUserDetail
  };
};

export const useUserMutations = () => {
  const { setLoading } = useAppState();

  const createUser = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      const response = await globalRequest(
        apiRoutes.userCreate,
        'post',
        userData
      );
      return response.data;
    } catch (error) {
      console.error('Failed to create user:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userId: string, userData: Partial<User>) => {
    try {
      setLoading(true);
      const response = await globalRequest(
        apiRoutes.userUpdate(userId),
        'put',
        userData
      );
      return response.data;
    } catch (error) {
      console.error('Failed to update user:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      setLoading(true);
      await globalRequest(
        apiRoutes.userDelete(userId),
        'delete'
      );
    } catch (error) {
      console.error('Failed to delete user:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId: string, status: string) => {
    try {
      setLoading(true);
      const response = await globalRequest(
        apiRoutes.userUpdateStatus(userId),
        'patch',
        { status }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to update user status:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const suspendUser = async (userId: string) => {
    try {
      setLoading(true);
      const response = await globalRequest(
        apiRoutes.userSuspend(userId),
        'patch',
        { status: 'suspended' }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to suspend user:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (userId: string, message: string) => {
    try {
      setLoading(true);
      const response = await globalRequest(
        apiRoutes.userSendMessage(userId),
        'post',
        { message }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    createUser,
    updateUser,
    deleteUser,
    updateUserStatus,
    suspendUser,
    sendMessage
  };
}; 