import { useCallback } from 'react';

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/action-log`;

export const useActionLogger = () => {
    // Hàm logAction dùng để ghi lại hành động của người dùng
    // actionType: loại hành động (ví dụ: 'VIEW', 'CLICK', 'PURCHASE'...)
    // referenceId: id của đối tượng liên quan (ví dụ: productId)
    const logAction = useCallback(async (actionType, referenceId) => {
        // Nếu action là VIEW thì tham chiếu đến PRODUCT,
        // ngược lại thì coi là PRODUCT_VARIANT
        const referenceType = actionType === 'VIEW' ? 'PRODUCT' : 'PRODUCT_VARIANT';

        // Lấy token từ localStorage
        const token = localStorage.getItem('token');

        // Nếu chưa đăng nhập (không có token) thì bỏ qua
        if (!token) return;

        try {
            await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // xác thực người dùng
                },
                body: JSON.stringify({
                    actionType,     // loại hành động (VIEW, CLICK…)
                    referenceId,    // id của sản phẩm hoặc biến thể
                    referenceType   // PRODUCT hoặc PRODUCT_VARIANT
                }),
                credentials: 'include' // gửi kèm cookies nếu có
            });
        } catch (err) {
            console.error('Failed to log action:', err);
        }
    }, []);

    // Trả về hàm logAction để component khác có thể gọi
    return { logAction };
};
