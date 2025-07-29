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

        if (!storeData.storePhone || storeData.storePhone.trim() === '')
            errors.push('Số điện thoại không được để trống');

        if (!storeData.city || storeData.city.trim() === '')
            errors.push('Thành phố không được để trống');

        if (!storeData.district || storeData.district.trim() === '')
            errors.push('Phường/Quận không được để trống');

        if (!storeData.startWorkingAt || storeData.startWorkingAt.trim() === '')
            errors.push('Giờ mở cửa không được để trống');

        if (!storeData.endWorkingAt || storeData.endWorkingAt.trim() === '')
            errors.push('Giờ đóng cửa không được để trống');

        if (!storeData.locationLat || !storeData.locationLng)
            errors.push('Vui lòng chọn vị trí trên bản đồ');

        return { isValid: errors.length === 0, errors };
    },

    formatTime: (timeString) => {
        if (!timeString) return '';
        // Convert "07:00:00" to "07:00" for display
        return timeString.substring(0, 5);
    },

    parseTime: (timeString) => {
        if (!timeString) return '';
        // Ensure format is HH:MM for API
        if (timeString.length === 5) return timeString;
        return timeString.substring(0, 5);
    }
};

export const STORE_DEFAULTS = {
    NEW_STORE: {
        storeName: '',
        storeAddress: '',
        storePhone: '',
        city: '',
        district: '',
        startWorkingAt: '',
        endWorkingAt: '',
        locationLat: '',
        locationLng: ''
    }
};

export const STORE_SORT_OPTIONS = [
    { key: 'storeName', label: 'Tên cửa hàng', type: 'string' },
    { key: 'storeId', label: 'ID cửa hàng', type: 'number' },
    { key: 'storePhone', label: 'Số điện thoại', type: 'string' },
    { key: 'city', label: 'Thành phố', type: 'string' }
];
