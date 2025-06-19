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
  category: string;
  image: string;
  stock: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

interface ProductListResponse {
  products: Product[];
  totalItems: number;
  page: number;
  limit: number;
}

interface ProductDetail {
  id: string;
  name: string;
  category: string;
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
  contactNumber: string;
}

interface GetProductListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  category?: string;
  listingType?: string;
}

interface ProductDetailToUpdate {
  id: string;
  name: string;
  mobileNumber: string;
  category: string;
  originalPurchasePrice: number;
  sizeFlexibility: string;
  color: string;
  listingType: string;
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
  const { setLoading } = useAppState();

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
            category: params.category || null,
            status: params.status || null,
            listingType: params.listingType || null,
          }
        }
      );
      const data: ProductListResponse = response;
      setProductList(data.products);
      setTotalProducts(data.totalItems);
      setCurrentPage(data.page);
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
        contactNumber: product.owner.phone,
        flexibility: product.sizeFlexibility,
        address: `${product?.address?.addressLine1}, ${product?.address?.addressLine2}, ${product?.address?.city}, ${product?.address?.state}, ${product?.address?.pincode}, ${product?.address?.country}`
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
       sizeFlexibility: product?.sizeFlexibility,
       color: product?.color,
       listingType: product?.listingType[0],
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

    // Functions
    getProductList,
    getProductDetail
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

  const updateProductStatus = async (productId: string, status: string) => {
    try {
      setLoading(true);
      const response = await globalRequest(
        apiRoutes.productUpdateStatus(productId),
        'patch',
        { status }
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

  return {
    createProduct,
    updateProduct,
    deleteProduct,
    updateProductStatus
  };
};