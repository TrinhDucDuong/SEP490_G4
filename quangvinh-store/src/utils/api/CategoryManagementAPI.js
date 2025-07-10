const API_BASE_URL = 'http://localhost:9999/staff/category';

// Helper function to create headers with auth token
const createAuthHeaders = () => {
    const token = localStorage.getItem('token'); // Hoặc sessionStorage
    return token ? { Authorization: `Bearer ${token}`, 'accept': '*/*' } : { 'accept': '*/*' };
};

export const CategoryManagementAPI = {
    // GET all categories
    getAllCategories: async () => {
        try {
            const response = await fetch(API_BASE_URL, {
                method: 'GET',
                headers: createAuthHeaders(),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.categories || [];
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    },

    // GET category by ID
    getCategoryById: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'GET',
                headers: createAuthHeaders(),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.category;
        } catch (error) {
            console.error('Error fetching category:', error);
            throw error;
        }
    },

    // POST create new category
    createCategory: async (categoryData, imageFile) => {
        try {
            const formData = new FormData();
            // Add category data as JSON string
            formData.append('categoryInputData', JSON.stringify({
                categoryName: categoryData.categoryName,
                parentCategoryId: categoryData.parentCategoryId
            }));
            // Add image file if provided
            if (imageFile) {
                formData.append('categoryImages', imageFile);
            }
            const headers = createAuthHeaders();
            // Don't set Content-Type for FormData - let browser set it automatically
            delete headers['Content-Type'];
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: headers,
                body: formData,
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.category;
        } catch (error) {
            console.error('Error creating category:', error);
            throw error;
        }
    },

    // PUT update category
    updateCategory: async (id, categoryData, imageFile) => {
        try {
            const formData = new FormData();
            // Add category data as JSON string
            formData.append('categoryInputData', JSON.stringify({
                categoryName: categoryData.categoryName,
                parentCategoryId: categoryData.parentCategoryId
            }));
            // Add image file if provided
            if (imageFile) {
                formData.append('categoryImages', imageFile);
            }
            const headers = createAuthHeaders();
            // Don't set Content-Type for FormData - let browser set it automatically
            delete headers['Content-Type'];
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'PUT',
                headers: headers,
                body: formData,
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.category;
        } catch (error) {
            console.error('Error updating category:', error);
            throw error;
        }
    },

    // DELETE category (soft delete - change isActive to false)
    deleteCategory: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'DELETE',
                headers: createAuthHeaders(),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.category;
        } catch (error) {
            console.error('Error deleting category:', error);
            throw error;
        }
    },

    // PUT reactivate category (change isActive to true)
    reactivateCategory: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}/reactivate`, {
                method: 'PUT',
                headers: createAuthHeaders(),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.category;
        } catch (error) {
            console.error('Error reactivating category:', error);
            throw error;
        }
    }
};
