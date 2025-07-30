const API_BASE_URL = 'http://localhost:9999/admin/staff';

// Function để lấy token xác thực
const getAuthToken = () => {
    const token = localStorage.getItem('adminAuthToken') ||
        sessionStorage.getItem('adminAuthToken') ||
        localStorage.getItem('authToken') ||
        localStorage.getItem('accessToken') ||
        localStorage.getItem('token') ||
        sessionStorage.getItem('authToken') ||
        sessionStorage.getItem('accessToken') ||
        sessionStorage.getItem('token');

    console.log('🔑 Getting Bearer Token:', token ? 'Token found' : 'No token found');
    if (token) {
        console.log('🔑 Token preview:', token.substring(0, 20) + '...');
    }

    return token;
};

// Function để tạo headers với Bearer Token
const createAuthHeaders = (additionalHeaders = {}) => {
    const token = getAuthToken();
    const headers = {
        'accept': '*/*',
        'Content-Type': 'application/json',
        ...additionalHeaders
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        console.log('✅ Bearer Token added to headers');
    } else {
        console.warn('⚠️ No Bearer Token found');
    }

    return headers;
};

// Function xử lý lỗi authentication
const handleAuthError = (response) => {
    if (response.status === 401 || response.status === 403) {
        console.error('🚫 Bearer Token expired or invalid');
        // Clear all possible token keys
        localStorage.removeItem('adminAuthToken');
        sessionStorage.removeItem('adminAuthToken');
        localStorage.removeItem('authToken');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('token');
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('token');
        localStorage.removeItem('adminUserInfo');
        sessionStorage.removeItem('adminUserInfo');
        throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    }
};

// GET - Lấy tất cả nhân viên
export const getAllEmployees = async (pageNumber = 0, pageSize = 100) => {
    try {
        const response = await fetch(`${API_BASE_URL}?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
            method: 'GET',
            headers: createAuthHeaders()
        });

        handleAuthError(response);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return { success: true, data: data.staffAccounts };
    } catch (error) {
        console.error('Error fetching employees:', error);
        return { success: false, error: error.message };
    }
};

// GET - Lấy nhân viên theo ID
export const getEmployeeById = async (employeeId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${employeeId}`, {
            method: 'GET',
            headers: createAuthHeaders()
        });

        handleAuthError(response);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return { success: true, data: data.staffAccount };
    } catch (error) {
        console.error('Error fetching employee:', error);
        return { success: false, error: error.message };
    }
};

// POST - Tạo nhân viên mới
export const createEmployee = async (employeeData) => {
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: createAuthHeaders(),
            body: JSON.stringify({
                username: employeeData.username,
                password: employeeData.password,
                phoneNumber: employeeData.phoneNumber,
                firstName: employeeData.firstName,
                lastName: employeeData.lastName,
                workingAtStoreId: employeeData.workingAtStoreId
            })
        });

        handleAuthError(response);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Create employee error:', {
                status: response.status,
                statusText: response.statusText,
                body: errorText
            });
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        return { success: true, data: data.staffAccount };
    } catch (error) {
        console.error('Error creating employee:', error);
        return { success: false, error: error.message };
    }
};

// DELETE - Xóa mềm nhân viên (chuyển trạng thái thành "Ngừng hoạt động")
export const deleteEmployee = async (employeeId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${employeeId}`, {
            method: 'DELETE',
            headers: createAuthHeaders()
        });

        handleAuthError(response);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Delete employee error:', {
                status: response.status,
                statusText: response.statusText,
                body: errorText
            });
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        return { success: true, message: 'Nhân viên đã được chuyển sang trạng thái ngừng hoạt động' };
    } catch (error) {
        console.error('Error deleting employee:', error);
        return { success: false, error: error.message };
    }
};

// PATCH - Kích hoạt lại nhân viên
export const activateEmployee = async (employeeId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${employeeId}`, {
            method: 'PATCH',
            headers: createAuthHeaders()
        });

        handleAuthError(response);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Activate employee error:', {
                status: response.status,
                statusText: response.statusText,
                body: errorText
            });
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        return { success: true, message: 'Nhân viên đã được kích hoạt lại' };
    } catch (error) {
        console.error('Error activating employee:', error);
        return { success: false, error: error.message };
    }
};
