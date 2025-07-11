import { useEffect, useState } from 'react';
import axios from 'axios';

const useAddressData = () => {
    const [provinces, setProvinces] = useState([]);

    useEffect(() => {
        const fetchAddress = async () => {
            try {
                const response = await axios.get('https://api.luat.ai/administrative');
                const filtered = response.data.filter(p => p.type === 'new');
                setProvinces(filtered);
            } catch (err) {
                console.error('Lỗi khi lấy địa chỉ:', err);
            }
        };

        fetchAddress();
    }, []);

    return provinces;
};

export default useAddressData;
