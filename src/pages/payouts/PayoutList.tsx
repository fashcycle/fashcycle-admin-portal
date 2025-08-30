import React, { useEffect, useState } from 'react';
import { Search, Filter, Eye, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePayouts } from '../../hooks/usePayouts';
import type { Payout } from '../../hooks/usePayouts';
import Pagination from '../../components/common/Pagination';
import { helpers } from '../../utils/helper';
import SettlePayoutPopup from '../../components/common/SettlePayoutPopup';

const PayoutList: React.FC = () => {
  const { payoutList, totalPayouts, currentPage, getPayoutList, isLoading, settlePayout } = usePayouts();
  const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null);
  const [isSettlePopupOpen, setIsSettlePopupOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchPayouts = async (page = 1) => {
    try {      
      await getPayoutList({
        page,
        search: searchTerm,
        status: statusFilter,
      });
    } catch (error) {
      console.error('Error fetching payouts:', error);
    }
  };

  useEffect(() => {
    // fetchPayouts();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPayouts(1);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value.toLowerCase();
    setStatusFilter(newStatus);
    // fetchPayouts(1);
  };

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== '') {
        fetchPayouts(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchPayouts(1);
  }, [statusFilter]);

  const handlePageChange = (page: number) => {
    fetchPayouts(page);
  };

  const handleSettleClick = (payout: Payout) => {
    setSelectedPayout(payout);
    setIsSettlePopupOpen(true);
  };

  const handleSettleSubmit = async (amount: string, note: string) => {
    try {
      if (selectedPayout) {
        await settlePayout(selectedPayout.id, amount, note);
        setIsSettlePopupOpen(false);
        setSelectedPayout(null);
      }
    } catch (error) {
      console.error('Error settling payout:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Payouts
        </h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Search */}
        <form onSubmit={handleSearch} className="w-full md:w-96">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by user name or product name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500"
            />
          </div>
        </form>

        {/* Status Filter */}
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={handleStatusChange}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">User</th>
              <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Product</th>
              <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Type</th>
              <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Amount</th>
              <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Paid</th>
              <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Remaining</th>
              <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
              <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Date</th>
              <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                        {isLoading ? (
              <tr>
                <td colSpan={8} className="px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : !payoutList || payoutList.earnings?.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  No payouts found
                </td>
              </tr>
            ) : (
              payoutList.earnings.map((payout: Payout) => (
                <tr key={payout.id}>
                  <td className="whitespace-nowrap px-4 py-4">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{payout.user?.name}</div>
                      <div className="text-gray-500 dark:text-gray-400">{payout.user?.email}</div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">
                    <div className="text-gray-900 dark:text-white">{payout.product?.productName}</div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">
                    <div className="text-gray-900 dark:text-white">{payout.type}</div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">
                    <div className="text-gray-900 dark:text-white">₹{payout.totalEarningAmount}</div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">
                    <div className="text-gray-900 dark:text-white">₹{payout.totalPaidByAdmin}</div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">
                    <div className="text-gray-900 dark:text-white">₹{payout.remainingAmount}</div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">
                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(payout.status)}`}>
                      {payout.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">
                    <div className="text-gray-500 dark:text-gray-400">{helpers.formatDate(payout.createdAt)}</div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">
                    <div className="flex space-x-2">
                      <Link
                        to={`/dashboard/payouts/${payout.id}`}
                        className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-600 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Link>
                      {payout.status === 'PENDING' && (
                        <button
                          onClick={() => handleSettleClick(payout)}
                          className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-green-600 focus:z-10 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-green-400"
                        >
                          <DollarSign className="h-4 w-4 mr-2" />
                          Settle
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPayouts > 0 && payoutList && (
        <Pagination
          currentPage={currentPage}
          totalItems={totalPayouts}
          onPageChange={handlePageChange}
          itemsPerPage={payoutList.limit || 10}
        />
      )}

      {/* Settle Payout Popup */}
      {selectedPayout && (
        <SettlePayoutPopup
          isOpen={isSettlePopupOpen}
          onClose={() => {
            setIsSettlePopupOpen(false);
            setSelectedPayout(null);
          }}
          onSubmit={handleSettleSubmit}
          maxAmount={selectedPayout.remainingAmount}
        />
      )}
    </div>
  );
};

export default PayoutList;
