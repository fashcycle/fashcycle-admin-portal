import { useState } from 'react';
import globalRequest from '../services/globalRequest';
import { useAppState } from '../contexts/AppStateContext';
import apiRoutes from '../utils/apiRoutes';

// Type definitions
interface CategoryFeeSetting {
  id: string;
  categoryId: string;
  rentPercent3Days: number;
  rentPercent7Days: number;
  rentPercent14Days: number;
  securityPercent: number;
  conveniencePercent: number;
  sellingPercent: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  rentPercent1Day?: number;
}

interface Category {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'deleted';
  slug: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
  isEvent?: boolean;
  minOriginalPurchasePrice?: number;
  CategoryFeeSetting?: CategoryFeeSetting[];
}

interface CategoryListResponse {
  categories: Category[];
  totalItems: number;
  page: number;
  limit: number;
}

interface GetCategoryListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

interface CreateCategoryData {
  name: string;
  slug: string;
  status: 'active' | 'inactive';
  image?: File;
  rentPercent3Days: number;
  rentPercent7Days: number;
  rentPercent14Days: number;
  securityPercent: number;
  conveniencePercent: number;
  sellingPercent: number;
}

interface UpdateCategoryData {
  name?: string;
  status?: 'active' | 'inactive' | 'deleted';
  image?: File;
  rentPercent3Days?: number;
  rentPercent7Days?: number;
  rentPercent14Days?: number;
  securityPercent?: number;
  conveniencePercent?: number;
  sellingPercent?: number;
}

export const useCategory = () => {
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [categoryDetail, setCategoryDetail] = useState<Category | null>(null);
  const [totalCategories, setTotalCategories] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const { setLoading } = useAppState();

  const getCategoryList = async (params: GetCategoryListParams = {}) => {
    try {
      setLoading(true);
      const response = await globalRequest(
        apiRoutes.categoryList,
        'get',
        {},
        {
          params: {
            page: params.page || 1,
            limit: params.limit || 10,
            search: params.search || '',
            status: params.status || null,
          }
        }
      );
      const data: CategoryListResponse = response;
      setCategoryList(data.categories);
      setTotalCategories(data.totalItems);
      setCurrentPage(data.page);
      return data;
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getCategoryDetail = async (categoryId: string) => {
    if (!categoryId) return null;

    try {
      setLoading(true);
      const response = await globalRequest(
        apiRoutes.categoryDetail(categoryId),
        'get'
      );
      setCategoryDetail(response.category);
      return response;
    } catch (error) {
      console.error('Failed to fetch category details:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (categoryData: CreateCategoryData | FormData) => {
    try {
      setLoading(true);
      const response = await globalRequest(
        apiRoutes.categoryCreate,
        'post',
        categoryData
      );
      return response;
    } catch (error) {
      console.error('Failed to create category:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (categoryId: string, categoryData: UpdateCategoryData | FormData) => {
    try {
      setLoading(true);
      const response = await globalRequest(
        apiRoutes.categoryDetail(categoryId),
        'put',
        categoryData
      );
      return response;
    } catch (error) {
      console.error('Failed to update category:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateCategoryStatus = async (categoryId: string, status: string) => {
    try {
      setLoading(true);
      console.log(status);
      const response = await globalRequest(
        apiRoutes.categoryStatusUpdate(categoryId),
        'put',
        { status }
      );
      return response;
    } catch (error) {
      console.error('Failed to update category status:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (categoryId: string) => {
    try {
      setLoading(true);
      const response = await globalRequest(
        apiRoutes.categoryDetail(categoryId),
        'put',
        { status: 'deleted' }
      );
      return response;
    } catch (error) {
      console.error('Failed to delete category:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    categoryList,
    categoryDetail,
    totalCategories,
    currentPage,
    getCategoryList,
    getCategoryDetail,
    createCategory,
    updateCategory,
    updateCategoryStatus,
    deleteCategory,
  };
};

export type { Category, CategoryFeeSetting };