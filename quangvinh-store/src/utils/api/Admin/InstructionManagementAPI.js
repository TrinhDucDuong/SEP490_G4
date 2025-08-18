// src/utils/api/Admin/InstructionManagementAPI.js
const API_BASE_URL = 'http://localhost:9999/staff/instruction';

// Hàm helper để lấy token từ localStorage hoặc sessionStorage
const getAuthToken = () => {
    return localStorage.getItem('adminAuthToken') || sessionStorage.getItem('adminAuthToken');
};

// Hàm helper để tạo headers với Bearer token
const getAuthHeaders = () => {
    const token = getAuthToken();
    return {
        'accept': '*/*',
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

// Hàm helper để xử lý response
const handleResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
};

export const getAllInstructions = async () => {
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        const data = await handleResponse(response);
        // Lọc chỉ hiển thị những instruction có isActive = true
        const activeInstructions = data.instructions.filter(instruction => instruction.isActive);
        return { success: true, data: activeInstructions };
    } catch (error) {
        console.error('Error fetching instructions:', error);
        return { success: false, error: error.message };
    }
};

export const getInstructionById = async (instructionId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${instructionId}`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        const data = await handleResponse(response);
        return { success: true, data: data.instruction };
    } catch (error) {
        console.error('Error fetching instruction:', error);
        return { success: false, error: error.message };
    }
};

export const createInstruction = async (instructionData) => {
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                instructionName: instructionData.instructionName,
                instructionDescription: instructionData.instructionDescription
            })
        });

        const data = await handleResponse(response);
        return { success: true, data: data.instruction };
    } catch (error) {
        console.error('Error creating instruction:', error);
        return { success: false, error: error.message };
    }
};

export const updateInstruction = async (instructionId, instructionData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${instructionId}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                instructionName: instructionData.instructionName,
                instructionDescription: instructionData.instructionDescription
            })
        });

        const data = await handleResponse(response);
        return { success: true, data: data.instruction };
    } catch (error) {
        console.error('Error updating instruction:', error);
        return { success: false, error: error.message };
    }
};

export const deleteInstruction = async (instructionId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${instructionId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        const data = await handleResponse(response);
        return { success: true, data: data.instruction };
    } catch (error) {
        console.error('Error deleting instruction:', error);
        return { success: false, error: error.message };
    }
};
