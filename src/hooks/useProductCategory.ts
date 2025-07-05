import { useState } from 'react';
import globalRequest from '../services/globalRequest';
import { useAppState } from '../contexts/AppStateContext';
import apiRoutes from '../utils/apiRoutes';

interface Category {
    id: string;
    name: string;
    description: string;
    image: string;
    status: 'active' | 'inactive';
    parentId: string | null;
    slug: string;
    sortOrder: number;
    createdAt: string;
    updatedAt: string;
    [key: string]: any;
}

interface CategoryListResponse {
    categories: Category[];
    totalItems: number;
    page: number;
    limit: number;
}

interface CategoryDetail {
    id: string;
    name: string;
    description: string;
    [key: string]: any;
}

interface CategoryDetailResponse {
    category: CategoryDetail;
}

interface GetCategoryListParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    parentId?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

interface AllCategory {
    categories: Category[]
}

export const useCategory = () => {
    const [allCategories, setAllCategories] = useState<Category[]>([]);
    const [categoryList, setCategoryList] = useState<Category[]>([]);
    const [categoryDetail, setCategoryDetail] = useState<CategoryDetail | null>(null);
    const [totalCategories, setTotalCategories] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const { setLoading } = useAppState();

    const getAllCategories = async () => {
        try {
            setLoading(true);
            const response = await globalRequest(
                apiRoutes.allCategoryList,
                'get',
                {},
                {}
            );
            const data: AllCategory = response;
            setAllCategories(data.categories);
            return data;
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

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
                        parentId: params.parentId || null,
                        sortBy: params.sortBy || 'name',
                        sortOrder: params.sortOrder || 'asc'
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

            let category = response?.category;

            const categoryDetailData = {
                id: category.id,
                name: category.name,
                description: category.description || '',
                image: category.image || '',
                status: category.status,
                parentId: category.parentId,
                slug: category.slug,
                sortOrder: category.sortOrder || 0,
                createdAt: category.createdAt,
                updatedAt: category.updatedAt,
                children: category.children || [],
                parent: category.parent || null,
                stats: {
                    totalProducts: category.stats?.totalProducts || 0,
                    activeProducts: category.stats?.activeProducts || 0
                }
            };

            const data: CategoryDetailResponse = { category: categoryDetailData };
            setCategoryDetail(categoryDetailData);
            return data.category;
        } catch (error) {
            console.error('Failed to fetch category details:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };



    return {
        // State
        categoryList,
        categoryDetail,
        totalCategories,
        currentPage,
        allCategories,

        // Functions
        getCategoryList,
        getCategoryDetail,
        getAllCategories
    };
};
