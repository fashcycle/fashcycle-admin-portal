import React, { useEffect, useState } from "react";
import { Search, Eye, Edit, ChevronDown, Bell, AlertTriangle, Phone, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useProduct, useProductMutations } from "../../hooks/useProduct";
import Pagination from "../../components/common/Pagination";
import { helpers } from "../../utils/helper";
import { useCategory } from "../../hooks/useProductCategory";
import globalRequest from "../../services/globalRequest";

// Filters type
interface Filters {
  page: number;
  limit: number;
  search: string;
  category: string;
  listingType: string;
  status: string;
  date: string;
}

const ProductList: React.FC = () => {
  const statuses = [
    { label: "Pending Review", value: "pending" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
    { label: "Query Raised", value: "query_raised" },
    { label: "Available", value: "available" },
    { label: "Not Available", value: "not_available" },
    { label: "Deleted", value: "deleted" },
  ];

  const categories = [
    { label: "Gown", value: "gown" },
    { label: "Sahara Set", value: "sharara-set" },
    { label: "Ethnic", value: "Ethnic" },
    { label: "Saree", value: "Saree" },
    { label: "Lehenga", value: "lehenga" },
    { label: "Anarkali", value: "anarkali" },
    { label: "Rajasthan Poshak", value: "rajasthan_poshak" },
    { label: "Other", value: "other" },
  ];

  const types = [
    { label: "Rent", value: "rent" },
    { label: "Sell", value: "sell" },
    { label: "Both", value: "both" },
  ];

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "query_raised":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "pending":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      case "active":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case "rent":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "sell":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "both":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const [filters, setFilters] = useState<Filters>({
    page: 1,
    limit: 10,
    search: "",
    category: "",
    listingType: "",
    status: "",
    date: "",
  });

  // Add state for the call popup
  const [callPopup, setCallPopup] = useState({
    isOpen: false,
    productId: null as string | null,
    selectedOption: '',
  });

  // Add state for the status management popup
  const [statusPopup, setStatusPopup] = useState({
    isOpen: false,
    productId: null as string | null,
    selectedStatus: '',
    note: '',
    loading: false,
  });

  // Add state for availability toggle
  const [availabilityLoading, setAvailabilityLoading] = useState<string | null>(null);



  const { productList, getProductList, totalProducts } = useProduct();
  const { updateProductStatus } = useProductMutations();
  const { getAllCategories, allCategories } = useCategory();

  //get category list for filter
  useEffect(() => {
    getAllCategories();
  }, []);

  // console.log("allCategories", allCategories);

  useEffect(() => {
    getProductList(filters);
  }, [filters]);

  // Handlers for the call popup
  const handleCallClick = (productId: string) => {
    setCallPopup({
      isOpen: true,
      productId,
      selectedOption: '',
    });
  };

  const handleClosePopup = () => {
    setCallPopup({
      isOpen: false,
      productId: null,
      selectedOption: '',
    });
  };

  const handleOptionChange = (option: string) => {
    setCallPopup(prev => ({
      ...prev,
      selectedOption: option,
    }));
  };

  const handleSubmit = () => {
    if (callPopup.selectedOption && callPopup.productId) {
      // Handle the submission logic here
      console.log('Product ID:', callPopup.productId);
      console.log('Selected Option:', callPopup.selectedOption);
      
      // Add your API call or other logic here
      
      // Close the popup after submission
      handleClosePopup();
    }
  };

  // Handlers for the status management popup
  const handleStatusClick = (productId: string) => {
    setStatusPopup({
      isOpen: true,
      productId,
      selectedStatus: '',
      note: '',
      loading: false,
    });
  };

  const handleCloseStatusPopup = () => {
    setStatusPopup({
      isOpen: false,
      productId: null,
      selectedStatus: '',
      note: '',
      loading: false,
    });
  };

  const handleStatusChange = (status: string) => {
    setStatusPopup(prev => ({
      ...prev,
      selectedStatus: status,
    }));
  };

  const handleNoteChange = (note: string) => {
    setStatusPopup(prev => ({
      ...prev,
      note,
    }));
  };

  const handleStatusSubmit = async () => {
    if (statusPopup.selectedStatus && statusPopup.productId) {
      setStatusPopup(prev => ({ ...prev, loading: true }));
      
      try {
        await updateProductStatus(statusPopup.productId, statusPopup.selectedStatus, statusPopup.note);
        
        // Refresh the product list
        getProductList(filters);
        
        // Close the popup
        handleCloseStatusPopup();
      } catch (error) {
        console.error('Failed to update product status:', error);
      } finally {
        setStatusPopup(prev => ({ ...prev, loading: false }));
      }
    }
  };

  // Handler for availability toggle
  const handleAvailabilityToggle = async (productId: string, currentStatus: boolean) => {
    setAvailabilityLoading(productId);
    
    try {
      const response = await globalRequest(
        `/admin/products/${productId}/status`,
        'put',
        {
          isAvailability: !currentStatus
        }
      );
      
      if (response.success) {
        // Refresh the product list to show updated status
        getProductList(filters);
      }
    } catch (error) {
      console.error('Failed to update availability:', error);
    } finally {
      setAvailabilityLoading(null);
    }
  };



  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Product Listing
        </h1>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search products"
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="relative">
            <select
              value={filters.category}
              onChange={(e) =>
                setFilters({ ...filters, category: e.target.value })
              }
              className="appearance-none px-4 py-2.5 pr-8 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Categories</option>
              {allCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <ChevronDown className="h-4 w-4 text-gray-400 absolute right-2 top-3.5 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={filters.listingType}
              onChange={(e) =>
                setFilters({ ...filters, listingType: e.target.value })
              }
              className="appearance-none px-4 py-2.5 pr-8 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Types</option>
              {types.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <ChevronDown className="h-4 w-4 text-gray-400 absolute right-2 top-3.5 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              className="appearance-none px-4 py-2.5 pr-8 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Status</option>
              {statuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            <ChevronDown className="h-4 w-4 text-gray-400 absolute right-2 top-3.5 pointer-events-none" />
          </div>

          {/* <div className="relative">
            <input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div> */}
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                {[
                  "Product",
                  "Category",
                  "Type",
                  "Price",
                  "Status",
                  "Availability",
                  "Deleted",
                  "Seller",
                  "Listed Date & Time",
                  "3 Stage Alert",
                  "Actions",
                ].map((title) => (
                  <th
                    key={title}
                    className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400"
                  >
                    {title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {productList?.map((product: any, index: number) => {
                // Debug: Log the first product to see its structure
                if (index === 0) {
                  console.log('Product structure:', product);
                }
                return (
                <tr
                  key={index}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.productImage.frontLook}
                        alt={product.productName}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                      <span className="font-medium text-gray-900 dark:text-white">
                        {product.productName}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">
                    {product.category.name}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {product.listingType && product.listingType.length > 0 ? (
                        product.listingType.map((type: string, typeIndex: number) => (
                          <span
                            key={typeIndex}
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(type)}`}
                          >
                            {type}
                          </span>
                        ))
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                          N/A
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    ₹{product.originalPurchasePrice.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    {product.status.toLowerCase() === 'pending' ? (
                      <button
                        onClick={() => handleStatusClick(product.id)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity ${getStatusColor(
                          product.status
                        )}`}
                        title="Click to manage status"
                      >
                        {product.status}
                      </button>
                    ) : (
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          product.status
                        )}`}
                      >
                        {product.status}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <button
                        onClick={() => handleAvailabilityToggle(product.id, product.isAvailability)}
                        disabled={availabilityLoading === product.id}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          product.isAvailability 
                            ? 'bg-blue-600' 
                            : 'bg-gray-200 dark:bg-gray-700'
                        } ${availabilityLoading === product.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            product.isAvailability ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>                      
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        (product.isDeleted || false)
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                          : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      }`}
                    >
                      {(product.isDeleted || false) ? 'Deleted' : 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">
                    {product.owner.name}
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">
                    {helpers.formatDateFunction(
                      product.approvedAt,
                      "dd/mm/yyyy",
                      true
                    )}
                  </td>
                  {/* create 3 icons for 3 stage alert  1st will be notification icon with red color, 2nd will be alert icon with red color and last wil be call button  */}
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                        title="Send Notification"
                      >
                        <Bell className="h-4 w-4" />
                      </button>
                      <button
                        className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                        title="Send Alert"
                      >
                        <AlertTriangle className="h-4 w-4" />
                      </button>
                      <button
                        className="p-2 text-gray-600 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 transition-colors"
                        title="Call"
                        onClick={() => handleCallClick(product.id)}
                      >
                        <Phone className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <Link
                        to={`/dashboard/products/${product.id}/view`}
                        className="p-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        to={`/dashboard/products/${product.id}/edit`}
                        className="p-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
          {totalProducts > 1 && (
            <Pagination
              itemsPerPage={filters.limit}
              totalItems={totalProducts}
              currentPage={filters.page}
              onPageChange={(page: number) => {
                scrollToTop();
                setFilters({ ...filters, page });
              }}
            />
          )}
        </div>
      </div>

      {/* Call Popup Modal */}
      {callPopup.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Call Confirmation
              </h3>
              <button
                onClick={handleClosePopup}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Do you want to proceed with the call?
              </p>
              
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="callOption"
                    value="yes"
                    checked={callPopup.selectedOption === 'yes'}
                    onChange={(e) => handleOptionChange(e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
                  />
                  <span className="ml-2 text-gray-900 dark:text-white">Yes</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="callOption"
                    value="no"
                    checked={callPopup.selectedOption === 'no'}
                    onChange={(e) => handleOptionChange(e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
                  />
                  <span className="ml-2 text-gray-900 dark:text-white">No</span>
                </label>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleClosePopup}
                className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!callPopup.selectedOption}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Management Popup Modal */}
      {statusPopup.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Manage Product Status
              </h3>
              <button
                onClick={handleCloseStatusPopup}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Select the new status for this product:
              </p>
              
              <div className="space-y-3 mb-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="statusOption"
                    value="approved"
                    checked={statusPopup.selectedStatus === 'approved'}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
                  />
                  <span className="ml-2 text-gray-900 dark:text-white">Approved</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="statusOption"
                    value="rejected"
                    checked={statusPopup.selectedStatus === 'rejected'}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
                  />
                  <span className="ml-2 text-gray-900 dark:text-white">Rejected</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="statusOption"
                    value="query_raised"
                    checked={statusPopup.selectedStatus === 'query_raised'}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
                  />
                  <span className="ml-2 text-gray-900 dark:text-white">Raise Query</span>
                </label>
              </div>

              {(statusPopup.selectedStatus === 'rejected' || statusPopup.selectedStatus === 'query_raised') && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Note <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={statusPopup.note}
                    onChange={(e) => handleNoteChange(e.target.value)}
                    placeholder="Please provide a reason for rejection or query..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                    rows={3}
                    required
                  />
                </div>
              )}
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleCloseStatusPopup}
                className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusSubmit}
                disabled={!statusPopup.selectedStatus || (statusPopup.selectedStatus !== 'approved' && !statusPopup.note.trim()) || statusPopup.loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {statusPopup.loading ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
