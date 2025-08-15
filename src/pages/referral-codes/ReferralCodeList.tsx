import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Eye, Package, ShoppingCart, Users, DollarSign, ChevronDown, IndianRupee } from 'lucide-react';
import { useReferralCodes } from '../../hooks/useReferralCodes';
import { helpers } from '../../utils/helper';
import Pagination from '../../components/common/Pagination';
import ReferralCodePopup from './ReferralCodePopup';
import ConfirmationPopup from '../../components/common/ConfirmationPopup';

const ReferralCodeList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [popup, setPopup] = useState({
    isOpen: false,
    type: 'add' as 'add' | 'edit',
    referralCode: null as any
  });
  const [deletePopup, setDeletePopup] = useState({
    isOpen: false,
    referralCodeId: null as string | null
  });

  const statuses = [
    { label: "All Status", value: "" },
    { label: "Pending", value: "pending" },
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
  ];

  const stats = [
    {
      name: 'Total Referrals',
      value: '1234',
      change: '+12%',
      changeText:'This month',
      changeType: 'increase',
      icon: Package,
      color: 'blue'
    },
    {
      name: 'Successfull Referrals',
      value: '156',
      change: '+8%',
      changeText:'Completed registrations',
      changeType: 'increase',
      icon: ShoppingCart,
      color: 'green'
    },
    {
      name: 'Rewards Paid',
      value: '1,429',
      change: '+23%',
      changeText:'Total Rewards distributed',
      changeType: 'increase',
      icon: Users,
      color: 'purple'
    },
    {
      name: 'Conversion Rate',
      value: '80%',
      change: '+18%',
      changeText:'Referrals to registrations',
      changeType: 'increase',
      icon: IndianRupee,
      color: 'yellow'
    }
  ];

  const { referralCodeList, totalReferralCodes, getReferralCodeList, deleteReferralCode } = useReferralCodes();

  useEffect(() => {
    loadReferralCodes();
  }, [currentPage, searchTerm, statusFilter]);

  const loadReferralCodes = async () => {
    try {
      await getReferralCodeList({
        page: currentPage,
        limit: limit,
        search: searchTerm,
        status: statusFilter,
      });
    } catch (error) {
      console.error('Error loading referral codes:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadReferralCodes();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAddReferralCode = () => {
    setPopup({
      isOpen: true,
      type: 'add',
      referralCode: null
    });
  };

  const handleEditReferralCode = (referralCode: any) => {
    setPopup({
      isOpen: true,
      type: 'edit',
      referralCode: referralCode
    });
  };

  const handleDeleteReferralCode = (referralCodeId: string) => {
    setDeletePopup({
      isOpen: true,
      referralCodeId: referralCodeId
    });
  };

  const confirmDelete = async () => {
    if (!deletePopup.referralCodeId) return;

    try {
      await deleteReferralCode(deletePopup.referralCodeId);
      setDeletePopup({ isOpen: false, referralCodeId: null });
      loadReferralCodes();
    } catch (error) {
      console.error('Error deleting referral code:', error);
    }
  };

  const handlePopupClose = () => {
    setPopup({ isOpen: false, type: 'add', referralCode: null });
    loadReferralCodes();
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "deleted":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getStatColor = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-500';
      case 'green':
        return 'bg-green-500';
      case 'purple':
        return 'bg-purple-500';
      case 'yellow':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Referral Codes Management
        </h1>
        <button
          onClick={handleAddReferralCode}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Referral Code
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.name}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className={`text-sm ${
                    stat.changeType === 'increase' 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {stat.change} {stat.changeText}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${getStatColor(stat.color)}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search referral codes..."
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </form>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none px-4 py-2 pr-8 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              {statuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            <ChevronDown className="h-4 w-4 text-gray-400 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Referral Codes Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Referrer Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  UPI ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
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
              {referralCodeList.length > 0 ? (
                referralCodeList.map((referralCode) => (
                  <tr key={referralCode.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {referralCode.code}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {referralCode.referrerName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {referralCode.contactNo}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {referralCode.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {referralCode.upiId}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(referralCode.status)}`}>
                        {referralCode.status || 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {helpers?.formatDateFunction(referralCode.createdAt, "dd/mm/yyyy", true)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditReferralCode(referralCode)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Edit Referral Code"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteReferralCode(referralCode.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          title="Delete Referral Code"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No referral codes found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalReferralCodes > limit && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <Pagination
              currentPage={currentPage}
              totalItems={totalReferralCodes}
              itemsPerPage={limit}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {/* Add/Edit Popup */}
      {popup.isOpen && (
        <ReferralCodePopup
          isOpen={popup.isOpen}
          onClose={handlePopupClose}
          type={popup.type}
          referralCode={popup.referralCode}
        />
      )}

      {/* Delete Confirmation Popup */}
      {deletePopup.isOpen && (
        <ConfirmationPopup
          isOpen={deletePopup.isOpen}
          onClose={() => setDeletePopup({ isOpen: false, referralCodeId: null })}
          onConfirm={confirmDelete}
          title="Delete Referral Code"
          message="Are you sure you want to delete this referral code? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
        />
      )}
    </div>
  );
};

export default ReferralCodeList; 