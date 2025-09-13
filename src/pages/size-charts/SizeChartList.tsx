import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Ruler,
  Calendar,
} from 'lucide-react';
import { useSizeChart } from '../../hooks/useSizeChart';
import { helpers } from '../../utils/helper';
import Pagination from '../../components/common/Pagination';
import ConfirmationPopup from '../../components/common/ConfirmationPopup';

const SizeChartList: React.FC = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const {
    sizeChartList,
    totalSizeCharts,
    currentPage,
    getSizeChartList,
    deleteSizeChart,
  } = useSizeChart();

  useEffect(() => {
    loadSizeCharts();
  }, [page, search]);

  const loadSizeCharts = async () => {
    try {
      await getSizeChartList({
        page,
        limit,
        search: search.trim(),
      });
    } catch (error) {
      console.error('Error loading size charts:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadSizeCharts();
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;

    setDeleteLoading(true);
    try {
      await deleteSizeChart(deletingId);
      setShowDeleteConfirm(false);
      setDeletingId(null);
    } catch (error) {
      console.error('Error deleting size chart:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCloseDeleteConfirm = () => {
    setShowDeleteConfirm(false);
    setDeletingId(null);
  };

  const getSizeCount = (sizes: any) => {
    return Object.keys(sizes).length;
  };

  const getSizeNames = (sizes: any) => {
    return Object.keys(sizes).join(', ');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Ruler className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Size Charts
          </h1>
        </div>
        <Link
          to="/dashboard/size-charts/create"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Size Chart
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search size charts..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Size Charts Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        {sizeChartList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Sizes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {sizeChartList.map((sizeChart) => (
                  <tr key={sizeChart.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {sizeChart.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white max-w-xs truncate">
                        {sizeChart.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        <div className="font-medium">{getSizeCount(sizeChart.sizes)} sizes</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-32">
                          {getSizeNames(sizeChart.sizes)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {helpers?.formatDateFunction(sizeChart.createdAt, "dd/mm/yyyy", true)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/dashboard/size-charts/${sizeChart.id}/edit`}
                          className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                          title="Edit Size Chart"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(sizeChart.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          title="Delete Size Chart"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Ruler className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Size Charts Found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Get started by creating your first size chart.
            </p>
            <Link
              to="/dashboard/size-charts/create"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Size Chart
            </Link>
          </div>
        )}

        {/* Pagination */}
        {totalSizeCharts > limit && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <Pagination
              currentPage={currentPage}
              totalItems={totalSizeCharts}
              itemsPerPage={limit}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {/* Delete Confirmation Popup */}
      <ConfirmationPopup
        isOpen={showDeleteConfirm}
        onClose={handleCloseDeleteConfirm}
        onConfirm={handleConfirmDelete}
        title="Delete Size Chart"
        message="Are you sure you want to delete this size chart? This action cannot be undone."
        confirmText="Delete"
        type="danger"
        loading={deleteLoading}
      />
    </div>
  );
};

export default SizeChartList;
