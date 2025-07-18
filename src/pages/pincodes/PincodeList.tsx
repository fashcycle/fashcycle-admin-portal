import React, { useEffect, useState } from "react";
import { Search, Eye, Edit, ChevronDown, Plus, Trash2, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { usePincode, usePincodeMutations } from "../../hooks/usePincode";
import Pagination from "../../components/common/Pagination";
import { helpers } from "../../utils/helper";
import ConfirmationPopup from "../../components/common/ConfirmationPopup";
import PincodePopup from "../../components/common/PincodePopup";
import PincodeDetailPopup from "../../components/common/PincodeDetailPopup";

// Filters type
interface Filters {
  page: number;
  limit: number;
  search: string;
}

const PincodeList: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const [filters, setFilters] = useState<Filters>({
    page: 1,
    limit: 10,
    search: "",
  });

  const [searchTerm, setSearchTerm] = useState("");

  // Confirmation popup state
  const [confirmationPopup, setConfirmationPopup] = useState({
    isOpen: false,
    action: '',
    pincodeId: '',
    pincodeName: '',
  });

  // Pincode popup state
  const [pincodePopup, setPincodePopup] = useState({
    isOpen: false,
    isEdit: false,
    pincode: null as any,
  });

  // Pincode detail popup state
  const [detailPopup, setDetailPopup] = useState({
    isOpen: false,
    pincodeId: null as string | null,
  });

  const { pincodeList, getPincodeList, totalPincodes } = usePincode();
  const { createPincode, updatePincode, deletePincode } = usePincodeMutations();

  useEffect(() => {
    getPincodeList(filters);
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

  // Handle add new pincode
  const handleAddPincode = () => {
    setPincodePopup({
      isOpen: true,
      isEdit: false,
      pincode: null,
    });
  };

  // Handle view pincode details
  const handleViewPincode = (pincodeId: string) => {
    setDetailPopup({
      isOpen: true,
      pincodeId: pincodeId,
    });
  };

  // Handle edit pincode
  const handleEditPincode = (pincode: any) => {
    setPincodePopup({
      isOpen: true,
      isEdit: true,
      pincode: pincode,
    });
  };

  // Handle delete
  const handleDelete = (pincodeId: string, pincodeName: string) => {
    setConfirmationPopup({
      isOpen: true,
      action: 'delete',
      pincodeId,
      pincodeName,
    });
  };

  // Handle confirmation
  const handleConfirm = async () => {
    try {
      if (confirmationPopup.action === 'delete') {
        await deletePincode(confirmationPopup.pincodeId, () => {
          // Refresh the list
          getPincodeList(filters);
        });
      }
      
      setConfirmationPopup({ isOpen: false, action: '', pincodeId: '', pincodeName: '' });
    } catch (error) {
      console.error('Error performing action:', error);
      setConfirmationPopup({ isOpen: false, action: '', pincodeId: '', pincodeName: '' });
    }
  };

  // Handle close popup
  const handleClosePopup = () => {
    setConfirmationPopup({ isOpen: false, action: '', pincodeId: '', pincodeName: '' });
  };

  // Handle save pincode
  const handleSavePincode = async (pincodeData: any) => {
    try {
      if (pincodePopup.isEdit) {
        await updatePincode(pincodePopup.pincode.id, pincodeData);
      } else {
        await createPincode(pincodeData);
      }
      
      // Refresh the list
      getPincodeList(filters);
      setPincodePopup({ isOpen: false, isEdit: false, pincode: null });
    } catch (error) {
      console.error('Error saving pincode:', error);
      throw error;
    }
  };

  // Handle close pincode popup
  const handleClosePincodePopup = () => {
    setPincodePopup({ isOpen: false, isEdit: false, pincode: null });
  };

  // Handle close detail popup
  const handleCloseDetailPopup = () => {
    setDetailPopup({ isOpen: false, pincodeId: null });
  };

  const getConfirmationMessage = () => {
    if (confirmationPopup.action === 'delete') {
      return `Are you sure you want to delete the pincode "${confirmationPopup.pincodeName}"? This action cannot be undone.`;
    }
    return '';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Pincodes
        </h1>
        <button
          onClick={handleAddPincode}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Pincode
        </button>
      </div>

      {/* Pincodes Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              All Pincodes
            </h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search pincodes..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Pincode
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  City
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  State
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Country
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
              {pincodeList.map((pincode) => (
                <tr
                  key={pincode?.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="font-medium text-gray-900 dark:text-white">
                        {pincode?.pincode ? pincode?.pincode : "-"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">
                    {pincode?.city ? pincode?.city : "-"}
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">
                    {pincode?.state ? pincode?.state : "-"}
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">
                    {pincode?.country ? pincode?.country : "-"}
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">
                    {pincode?.createdAt
                      ? helpers?.formatDateFunction(
                          pincode?.createdAt ?? "",
                          "dd/mm/yyyy",
                          true
                        )
                      : "-"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewPincode(pincode?.id)}
                        className="inline-flex items-center p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditPincode(pincode)}
                        className="inline-flex items-center p-2 text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 transition-colors"
                        title="Edit Pincode"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(pincode?.id, pincode?.pincode)}
                        className="inline-flex items-center p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                        title="Delete Pincode"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {pincodeList.length === 0 && (
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No pincodes found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm ? "Try adjusting your search criteria." : "Get started by adding your first pincode."}
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPincodes > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <Pagination
              currentPage={filters.page}
              totalItems={totalPincodes}
              itemsPerPage={filters.limit}
              onPageChange={(page) => {
                setFilters({ ...filters, page });
                scrollToTop();
              }}
            />
          </div>
        )}
      </div>

      {/* Confirmation Popup */}
      <ConfirmationPopup
        isOpen={confirmationPopup.isOpen}
        onClose={handleClosePopup}
        onConfirm={handleConfirm}
        title="Confirm Action"
        message={getConfirmationMessage()}
      />

      {/* Pincode Popup */}
      <PincodePopup
        isOpen={pincodePopup.isOpen}
        onClose={handleClosePincodePopup}
        onSave={handleSavePincode}
        pincode={pincodePopup.pincode}
        isEdit={pincodePopup.isEdit}
      />

      {/* Pincode Detail Popup */}
      <PincodeDetailPopup
        isOpen={detailPopup.isOpen}
        onClose={handleCloseDetailPopup}
        pincodeId={detailPopup.pincodeId}
      />
    </div>
  );
};

export default PincodeList; 