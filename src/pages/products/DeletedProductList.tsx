import React, { useEffect, useState } from "react";
import { Search, Eye, Trash2, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useDeletedProducts, useProduct } from "../../hooks/useProduct";
import Pagination from "../../components/common/Pagination";
import { helpers } from "../../utils/helper";
import { useCategory } from "../../hooks/useProductCategory";

// Filters type
interface Filters {
  page: number;
  limit: number;
  search: string;
  categoryId: string;
  listingType: string;
  status: string;
  referralCodeId: string;
  date: string;
}

const DeletedProductsPage: React.FC = () => {
  const statuses = [
    { label: "Pending Review", value: "pending" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
    { label: "Query Raised", value: "query_raised" },
    { label: "Available", value: "available" },
    { label: "Not Available", value: "not_available" },
    { label: "Deleted", value: "deleted" },
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
      case "deleted":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
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
    categoryId: "",
    listingType: "",
    status: "",
    referralCodeId: "",
    date: "",
  });

  const { deletedProductList, totalDeletedProducts, currentDeletedPage, getDeletedProductList } = useDeletedProducts();
  const { getAllCategories, allCategories } = useCategory();
  const { getAllReferralCodes, referralCodes } = useProduct();

  // Get category list and referral  codes for filter
  useEffect(() => {
    getAllCategories();
    getAllReferralCodes();
  }, []);

  // Load deleted products when filters change
  useEffect(() => {
    getDeletedProductList(filters);
  }, [filters]);

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
    scrollToTop();
  };

  console.log('sdfsdfsd',deletedProductList);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Deleted Products
        </h1>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search deleted products"
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value, page: 1 })
              }
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="relative">
            <select
              value={filters.categoryId}
              onChange={(e) =>
                setFilters({ ...filters, categoryId: e.target.value, page: 1 })
              }
              className="appearance-none px-4 py-2.5 pr-8 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Categories</option>
              {allCategories.map((category: any) => (
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
                setFilters({ ...filters, listingType: e.target.value, page: 1 })
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
                setFilters({ ...filters, status: e.target.value, page: 1 })
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

          <div className="relative">
            <select
              value={filters.referralCodeId}
              onChange={(e) =>
                setFilters({ ...filters, referralCodeId: e.target.value, page: 1 })
              }
              className="appearance-none px-4 py-2.5 pr-8 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Referral Codes</option>
              {referralCodes.map((code: any) => (
                <option key={code.id} value={code.id}>
                  {code.code}
                </option>
              ))}
            </select>
            <ChevronDown className="h-4 w-4 text-gray-400 absolute right-2 top-3.5 pointer-events-none" />
          </div>

          
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Listing Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Deleted Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {deletedProductList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No deleted products found
                  </td>
                </tr>
              ) : (
                deletedProductList.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                         <td className="px-6 py-4 whitespace-nowrap">
                       <div className="flex items-center">
                         <div className="flex-shrink-0 h-10 w-10">
                           <img
                             className="h-10 w-10 rounded-lg object-cover"
                             src={product.productImage?.frontLook || "https://via.placeholder.com/40"}
                             alt={product.productName}
                           />
                         </div>
                         <div className="ml-4">
                           <div className="text-sm font-medium text-gray-900 dark:text-white">
                             {product.productName}
                           </div>                          
                         </div>
                       </div>
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                       {product.category?.name || "N/A"}
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap">
                       <div className="flex flex-wrap gap-1">
                         {product.listingType && product.listingType.length > 0 ? (
                           product.listingType.map((type: string, typeIndex: number) => (
                             <span
                               key={typeIndex}
                               className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(type)}`}
                             >
                               {type}
                             </span>
                           ))
                         ) : (
                           <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                             N/A
                           </span>
                         )}
                       </div>
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap">
                       <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(product.status)}`}>
                         {product.status?.replace(/_/g, ' ') || "N/A"}
                       </span>
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap">
                       <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                         Deleted
                       </span>
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                       ₹{product.originalPurchasePrice?.toLocaleString() || "N/A"}
                     </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {helpers.formatDate(product.deletedAt || product.updatedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          to={`/dashboard/products/${product.id}/view`}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        {/* <span className="text-red-600 dark:text-red-400">
                          <Trash2 className="h-4 w-4" />
                        </span> */}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalDeletedProducts > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <Pagination
              currentPage={currentDeletedPage}
              totalItems={totalDeletedProducts}
              itemsPerPage={filters.limit}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DeletedProductsPage; 