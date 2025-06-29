import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Calendar, Hash } from 'lucide-react';
import { useCategory } from '../../hooks/useCategory';
import { helpers } from '../../utils/helper';

const CategoryView: React.FC = () => {
  const { id } = useParams();
  const { categoryDetail, getCategoryDetail } = useCategory();
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      const fetchCategoryDetail = async () => {
        setDataLoading(true);
        try {
          await getCategoryDetail(id);
        } catch (error) {
          console.error('Error fetching category details:', error);
          setError('Failed to load category details');
        } finally {
          setDataLoading(false);
        }
      };
      
      fetchCategoryDetail();
    }
  }, [id]);

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
            to="/dashboard/categories"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Categories
          </Link>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
          {error}
        </div>
      </div>
    );
  }

  if (!categoryDetail) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link
            to="/dashboard/categories"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Categories
          </Link>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-400">
          Category not found
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
            to="/dashboard/categories"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Categories
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Category Details
          </h1>
        </div>
        <Link
          to={`/dashboard/categories/${id}/edit`}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit Category
        </Link>
      </div>

      {/* Category Details */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              Basic Information
            </h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Category Name
              </label>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {categoryDetail.name || '-'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Slug
              </label>
              <div className="flex items-center space-x-2">
                <Hash className="h-4 w-4 text-gray-400" />
                <p className="text-gray-900 dark:text-white font-mono">
                  {categoryDetail.slug || '-'}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Status
              </label>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                  categoryDetail.status
                )}`}
              >
                {categoryDetail.status ? categoryDetail.status.charAt(0).toUpperCase() + categoryDetail.status.slice(1) : '-'}
              </span>
            </div>
          </div>

          {/* Timestamps */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              Timestamps
            </h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Created Date
              </label>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <p className="text-gray-900 dark:text-white">
                  {categoryDetail.createdAt
                    ? helpers?.formatDateFunction(
                        categoryDetail.createdAt,
                        "dd/mm/yyyy",
                        true
                      )
                    : '-'}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Last Updated
              </label>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <p className="text-gray-900 dark:text-white">
                  {categoryDetail.updatedAt
                    ? helpers?.formatDateFunction(
                        categoryDetail.updatedAt,
                        "dd/mm/yyyy",
                        true
                      )
                    : '-'}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Category ID
              </label>
              <p className="text-gray-900 dark:text-white font-mono text-sm">
                {categoryDetail.id || '-'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryView; 