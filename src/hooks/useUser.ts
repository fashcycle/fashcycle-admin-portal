import { useState } from 'react';
import globalRequest from '../services/globalRequest';
import { useAppState } from '../contexts/AppStateContext';
import apiRoutes from '../utils/apiRoutes';

interface Pincode {
  pincode: string;
  city: string;
  state: string;
}

interface Address {
  id: string;
  addressLine1: string;
  addressLine2: string | null;
  landmark: string | null;
  addressType: string;
  pincode: Pincode;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  image: string | null;
  role: string;
  createdAt: string;
  status: string;
  addresses: Address[];
  products: any[];
  orders: any[];
  totalProducts?: number;
  totalOrders?: number;
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
  totalOrders: number;
  totalProducts: number;
  stats: {
    productsListed: number;
    ordersPlaced: number;
    referralCode: string;
    totalReferrals: number;
  };
}

interface UserDetailResponse {
  success: boolean;
  user: User;
}

interface GetUserListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

interface AddressData {
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  addressType: string;
  pincode: string;
  city: string;
  state: string;
}

interface ProductImage {
  id: string;
  frontLook: string | null;
  backLook: string | null;
  sideLook: string | null;
  closeUpLook: string | null;
  optional1: string | null;
  optional2: string | null;
  productId: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  status: string;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Product {
  id: string;
  productName: string;
  mobileNumber: string;
  categoryId: string;
  originalPurchasePrice: number;
  size: string;
  sizeFlexibility: string;
  color: string;
  productVideo: string | null;
  accessoriesImage: string | null;
  proofOfPurchase: string | null;
  listingType: string[];
  addressId: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  adminNote: string | null;
  queryNote: string | null;
  approvedAt: string | null;
  queryRaisedAt: string | null;
  rejectedAt: string | null;
  description: string;
  isAvailability: boolean;
  isRented: boolean;
  updatedById: string | null;
  isDeleted: boolean;
  rentPrice3Days: number | null;
  rentPrice7Days: number | null;
  rentPrice14Days: number | null;
  category: Category;
  productImage: ProductImage;
}

interface ProductListResponse {
  products: Product[];
  totalItems: number;
  page: number;
  limit: number;
}

interface GetUserProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
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

interface GetUserOrdersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export const useUser = () => {
  const [userList, setUserList] = useState<User[]>([]);
  const [userDetail, setUserDetail] = useState<User | null>(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  
  // User orders state
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [currentOrderPage, setCurrentOrderPage] = useState(1);
  
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
            status: params.status || null,
          }
        }
      );
      setUserList(response.users || []);
      setTotalUsers(response.totalUsers || 0);
      setCurrentPage(response.currentPage || 1);
      return response;
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
      
      if (response.success && response.user) {
        setUserDetail(response.user);
        return response.user;
      } else {
        throw new Error('Failed to fetch user details');
      }
    } catch (error) {
      console.error('Failed to fetch user details:', error);
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
        'put',
        { status }
      );
      
      // Refresh user details after status update
      if (response.success) {
        await getUserDetail(userId);
      }
      
      return response;
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
        { status: 'SUSPENDED' }
      );
      return response;
    } catch (error) {
      console.error('Failed to suspend user:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userId: string, userData: { name: string; email: string; phone: string }) => {
    try {
      setLoading(true);
      const response = await globalRequest(
        apiRoutes.userUpdate(userId),
        'put',
        userData
      );
      
      // Refresh user details after update
      if (response.success) {
        await getUserDetail(userId);
      }
      
      return response;
    } catch (error) {
      console.error('Failed to update user:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Address management functions
  const addUserAddress = async (userId: string, addressData: AddressData) => {
    try {
      setLoading(true);
      const response = await globalRequest(
        apiRoutes.userAddressAdd(userId),
        'post',
        addressData
      );
      
      // Refresh user details after adding address
      if (response.success) {
        await getUserDetail(userId);
      }
      
      return response;
    } catch (error) {
      console.error('Failed to add address:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUserAddress = async (addressId: string, addressData: AddressData) => {
    try {
      setLoading(true);
      const response = await globalRequest(
        apiRoutes.addressUpdate(addressId),
        'put',
        addressData
      );
      
      // Refresh user details after updating address
      if (response.success && userDetail) {
        await getUserDetail(userDetail.id);
      }
      
      return response;
    } catch (error) {
      console.error('Failed to update address:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteUserAddress = async (addressId: string) => {
    try {
      setLoading(true);
      const response = await globalRequest(
        apiRoutes.addressDelete(addressId),
        'delete'
      );
      
      // Refresh user details after deleting address
      if (response.success && userDetail) {
        await getUserDetail(userDetail.id);
      }
      
      return response;
    } catch (error) {
      console.error('Failed to delete address:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Product management functions
  const [userProducts, setUserProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentProductPage, setCurrentProductPage] = useState(1);

  const getUserProducts = async (userId: string, params: GetUserProductsParams = {}) => {
    try {
      setLoading(true);
      const response = await globalRequest(
        apiRoutes.userProducts(userId),
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
      
      const data: ProductListResponse = response;
      setUserProducts(data.products || []);
      setTotalProducts(data.totalItems || 0);
      setCurrentProductPage(data.page || 1);
      return data;
    } catch (error) {
      console.error('Failed to fetch user products:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getUserOrders = async (userId: string, params: GetUserOrdersParams = {}) => {
    try {
      setLoading(true);
      const response = await globalRequest(
        apiRoutes.userOrders(userId),
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
      
      const data: OrderListResponse = response;
      setUserOrders(data.orders || []);
      setTotalOrders(data.total || 0);
      setCurrentOrderPage(data.currentPage || 1);
      return data;
    } catch (error) {
      console.error('Failed to fetch user orders:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    userList,
    userDetail,
    totalUsers,
    currentPage,
    getUserList,
    getUserDetail,
    updateUserStatus,
    suspendUser,
    updateUser,
    addUserAddress,
    updateUserAddress,
    deleteUserAddress,
    userProducts,
    totalProducts,
    currentProductPage,
    getUserProducts,
    userOrders,
    totalOrders,
    currentOrderPage,
    getUserOrders,
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
    sendMessage
  };
}; 