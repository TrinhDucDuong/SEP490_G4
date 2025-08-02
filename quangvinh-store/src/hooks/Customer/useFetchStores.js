import { useEffect, useState } from "react";
import { StoreAPI } from "../../utils/api/Customer/StoreAPI.js";

export const useFetchStores = () => {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        StoreAPI.fetchStores()
            .then((rawStores) => {
                if (!Array.isArray(rawStores)) {
                    throw new Error("Dữ liệu trả về không đúng định dạng mảng.");
                }

                const mappedStores = rawStores.map((store) => ({
                    id: store.storeId,
                    name: store.storeName || "Chưa có tên",
                    address: store.storeAddress || "Chưa có địa chỉ",
                    phone: store.storePhone || "Không có số điện thoại",
                    city: store.city || "Chưa rõ",
                    district: store.district || "Chưa rõ",
                    openingHours: `${store.startWorkingAt || "??"} - ${store.endWorkingAt || "??"}`,
                    location: {
                        lat: parseFloat(store.locationLat) || 0,
                        lng: parseFloat(store.locationLng) || 0
                    },
                    hasValidLocation: !isNaN(parseFloat(store.locationLat)) && !isNaN(parseFloat(store.locationLng))
                }));

                setStores(mappedStores);
            })
            .catch((err) => {
                console.error("Lỗi khi fetch stores:", err);
                setError(err.message);
            })
            .finally(() => setLoading(false));
    }, []);

    return { stores, loading, error };
};
