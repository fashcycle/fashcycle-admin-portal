import React, { useEffect, useState } from "react";
import { Search, Eye, Edit, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useProduct } from "../../hooks/useProduct";
import Pagination from "../../components/common/Pagination";
import { helpers } from "../../utils/helper";



// Filters type
interface Filters {
  page: number;
  limit: number;
  search: string;
  category: string;
  type: string;
  status: string;
}

const ProductList: React.FC = () => {
  const statuses = [
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "approved" },
    { label: "Query Raised", value: "query_raised" },
  ];

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "pending":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      case "query raised":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "rent":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "sell":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const [filters, setFilters] = useState<Filters>({
    page: 1,
    limit: 10,
    search: "",
    category: "",
    type: "",
    status: "",
  });

  const { productList, getProductList, totalProducts } = useProduct();

  useEffect(() => {
    getProductList(filters);
  }, [filters]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Product Tracking
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
                  "Seller",
                  "Listed Date",
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
              {productList?.map((product: any, index: number) => (
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
                    {product.category}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(
                        product.listingType[0]
                      )}`}
                    >
                      {product.listingType[0]}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    ₹{product.originalPurchasePrice.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        product.status
                      )}`}
                    >
                      {product.status}
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
              ))}
            </tbody>
          </table>

          <Pagination
            itemsPerPage={filters.limit}
            totalItems={totalProducts}
            currentPage={filters.page}
            onPageChange={(page: number) => {
              scrollToTop();
              setFilters({ ...filters, page });
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductList;

