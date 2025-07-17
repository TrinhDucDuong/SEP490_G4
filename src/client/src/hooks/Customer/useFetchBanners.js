import { useEffect, useState } from "react";
import { fetchBanner } from "../../utils/api/Customer/BannerAPI.js";

export const useFetchBanners = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadBanners = async () => {
            try {
                const data = await fetchBanner();
                setBanners(data.bannerImages || []);
            } catch (err) {
                setError(err.message || "Không thể tải banner.");
            } finally {
                setLoading(false);
            }
        };

        loadBanners();
    }, []);

    return { banners, loading, error };
};
