import { useState } from 'react';
import globalRequest from '../services/globalRequest';
import { useAppState } from '../contexts/AppStateContext';
import apiRoutes from '../utils/apiRoutes';
import { helpers } from '../utils/helper';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: { name: string };
  image: string;
  stock: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

interface ProductListResponse {
  products: Product[];
  total: number;
  currentPage: number;
  limit: number;
}

interface ProductDetail {
  id: string;
  name: string;
  category: { name: string };
  type: string;
  status: string;
  price: number;
  seller: string;
  listedDate: string;
  color: string;
  size: string;
  address: string;
  description: string;
  images: string[];
  flexibility: string;
  mobileNumber: string;
  isDeleted: boolean;
  listingStatus?: string;
}

interface GetProductListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  categoryId?: string;
  listingType?: string;
  referralCodeId?: string;
}

interface ProductDetailToUpdate {
  id: string;
  name: string;
  mobileNumber: string;
  category: { name: string };
  originalPurchasePrice: number;
  size: string;
  sizeFlexibility: string;
  color: string;
  listingType: string[];
  description: string;
  previewFiles: {
    frontLook: string | null;
    backLook: string | null;
    sideLook: string | null;
    closeUpLook: string | null;
    optional1: string | null;
    optional2: string | null;
    productVideo: string | null;  
    accessories: string | null; 
    proofOfPurchase: string | null;
  }
}

interface ProductDetailResponse {
  product: ProductDetail;
  productDetailToUpdate: ProductDetailToUpdate;
}

export const useProduct = () => {
  const [productList, setProductList] = useState<Product[]>([]);
  const [productDetail, setProductDetail] = useState<ProductDetail | null>(null);
  const [productDetailToUpdate, setProductDetailToUpdate] = useState<ProductDetailToUpdate | null>(null);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [referralCodes, setReferralCodes] = useState<any[]>([]);
  const { setLoading } = useAppState();

  // Common product options that can be used across the application
  const getProductColors = () => {
    return  [
      { name: "Red", color: "bg-red-500" },
      { name: "Pink", color: "bg-pink-500" },
      { name: "Maroon", color: "bg-red-900" },
      { name: "Orange", color: "bg-orange-500" },
      { name: "Yellow", color: "bg-yellow-500" },
      { name: "Green", color: "bg-green-500" },
      { name: "Blue", color: "bg-blue-500" },
      { name: "Navy", color: "bg-blue-900" },
      { name: "Purple", color: "bg-purple-500" },
      { name: "Black", color: "bg-black" },
      {
        name: "White",
        color: "bg-white border border-gray-200",
      },
      { name: "Grey", color: "bg-gray-500" },
      { name: "Brown", color: "bg-amber-800" },
      { name: "Gold", color: "bg-yellow-600" },
      { name: "Silver", color: "bg-gray-300" },
    ];
  };

  const getProductSizes = () => {
    return ['S', 'M', 'L', 'XL', 'XXL','FREE_SIZE'];
  };

  const getProductSizesFlexibility = () => {
    return ['0cm','1cm','1.5cm','2cm','2.5cm','3cm','3.5cm', '3+cm'];
  };

  const getAllReferralCodes = async () => {
    try {
      const response = await globalRequest(
        apiRoutes.referralCodeList,
        'get'
      );
      console.log('Referral codes API response:', response);
      
      // Handle different possible response structures
      const codes = response.list || response.data || response || [];
      setReferralCodes(codes);
      return codes;
    } catch (error) {
      console.error('Failed to fetch referral codes:', error);
      throw error;
    }
  };

  const getProductList = async (params: GetProductListParams = {}) => {
    try {
      setLoading(true);
      const response = await globalRequest(
        apiRoutes.productList,
        'get',
        {},
        {
          params: {
            page: params.page || 1,
            limit: params.limit || 10,
            search: params.search || '',
            categoryId: params.categoryId || null,
            status: params.status || null,
            listingType: params.listingType || null,
            referralCodeId: params.referralCodeId || null,
          }
        }
      );
      const data: ProductListResponse = response;
      setProductList(data.products);
      setTotalProducts(data.total);
      setCurrentPage(data.currentPage);
      return data;
    } catch (error) {
      console.error('Failed to fetch products:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getProductDetail = async (productId: string) => {
    if (!productId) return null;

    try {
      setLoading(true);
      const response = await globalRequest(
        apiRoutes.productDetail(productId),
        'get'
      );

      let product = response?.product;

      const productDetailData = {
        id: product.id,
        name: product.productName,
        category: product.category,
        type: product.listingType[0],
        status: product.status,
        price: product.originalPurchasePrice,
        seller: product.owner.name,
        listedDate: product.createdAt,
        color: product.color,
        size: product.size,
        description: product.description,
        images: helpers.extractUrls(product.productImage),
        mobileNumber: product.mobileNumber,
        flexibility: product.sizeFlexibility,
        address: `${product?.address?.addressLine1}, ${product?.address?.addressLine2}, ${product?.address?.landmark}`,
        isDeleted: product.isDeleted || false,
        listingStatus: product.listingStatus || 'ACTIVE'
      }

      //if video is present then add video to the images array
      if (product.productVideo) {
        productDetailData.images.push(product.productVideo);
      }
      //if accessoriesImage is present then add accessoriesImage to the images array
      if (product.accessoriesImage) {
        productDetailData.images.push(product.accessoriesImage);
      }
      //if proofOfPurchase is present then add proofOfPurchase to the images array
      if (product.proofOfPurchase) {
        productDetailData.images.push(product.proofOfPurchase);
      }

      //set productDetailToUpdate
 
    // response data => 
  //   {
  //     "id": "9a458dfd-a4cb-4f99-8333-dd0c5d8001ad",
  //     "productName": "S Product-2",
  //     "mobileNumber": "1234567890",
  //     "category": "Saree",
  //     "originalPurchasePrice": 3000,
  //     "size": "L",
  //     "sizeFlexibility": "3cm",
  //     "color": "Red",
  //     "productVideo": "https://fashcycle-official-media.s3.amazonaws.com/video/728d4b68-2f12-435f-9eb5-51c8e7526f86.mp4",
  //     "accessoriesImage": "https://fashcycle-official-media.s3.amazonaws.com/image/5dba4561-d902-436b-8ae7-6da45687f3f2.webp",
  //     "proofOfPurchase": "https://fashcycle-official-media.s3.amazonaws.com/image/2b7e50dc-1eda-492d-b5c1-d427364a5b9b.webp",
  //     "listingType": [
  //         "rent"
  //     ],
  //     "addressId": "5b3ca9aa-1715-404b-9e11-219d8bc8526f",
  //     "ownerId": "6601124a-456d-4327-8203-b9fbff54a91d",
  //     "createdAt": "2025-06-13T17:39:50.631Z",
  //     "updatedAt": "2025-06-13T18:04:25.304Z",
  //     "status": "APPROVED",
  //     "adminNote": null,
  //     "queryNote": null,
  //     "approvedAt": "2025-06-13T18:04:25.299Z",
  //     "queryRaisedAt": null,
  //     "rejectedAt": null,
  //     "description": "description",
  //     "isAvailability": true,
  //     "isRented": false,
  //     "updatedById": null,
  //     "owner": {
  //         "id": "6601124a-456d-4327-8203-b9fbff54a91d",
  //         "name": "Test20 User",
  //         "email": "testuser20@gmail.com",
  //         "image": "https://fashcycle-official-media.s3.amazonaws.com/image/cd3573ca-3509-4803-8f24-88beded090bc.webp",
  //         "phone": "1234567890",
  //         "role": "USER",
  //         "createdAt": "2025-06-13T16:22:39.893Z",
  //         "updatedAt": "2025-06-13T17:37:36.407Z"
  //     },
  //     "productImage": {
  //         "id": "1093e0dc-9293-436d-8a51-da57186ca03c",
  //         "frontLook": "https://fashcycle-official-media.s3.amazonaws.com/image/3d150243-6a3f-48d1-a77c-be35884a3421.webp",
  //         "backLook": "https://fashcycle-official-media.s3.amazonaws.com/image/6fe04465-2ae5-4448-948a-4848a132e4e8.webp",
  //         "sideLook": "https://fashcycle-official-media.s3.amazonaws.com/image/d87caabd-9b52-4b0b-8761-ecc45f8a1d3d.webp",
  //         "closeUpLook": "https://fashcycle-official-media.s3.amazonaws.com/image/0a1192ad-fdfb-4728-9e8d-a16bbd37136e.webp",
  //         "optional1": "https://fashcycle-official-media.s3.amazonaws.com/image/13d1cca3-0569-457d-a12b-41577112a285.webp",
  //         "optional2": "https://fashcycle-official-media.s3.amazonaws.com/image/eb82e747-902b-4128-9c3f-82be4b282a59.webp",
  //         "productId": "9a458dfd-a4cb-4f99-8333-dd0c5d8001ad"
  //     },
  //     "address": {
  //         "id": "5b3ca9aa-1715-404b-9e11-219d8bc8526f",
  //         "userId": "6601124a-456d-4327-8203-b9fbff54a91d",
  //         "landmark": "Testing5",
  //         "pincode": "123456789",
  //         "city": "Testing City 5",
  //         "state": "TC5",
  //         "addressLine1": "123 Main St5",
  //         "addressLine2": "Apt 4B5",
  //         "country": "Testing5",
  //         "address": "HOME",
  //         "customAddressType": null
  //     }
  // }

     let productDetailDataToUpdate = {
       id: product?.id,
       name: product?.productName,
       mobileNumber: product?.mobileNumber,
       category: product?.category,
       originalPurchasePrice: product?.originalPurchasePrice,
       size: product?.size,
       sizeFlexibility: product?.sizeFlexibility,
       color: product?.color,
       listingType: product?.listingType || [],
       description: product?.description,
        previewFiles: {
          frontLook: product?.productImage?.frontLook || null,
          backLook: product?.productImage?.backLook || null,
          sideLook: product?.productImage?.sideLook || null,
          closeUpLook: product?.productImage?.closeUpLook || null,
          optional1: product?.productImage?.optional1 || null,
          optional2: product?.productImage?.optional2 || null,
          productVideo: product?.productVideo || null,
          accessories: product?.accessoriesImage || null,
          proofOfPurchase: product?.proofOfPurchase || null,
        }
     }
      
      const data: ProductDetailResponse = { product: productDetailData, productDetailToUpdate: productDetailDataToUpdate };
      setProductDetail(productDetailData);
      setProductDetailToUpdate(productDetailDataToUpdate);
      return data.product;
    } catch (error) {
      console.error('Failed to fetch product details:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    // State
    productList,
    productDetail,
    totalProducts,
    currentPage,
    productDetailToUpdate,
    referralCodes,
    getProductSizesFlexibility,

    // Functions
    getProductList,
    getProductDetail,
    getAllReferralCodes,
    getProductColors,
    getProductSizes
  };
};

export const useProductMutations = () => {
  const { setLoading, setMessage } = useAppState();

  const createProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      const response = await globalRequest(
        apiRoutes.productCreate,
        'post',
        productData
      );
      return response.data;
    } catch (error) {
      console.error('Failed to create product:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (productId: string, productData: Partial<Product>) => {
    try {
      setLoading(true);
      const response = await globalRequest(
        apiRoutes.productUpdate(productId),
        'put',
        productData
      );
      return response.data;
    } catch (error) {
      console.error('Failed to update product:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId: string, callback: () => void) => {
    try {
      setLoading(true);
      await globalRequest(
        apiRoutes.productDelete(productId),
        'delete'
      );
      setMessage("Product deleted successfully", "success");
      if (callback) callback();
    } catch (error: any) {
      const message = error?.response?.data?.message || "Failed to delete product";
      setMessage(message, "error");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProductStatus = async (productId: string, status: string, note?: string) => {
    try {
      setLoading(true);
      const requestData: any = { status };
      if (note) {
        requestData.note = note;
      }
      
      const response = await globalRequest(
        apiRoutes.productUpdateStatus(productId),
        'put',
        requestData
      );
      setMessage("Product status updated successfully", "success");
      return response.data;
    } catch (error: any) {
      const message = error?.response?.data?.message || "Failed to update product status";
      setMessage(message, "error");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const editProduct = async (productId: string, productData: FormData) => {
    setLoading(true);
    try {
      const response = await globalRequest(apiRoutes.productUpdate(productId), 'put', productData);
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    createProduct,
    updateProduct,
    deleteProduct,
    updateProductStatus,
    editProduct,
  };
};

// Hook for deleted products
export const useDeletedProducts = () => {
  const [deletedProductList, setDeletedProductList] = useState<Product[]>([]);
  const [totalDeletedProducts, setTotalDeletedProducts] = useState(0);
  const [currentDeletedPage, setCurrentDeletedPage] = useState(1);
  const { setLoading } = useAppState();

  const getDeletedProductList = async (params: GetProductListParams = {}) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.status) queryParams.append('status', params.status);
      if (params.categoryId) queryParams.append('categoryId', params.categoryId);
      if (params.listingType) queryParams.append('listingType', params.listingType);
      if (params.referralCodeId) queryParams.append('referralCodeId', params.referralCodeId);

      const response = await globalRequest(`${apiRoutes.deletedProducts}?${queryParams}`, 'get');
      
      if (response.success) {
        setDeletedProductList(response.data?.products || response.products || []);
        setTotalDeletedProducts(response.data?.total || response.total || 0);
        setCurrentDeletedPage(response.data?.currentPage || response.currentPage || 1);
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching deleted products:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    deletedProductList,
    totalDeletedProducts,
    currentDeletedPage,
    getDeletedProductList,
  };
};