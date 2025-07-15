export const STORE_STATUS_OPTIONS = [
    { value: true, label: 'Đang hoạt động', color: 'green' },
    { value: false, label: 'Ngừng hoạt động', color: 'red' }
];

export const STORE_HELPERS = {
    getStatusText: (isActive) => isActive ? 'Đang hoạt động' : 'Ngừng hoạt động',
    getStatusColorClass: (isActive) =>
        isActive
            ? 'bg-green-100 text-green-800 border border-green-200'
            : 'bg-red-100 text-red-800 border border-red-200',
    validateStoreData: (storeData) => {
        const errors = [];
        if (!storeData.storeName || storeData.storeName.trim() === '')
            errors.push('Tên cửa hàng không được để trống');
        if (storeData.storeName && storeData.storeName.length > 100)
            errors.push('Tên cửa hàng không được vượt quá 100 ký tự');
        if (!storeData.storeAddress || storeData.storeAddress.trim() === '')
            errors.push('Địa chỉ cửa hàng không được để trống');
        return { isValid: errors.length === 0, errors };
    }
};

export const STORE_DEFAULTS = {
    NEW_STORE: { storeName: '', storeAddress: '' }
};

export const STORE_SORT_OPTIONS = [
    { key: 'storeName', label: 'Tên cửa hàng', type: 'string' },
    { key: 'storeId', label: 'ID cửa hàng', type: 'number' }
];
