// src/utils/constants/InstructionConstants.js

// Instruction Sort Options
export const INSTRUCTION_SORT_OPTIONS = [
    { key: 'instructionName', label: 'Tên hướng dẫn', type: 'string' },
    { key: 'instructionId', label: 'ID hướng dẫn', type: 'number' },
    { key: 'createdAt', label: 'Ngày tạo', type: 'date' }
];

// Helper Functions
export const INSTRUCTION_HELPERS = {
    formatDate: (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    validateInstructionData: (instructionData) => {
        const errors = [];

        if (!instructionData.instructionName || instructionData.instructionName.trim() === '') {
            errors.push('Tên hướng dẫn không được để trống');
        }

        if (instructionData.instructionName && instructionData.instructionName.length > 100) {
            errors.push('Tên hướng dẫn không được vượt quá 100 ký tự');
        }

        if (!instructionData.instructionDescription || instructionData.instructionDescription.trim() === '') {
            errors.push('Mô tả hướng dẫn không được để trống');
        }

        if (instructionData.instructionDescription && instructionData.instructionDescription.length > 1000) {
            errors.push('Mô tả hướng dẫn không được vượt quá 1000 ký tự');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }
};

// Default values
export const INSTRUCTION_DEFAULTS = {
    NEW_INSTRUCTION: {
        instructionName: '',
        instructionDescription: ''
    },
    DEFAULT_INSTRUCTION: {
        instructionId: null,
        instructionName: '',
        instructionDescription: '',
        isActive: true,
        createdAt: null
    }
};

// Error Messages
export const INSTRUCTION_ERROR_MESSAGES = {
    INSTRUCTION_NAME_REQUIRED: 'Tên hướng dẫn không được để trống',
    INSTRUCTION_NAME_TOO_LONG: 'Tên hướng dẫn không được vượt quá 100 ký tự',
    INSTRUCTION_DESCRIPTION_REQUIRED: 'Mô tả hướng dẫn không được để trống',
    INSTRUCTION_DESCRIPTION_TOO_LONG: 'Mô tả hướng dẫn không được vượt quá 1000 ký tự',
    NETWORK_ERROR: 'Có lỗi xảy ra khi kết nối với server',
    UNKNOWN_ERROR: 'Có lỗi không xác định xảy ra'
};

// Filter Options
export const INSTRUCTION_FILTER_OPTIONS = {
    DATE_PRESETS: [
        { value: 'today', label: 'Hôm nay' },
        { value: 'yesterday', label: 'Hôm qua' },
        { value: 'last7days', label: '7 ngày qua' },
        { value: 'last30days', label: '30 ngày qua' },
        { value: 'last3months', label: '3 tháng qua' },
        { value: 'custom', label: 'Tùy chỉnh' }
    ]
};

// API Response Status
export const API_STATUS = {
    SUCCESS: 'success',
    ERROR: 'error',
    LOADING: 'loading'
};

// Modal Sizes
export const MODAL_SIZES = {
    SMALL: 'sm',
    MEDIUM: 'md',
    LARGE: 'lg',
    EXTRA_LARGE: 'xl'
};
