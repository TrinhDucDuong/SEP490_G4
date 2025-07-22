import { useCallback } from 'react';

const API_URL = 'http://localhost:9999/action-log';

export const useActionLogger = () => {
    const logAction = useCallback(async (actionType, referenceId) => {
        const referenceType = actionType === 'VIEW' ? 'PRODUCT' : 'PRODUCT_VARIANT';
        const token = localStorage.getItem('token');

        if (!token) return;

        try {
            await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    actionType,
                    referenceId,
                    referenceType
                }),
                credentials: 'include'
            });
        } catch (err) {
            console.error('Failed to log action:', err);
        }
    }, []);

    return { logAction };
};
