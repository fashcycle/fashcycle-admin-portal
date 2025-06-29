import React, { useEffect, useState } from "react";
import { Search, Eye, Edit, ChevronDown, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useCategory } from "../../hooks/useCategory";
import Pagination from "../../components/common/Pagination";
import { helpers } from "../../utils/helper";
import ConfirmationPopup from "../../components/common/ConfirmationPopup";

// Filters type
interface Filters {
  page: number;
  limit: number;
  search: string;
  status: string;
}

const CategoryList: React.FC = () => {
  const statuses = [
    { label: "All Status", value: "" },
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
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
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      case "deleted":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const [filters, setFilters] = useState<Filters>({
    page: 1,
    limit: 10,
    search: "",
    status: "",
  });

  const [searchTerm, setSearchTerm] = useState("");

  // Confirmation popup state
  const [confirmationPopup, setConfirmationPopup] = useState({
    isOpen: false,
    action: '',
    categoryId: '',
    categoryName: '',
  });

  const { categoryList, getCategoryList, totalCategories, updateCategoryStatus, deleteCategory } = useCategory();

  useEffect(() => {
    getCategoryList(filters);
  }, [filters]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // If search term is more than 3 characters, update filters and reset to page 1
    if (value.length > 3) {
      setFilters({ ...filters, search: value, page: 1 });
    } else if (value.length === 0) {
      // If search is cleared, reset search filter and go to page 1
      setFilters({ ...filters, search: "", page: 1 });
    }
  };

  // Handle status toggle
  const handleStatusToggle = (categoryId: string, currentStatus: string, categoryName: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    setConfirmationPopup({
      isOpen: true,
      action: 'status',
      categoryId,
      categoryName,
    });
  };

  // Handle delete
  const handleDelete = (categoryId: string, categoryName: string) => {
    setConfirmationPopup({
      isOpen: true,
      action: 'delete',
      categoryId,
      categoryName,
    });
  };

  // Handle confirmation
  const handleConfirm = async () => {
    try {
      if (confirmationPopup.action === 'status') {
        const currentCategory = categoryList.find(cat => cat.id === confirmationPopup.categoryId);
        const newStatus = currentCategory?.status === 'active' ? 'inactive' : 'active';
        await updateCategoryStatus(confirmationPopup.categoryId, newStatus);
      } else if (confirmationPopup.action === 'delete') {
        await deleteCategory(confirmationPopup.categoryId);
      }
      
      // Refresh the list
      getCategoryList(filters);
      setConfirmationPopup({ isOpen: false, action: '', categoryId: '', categoryName: '' });
    } catch (error) {
      console.error('Error performing action:', error);
      setConfirmationPopup({ isOpen: false, action: '', categoryId: '', categoryName: '' });
    }
  };

  // Handle close popup
  const handleClosePopup = () => {
    setConfirmationPopup({ isOpen: false, action: '', categoryId: '', categoryName: '' });
  };

  const getConfirmationMessage = () => {
    if (confirmationPopup.action === 'status') {
      const currentCategory = categoryList.find(cat => cat.id === confirmationPopup.categoryId);
      const newStatus = currentCategory?.status === 'active' ? 'inactive' : 'active';
      return `Are you sure you want to ${newStatus === 'active' ? 'activate' : 'deactivate'} the category "${confirmationPopup.categoryName}"?`;
    } else if (confirmationPopup.action === 'delete') {
      return `Are you sure you want to delete the category "${confirmationPopup.categoryName}"? This action cannot be undone.`;
    }
    return '';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Categories
        </h1>
        <Link
          to="/dashboard/categories/create"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Link>
      </div>

      {/* Categories Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              All Categories
            </h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="relative">
                <select
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value, page: 1 })
                  }
                  className="appearance-none px-4 py-2.5 pr-8 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
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
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Category Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Slug
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Created Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {categoryList.map((category) => (
                <tr
                  key={category?.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {category?.name ? category?.name : "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                    {category?.slug ? category?.slug : "-"}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleStatusToggle(category?.id, category?.status, category?.name)}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity ${getStatusColor(
                        category?.status
                      )}`}
                      title={`Click to ${category?.status === 'active' ? 'deactivate' : 'activate'} this category`}
                    >
                      {category?.status ? category?.status.charAt(0).toUpperCase() + category?.status.slice(1) : "-"}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">
                    {category?.createdAt
                      ? helpers?.formatDateFunction(
                          category?.createdAt ?? "",
                          "dd/mm/yyyy",
                          true
                        )
                      : "-"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/dashboard/categories/${category?.id}`}
                        className="p-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                        title="View Category"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        to={`/dashboard/categories/${category?.id}/edit`}
                        className="p-2 text-gray-600 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 transition-colors"
                        title="Edit Category"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(category?.id, category?.name)}
                        className="p-2 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                        title="Delete Category"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {totalCategories > 0 && (
            <Pagination
              itemsPerPage={filters.limit}
              totalItems={totalCategories}
              currentPage={filters.page}
              onPageChange={(page: number) => {
                scrollToTop();
                setFilters({ ...filters, page });
              }}
            />
          )}
        </div>
      </div>

      {/* Confirmation Popup */}
      <ConfirmationPopup
        isOpen={confirmationPopup.isOpen}
        onClose={handleClosePopup}
        onConfirm={handleConfirm}
        title={confirmationPopup.action === 'delete' ? 'Delete Category' : 'Update Status'}
        message={getConfirmationMessage()}
        confirmText={confirmationPopup.action === 'delete' ? 'Delete' : 'Update'}
        type={confirmationPopup.action === 'delete' ? 'danger' : 'warning'}
      />
    </div>
  );
};

export default CategoryList; 