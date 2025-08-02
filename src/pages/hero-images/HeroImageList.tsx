import React, { useEffect, useState } from "react";
import { Search, Eye, Edit, Plus, Trash2, Image } from "lucide-react";
import { useHeroImage, useHeroImageMutations } from "../../hooks/useHeroImage";
import Pagination from "../../components/common/Pagination";
import { helpers } from "../../utils/helper";
import ConfirmationPopup from "../../components/common/ConfirmationPopup";
import HeroImagePopup from "../../components/common/HeroImagePopup";
import HeroImageDetailPopup from "../../components/common/HeroImageDetailPopup";

// Filters type
interface Filters {
  page: number;
  limit: number;
  search: string;
}

const HeroImageList: React.FC = () => {
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
    heroImageId: '',
    heroImageName: '',
  });

  // Hero image popup state
  const [heroImagePopup, setHeroImagePopup] = useState({
    isOpen: false,
    isEdit: false,
    heroImage: null as any,
  });

  // Hero image detail popup state
  const [detailPopup, setDetailPopup] = useState({
    isOpen: false,
    heroImageId: null as string | null,
  });

  const { heroImageList, getHeroImageList, totalHeroImages } = useHeroImage();
  const { createHeroImage, updateHeroImage, deleteHeroImage } = useHeroImageMutations();

  useEffect(() => {
    getHeroImageList(filters);
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

  // Handle add new hero image
  const handleAddHeroImage = () => {
    setHeroImagePopup({
      isOpen: true,
      isEdit: false,
      heroImage: null,
    });
  };

  // Handle view hero image details
  const handleViewHeroImage = (heroImageId: string) => {
    setDetailPopup({
      isOpen: true,
      heroImageId: heroImageId,
    });
  };

  // Handle edit hero image
  const handleEditHeroImage = (heroImage: any) => {
    setHeroImagePopup({
      isOpen: true,
      isEdit: true,
      heroImage: heroImage,
    });
  };

  // Handle delete
  const handleDelete = (heroImageId: string, heroImageName: string) => {
    setConfirmationPopup({
      isOpen: true,
      action: 'delete',
      heroImageId,
      heroImageName,
    });
  };

  // Handle confirmation
  const handleConfirm = async () => {
    try {
      if (confirmationPopup.action === 'delete') {
        await deleteHeroImage(confirmationPopup.heroImageId, () => {
          // Refresh the list
          getHeroImageList(filters);
        });
      }
      
      setConfirmationPopup({ isOpen: false, action: '', heroImageId: '', heroImageName: '' });
    } catch (error) {
      console.error('Error performing action:', error);
      setConfirmationPopup({ isOpen: false, action: '', heroImageId: '', heroImageName: '' });
    }
  };

  // Handle close popup
  const handleClosePopup = () => {
    setConfirmationPopup({ isOpen: false, action: '', heroImageId: '', heroImageName: '' });
  };

  // Handle save hero image
  const handleSaveHeroImage = async (heroImageData: FormData) => {
    try {
      if (heroImagePopup.isEdit) {
        await updateHeroImage(heroImagePopup.heroImage.id, heroImageData);
      } else {
        await createHeroImage(heroImageData);
      }
      
      // Refresh the list
      getHeroImageList(filters);
      setHeroImagePopup({ isOpen: false, isEdit: false, heroImage: null });
    } catch (error) {
      console.error('Error saving hero image:', error);
      throw error;
    }
  };

  // Handle close hero image popup
  const handleCloseHeroImagePopup = () => {
    setHeroImagePopup({ isOpen: false, isEdit: false, heroImage: null });
  };

  // Handle close detail popup
  const handleCloseDetailPopup = () => {
    setDetailPopup({ isOpen: false, heroImageId: null });
  };

  const getConfirmationMessage = () => {
    if (confirmationPopup.action === 'delete') {
      return `Are you sure you want to delete the hero image "${confirmationPopup.heroImageName}"? This action cannot be undone.`;
    }
    return '';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Hero Images
        </h1>
        <button
          onClick={handleAddHeroImage}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Hero Image
        </button>
      </div>

      {/* Hero Images Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              All Hero Images
            </h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search hero images..."
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
                  Image
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Header
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Description
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
              {heroImageList.map((heroImage) => (
                <tr
                  key={heroImage?.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img
                          src={heroImage?.imageUrl}
                          alt={heroImage?.header}
                          className="w-16 h-12 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                        />
                        <Image className="absolute -top-1 -right-1 h-4 w-4 text-gray-400 bg-white dark:bg-gray-800 rounded-full p-0.5" />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 dark:text-white max-w-xs truncate">
                      {heroImage?.header ? heroImage?.header : "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900 dark:text-white max-w-xs truncate">
                      {heroImage?.description ? heroImage?.description : "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">
                    {heroImage?.createdAt
                      ? helpers?.formatDateFunction(
                          heroImage?.createdAt ?? "",
                          "dd/mm/yyyy",
                          true
                        )
                      : "-"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewHeroImage(heroImage?.id)}
                        className="inline-flex items-center p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditHeroImage(heroImage)}
                        className="inline-flex items-center p-2 text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 transition-colors"
                        title="Edit Hero Image"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(heroImage?.id, heroImage?.header)}
                        className="inline-flex items-center p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                        title="Delete Hero Image"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {heroImageList.length === 0 && (
            <div className="text-center py-12">
              <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No hero images found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm ? "Try adjusting your search criteria." : "Get started by adding your first hero image."}
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalHeroImages > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <Pagination
              currentPage={filters.page}
              totalItems={totalHeroImages}
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

      {/* Hero Image Popup */}
      <HeroImagePopup
        isOpen={heroImagePopup.isOpen}
        onClose={handleCloseHeroImagePopup}
        onSave={handleSaveHeroImage}
        heroImage={heroImagePopup.heroImage}
        isEdit={heroImagePopup.isEdit}
      />

      {/* Hero Image Detail Popup */}
      <HeroImageDetailPopup
        isOpen={detailPopup.isOpen}
        onClose={handleCloseDetailPopup}
        heroImageId={detailPopup.heroImageId}
      />
    </div>
  );
};

export default HeroImageList; 