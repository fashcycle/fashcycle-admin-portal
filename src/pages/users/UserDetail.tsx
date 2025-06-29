import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  MessageSquare,
  UserX,
  MoreHorizontal,
  Plus,
  Trash2,
  Search,
  Eye,
} from "lucide-react";
import { useUser } from "../../hooks/useUser";
import { helpers } from "../../utils/helper";
import EditUserPopup from "../../components/common/EditUserPopup";
import ConfirmationPopup from "../../components/common/ConfirmationPopup";
import AddressPopup from "../../components/common/AddressPopup";
import Pagination from "../../components/common/Pagination";

const UserDetail: React.FC = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);
  const [showStatusConfirm, setShowStatusConfirm] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  
  // Address management states
  const [showAddressPopup, setShowAddressPopup] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [addressLoading, setAddressLoading] = useState(false);
  const [showDeleteAddressConfirm, setShowDeleteAddressConfirm] = useState(false);
  const [deletingAddressId, setDeletingAddressId] = useState<string | null>(null);

  // Product management states
  const [productSearch, setProductSearch] = useState('');
  const [productStatusFilter, setProductStatusFilter] = useState('');
  const [productPage, setProductPage] = useState(1);
  const [productLimit] = useState(10);

  const { 
    userDetail, 
    getUserDetail, 
    updateUser, 
    updateUserStatus, 
    addUserAddress, 
    updateUserAddress, 
    deleteUserAddress,
    userProducts,
    totalProducts,
    currentProductPage,
    getUserProducts
  } = useUser();

  useEffect(() => {
    if (id) {
      const fetchUserDetail = async () => {
        setDataLoading(true);
        try {
          await getUserDetail(id);
        } catch (error) {
          console.error('Error fetching user details:', error);
          setError('Failed to load user details');
        } finally {
          setDataLoading(false);
        }
      };
      
      fetchUserDetail();
    }
  }, [id]);

  // Load products when component mounts or tab changes
  useEffect(() => {
    if (id && activeTab === "products") {
      loadUserProducts();
    }
  }, [id, activeTab, productPage, productSearch, productStatusFilter]);

  const loadUserProducts = async () => {
    if (!id) return;
    
    try {
      await getUserProducts(id, {
        page: productPage,
        limit: productLimit,
        search: productSearch,
        status: productStatusFilter,
      });
    } catch (error) {
      console.error('Error loading user products:', error);
    }
  };

  const handleProductSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setProductPage(1);
    loadUserProducts();
  };

  const handleProductPageChange = (page: number) => {
    setProductPage(page);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      case "suspended":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getProductStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400";
      case "user":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "vendor":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const handleEditUser = async (userData: { name: string; email: string; phone: string }) => {
    if (!id) return;
    
    setEditLoading(true);
    try {
      await updateUser(id, userData);
      setShowEditPopup(false);
      setEditSuccess(true);
      setTimeout(() => setEditSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating user:', error);
      // You can add error handling here if needed
    } finally {
      setEditLoading(false);
    }
  };

  const handleStatusToggle = () => {
    setShowStatusConfirm(true);
  };

  const handleConfirmStatusChange = async () => {
    if (!id || !userDetail) return;
    
    setStatusLoading(true);
    try {
      const newStatus = userDetail.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      await updateUserStatus(id, newStatus);
      setShowStatusConfirm(false);
    } catch (error) {
      console.error('Error updating user status:', error);
    } finally {
      setStatusLoading(false);
    }
  };

  const handleCloseStatusConfirm = () => {
    setShowStatusConfirm(false);
  };

  const getStatusActionText = () => {
    if (!userDetail) return '';
    return userDetail.status === 'ACTIVE' ? 'Suspend Account' : 'Activate Account';
  };

  const getStatusConfirmMessage = () => {
    if (!userDetail) return '';
    const action = userDetail.status === 'ACTIVE' ? 'suspend' : 'activate';
    return `Are you sure you want to ${action} the account for "${userDetail.name}"?`;
  };

  // Address management functions
  const handleAddAddress = () => {
    setEditingAddress(null);
    setShowAddressPopup(true);
  };

  const handleEditAddress = (address: any) => {
    setEditingAddress(address);
    setShowAddressPopup(true);
  };

  const handleDeleteAddress = (addressId: string) => {
    setDeletingAddressId(addressId);
    setShowDeleteAddressConfirm(true);
  };

  const handleSaveAddress = async (addressData: any) => {
    if (!id) return;
    
    setAddressLoading(true);
    try {
      if (editingAddress) {
        await updateUserAddress(editingAddress.id, addressData);
      } else {
        await addUserAddress(id, addressData);
      }
      setShowAddressPopup(false);
      setEditSuccess(true);
      setTimeout(() => setEditSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving address:', error);
      throw error;
    } finally {
      setAddressLoading(false);
    }
  };

  const handleConfirmDeleteAddress = async () => {
    if (!deletingAddressId) return;
    
    setAddressLoading(true);
    try {
      await deleteUserAddress(deletingAddressId);
      setShowDeleteAddressConfirm(false);
      setDeletingAddressId(null);
      setEditSuccess(true);
      setTimeout(() => setEditSuccess(false), 3000);
    } catch (error) {
      console.error('Error deleting address:', error);
    } finally {
      setAddressLoading(false);
    }
  };

  const handleCloseDeleteAddressConfirm = () => {
    setShowDeleteAddressConfirm(false);
    setDeletingAddressId(null);
  };

  if (dataLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link
            to="/dashboard/users"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Users
          </Link>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
          {error}
        </div>
      </div>
    );
  }

  if (!userDetail) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link
            to="/dashboard/users"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Users
          </Link>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-400">
          User not found
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/dashboard/users"
            className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Users</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            User Profile
          </h1>
        </div>
        <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      {/* Success Message */}
      {editSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">
          User updated successfully!
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Information */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 h-full">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Profile Information
                </h2>
              </div>
              <button
                onClick={() => setShowEditPopup(true)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                title="Edit User"
              >
                <Edit className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-start space-x-4 mb-6">
              <div className="h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center">
                {userDetail.image ? (
                  <img
                    src={userDetail.image}
                    alt={userDetail.name}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-8 w-8 text-white" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {userDetail.name}
                  </h3>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      userDetail.status
                    )}`}
                  >
                    {userDetail.status}
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(
                      userDetail.role
                    )}`}
                  >
                    {userDetail.role}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <Mail className="h-4 w-4" />
                    <span>{userDetail.email}</span>
                  </div>
                  {userDetail.phone && (
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                      <Phone className="h-4 w-4" />
                      <span>{userDetail.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {helpers?.formatDateFunction(userDetail.createdAt, "dd/mm/yyyy", true)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Quick Stats and Actions */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 h-full">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Stats
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Products Listed
                </span>
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {userDetail.totalProducts || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Orders Placed
                </span>
                <span className="font-bold text-green-600 dark:text-green-400">
                  {userDetail.totalOrders || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Addresses
                </span>
                <span className="font-bold text-purple-600 dark:text-purple-400">
                  {userDetail.addresses?.length || 0}
                </span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {/* <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Send Message
              </button> */}
              <button
                onClick={handleStatusToggle}
                disabled={statusLoading}
                className={`w-full px-4 py-2 border rounded-lg transition-colors ${
                  userDetail?.status === 'ACTIVE'
                    ? 'border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                    : 'border-green-300 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {statusLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mx-auto"></div>
                    Updating...
                  </>
                ) : (
                  getStatusActionText()
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Address Information */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Address Information
            </h3>
          </div>
          <button
            onClick={handleAddAddress}
            className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Address
          </button>
        </div>
        
        {userDetail.addresses && userDetail.addresses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userDetail.addresses.map((address, index) => (
              <div key={address.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Address {index + 1}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                      {address.addressType}
                    </span>
                    <button
                      onClick={() => handleEditAddress(address)}
                      className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      title="Edit Address"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(address.id)}
                      className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      title="Delete Address"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <p>{address.addressLine1}</p>
                  {address.addressLine2 && <p>{address.addressLine2}</p>}
                  {address.landmark && <p>Landmark: {address.landmark}</p>}
                  <p>
                    {address.pincode.city}, {address.pincode.state} - {address.pincode.pincode}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">No addresses found</p>
            <button
              onClick={handleAddAddress}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add First Address
            </button>
          </div>
        )}
      </div>

      {/* Products Listed / Order History Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab("products")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "products"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Products Listed ({userDetail.totalProducts || 0})
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "orders"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Order History ({userDetail.totalOrders || 0})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "products" && (
            <div className="space-y-6">
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4">
                <form onSubmit={handleProductSearch} className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      placeholder="Search products..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </form>
                <select
                  value={productStatusFilter}
                  onChange={(e) => setProductStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              {/* Products Table */}
              {userProducts.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Details
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {userProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-12 w-12">
                                <img
                                  className="h-12 w-12 rounded-lg object-cover"
                                  src={product.productImage?.frontLook || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAyOEMyNi4yMDkxIDI4IDI4IDI2LjIwOTEgMjggMjRDMjggMjEuNzkwOSAyNi4yMDkxIDIwIDI0IDIwQzIxLjc5MDkgMjAgMjAgMjEuNzkwOSAyMCAyNEMyMCAyNi4yMDkxIDIxLjc5MDkgMjggMjQgMjhaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0yNCAzMkMyNi4yMDkxIDMyIDI4IDMwLjIwOTEgMjggMjhDMjggMjUuNzkwOSAyNi4yMDkxIDI0IDI0IDI0QzIxLjc5MDkgMjQgMjAgMjUuNzkwOSAyMCAyOEMyMCAzMC4yMDkxIDIxLjc5MDkgMzIgMjQgMzJaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0yNCAzNkMyNi4yMDkxIDM2IDI4IDM0LjIwOTEgMjggMzJDMjggMjkuNzkwOSAyNi4yMDkxIDI4IDI0IDI4QzIxLjc5MDkgMjggMjAgMjkuNzkwOSAyMCAzMkMyMCAzNC4yMDkxIDIxLjc5MDkgMzYgMjQgMzZaIiBmaWxsPSIjOUI5QkEwIi8+Cjwvc3ZnPgo='}
                                  alt={product.productName}
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAyOEMyNi4yMDkxIDI4IDI4IDI2LjIwOTEgMjggMjRDMjggMjEuNzkwOSAyNi4yMDkxIDIwIDI0IDIwQzIxLjc5MDkgMjAgMjAgMjEuNzkwOSAyMCAyNEMyMCAyNi4yMDkxIDIxLjc5MDkgMjggMjQgMjhaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0yNCAzMkMyNi4yMDkxIDMyIDI4IDMwLjIwOTEgMjggMjhDMjggMjUuNzkwOSAyNi4yMDkxIDI0IDI0IDI0QzIxLjc5MDkgMjQgMjAgMjUuNzkwOSAyMCAyOEMyMCAzMC4yMDkxIDIxLjc5MDkgMzIgMjQgMzJaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0yNCAzNkMyNi4yMDkxIDM2IDI4IDM0LjIwOTEgMjggMzJDMjggMjkuNzkwOSAyNi4yMDkxIDI4IDI0IDI4QzIxLjc5MDkgMjggMjAgMjkuNzkwOSAyMCAzMkMyMCAzNC4yMDkxIDIxLjc5MDkgMzYgMjQgMzZaIiBmaWxsPSIjOUI5QkEwIi8+Cjwvc3ZnPgo=';
                                  }}
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {product.productName}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {product.mobileNumber}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-white">
                              <div>Size: {product.size}</div>
                              <div>Color: {product.color}</div>
                              <div>Flexibility: {product.sizeFlexibility}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-white">
                              {product.category?.name || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-white">
                              ₹{product.originalPurchasePrice?.toLocaleString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getProductStatusColor(product.status)}`}>
                              {product.status}
                            </span>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {product.isAvailability ? 'Available' : 'Not Available'}
                            </div>
                            {product.isRented && (
                              <div className="text-xs text-orange-600 dark:text-orange-400">
                                Currently Rented
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                              title="Edit Product"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    No products found
                  </p>
                </div>
              )}

              {/* Pagination */}
              {totalProducts > productLimit && (
                <div className="mt-6">
                  <Pagination
                    currentPage={currentProductPage}
                    totalItems={totalProducts}
                    itemsPerPage={productLimit}
                    onPageChange={handleProductPageChange}
                  />
                </div>
              )}
            </div>
          )}
          {activeTab === "orders" && (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                {(userDetail.totalOrders || 0) > 0 
                  ? "Orders will be loaded here" 
                  : "No orders found"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Status Confirmation Popup */}
      <ConfirmationPopup
        isOpen={showStatusConfirm}
        onClose={handleCloseStatusConfirm}
        onConfirm={handleConfirmStatusChange}
        title={userDetail?.status === 'ACTIVE' ? 'Suspend Account' : 'Activate Account'}
        message={getStatusConfirmMessage()}
        confirmText={userDetail?.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
        type="warning"
      />

      {/* Delete Address Confirmation Popup */}
      <ConfirmationPopup
        isOpen={showDeleteAddressConfirm}
        onClose={handleCloseDeleteAddressConfirm}
        onConfirm={handleConfirmDeleteAddress}
        title="Delete Address"
        message="Are you sure you want to delete this address? This action cannot be undone."
        confirmText="Delete"
        type="danger"
      />

      {/* Edit User Popup */}
      <EditUserPopup
        isOpen={showEditPopup}
        onClose={() => setShowEditPopup(false)}
        onSave={handleEditUser}
        user={userDetail}
        loading={editLoading}
      />

      {/* Address Popup */}
      <AddressPopup
        isOpen={showAddressPopup}
        onClose={() => setShowAddressPopup(false)}
        onSave={handleSaveAddress}
        address={editingAddress}
        loading={addressLoading}
      />
    </div>
  );
};

export default UserDetail;
