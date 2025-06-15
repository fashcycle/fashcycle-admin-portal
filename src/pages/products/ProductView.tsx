import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Edit, MoreHorizontal, Package } from "lucide-react";
import { useProduct, useProductMutations } from "../../hooks/useProduct";
import { helpers } from "../../utils/helper";
import ConfirmationPopup from "../../components/common/ConfirmationPopup";
const ProductView: React.FC = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Hooks
  const { productDetail, getProductDetail } = useProduct();
  const { updateProductStatus } = useProductMutations();

  // call api to get product detail
  useEffect(() => {
    if (id) {
      getProductDetail(id);
    }
  }, [id]);

  // update product status
  const handleUpdateProductStatus = async (status: string) => {
    if (id) {
      console.log("status", status);
      await updateProductStatus(id, status);
    }
  };

  const statuses = [
    { label: "Pending Review", value: "pending" },
    { label: "Active", value: "approved" },
    { label: "Rejected", value: "rejected" },
    { label: "Query Raised", value: "query_raised" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "query raised":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "rent":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "sell":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  // Helper function to determine if media is a video
  const isVideo = (mediaUrl: string) => {
    const videoExtensions = [
      ".mp4",
      ".webm",
      ".ogg",
      ".mov",
      ".avi",
      ".wmv",
      ".flv",
      ".mkv",
    ];
    return videoExtensions.some((ext) => mediaUrl.toLowerCase().includes(ext));
  };

  // Helper function to render media (image or video)
  const renderMedia = (mediaUrl: string, alt: string, className: string) => {
    if (isVideo(mediaUrl)) {
      return (
        <video
          src={mediaUrl}
          className={className}
          controls
          muted
          preload="metadata"
        >
          Your browser does not support the video tag.
        </video>
      );
    }
    return <img src={mediaUrl} alt={alt} className={className} />;
  };

  const handleDeleteProduct = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    // Add your delete logic here
    console.log("Product deleted");
    setShowDeleteConfirm(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/dashboard/products"
            className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Products</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Product Details
          </h1>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            to={`/dashboard/products/${id}/edit`}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit className="h-4 w-4" />
            <span>Edit Product</span>
          </Link>
          <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Media */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Product Media
          </h2>

          <div className="space-y-4">
            <div className="aspect-w-16 aspect-h-20 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
              {productDetail?.images?.[selectedImage] ? (
                renderMedia(
                  productDetail.images[selectedImage],
                  productDetail.name,
                  "w-full h-80 object-contain"
                )
              ) : (
                <div className="flex items-center justify-center h-80">
                  <Package className="h-16 w-16 text-gray-400" />
                </div>
              )}
            </div>

            {/* Slidable thumbnail list */}
            <div className="relative">
              <div className="flex space-x-3 overflow-x-auto scrollbar-hide pb-2 scroll-smooth snap-x snap-mandatory">
                {productDetail?.images?.map((media, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors snap-start ${
                      selectedImage === index
                        ? "border-blue-500"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <div className="relative w-full h-full">
                      {renderMedia(
                        media,
                        `${productDetail.name} ${index + 1}`,
                        "w-full h-full object-cover"
                      )}
                      {/* Video indicator */}
                      {isVideo(media) && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                          <div className="w-6 h-6 bg-white bg-opacity-80 rounded-full flex items-center justify-center">
                            <div className="w-0 h-0 border-l-[6px] border-l-gray-800 border-y-[4px] border-y-transparent ml-1"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Scroll indicators */}
              {productDetail?.images && productDetail.images.length > 4 && (
                <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between pointer-events-none">
                  <div className="w-8 h-full bg-gradient-to-r from-white dark:from-gray-800 to-transparent"></div>
                  <div className="w-8 h-full bg-gradient-to-l from-white dark:from-gray-800 to-transparent"></div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Information */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 mb-4">
            <Package className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Product Information
            </h2>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {productDetail?.name}
              </h3>
              <div className="flex items-center space-x-3 mb-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(
                    productDetail?.category ?? ""
                  )}`}
                >
                  {productDetail?.category}
                </span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(
                    productDetail?.type ?? ""
                  )}`}
                >
                  {productDetail?.type}
                </span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                    productDetail?.status ?? ""
                  )}`}
                >
                  {productDetail?.status}
                </span>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  ₹{productDetail?.price?.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  for {productDetail?.duration} days
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Seller:
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {productDetail?.seller}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Color:
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {productDetail?.color}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Listed:
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {helpers?.formatDateFunction(
                    productDetail?.listedDate ?? "",
                    "dd/mm/yyyy",
                    true
                  )}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Size:
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {productDetail?.size}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Condition:
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {productDetail?.condition}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Contact Number:
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {productDetail?.contactNumber}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Size Flexibility:
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {productDetail?.flexibility}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Address:
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {productDetail?.address}
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Description
              </h4>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {productDetail?.description}
              </p>
            </div>
          </div>
        </div>

        {/* product Status and Actions */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Product Status and Actions
          </h2>

          {/*create select dropdown for status */}
          <select 
            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 mb-4"
            value={productDetail?.status || ''}
            onChange={(e) => handleUpdateProductStatus(e.target.value)}
          >
            {statuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>

          {/* create button for delete product with red color */}
          <button
            onClick={handleDeleteProduct}
            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-red-500 text-white hover:bg-red-600 transition-colors"
          >
            Delete Product
          </button>
        </div>
      </div>

      <ConfirmationPopup
        isOpen={showDeleteConfirm}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default ProductView;
