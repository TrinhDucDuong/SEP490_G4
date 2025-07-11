import {useEffect, useState} from "react";
import {fetchCategory} from "../../utils/api/Customer/CatgoryAPI.js";

export const useFetchCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getCategories = async () => {
            setLoading(true);
            try {
                const data = await fetchCategory();
                if (data?.categoryList) {
                    setCategories(data.categoryList);
                } else {
                    setError('Không có danh mục nào được trả về.');
                }
                // eslint-disable-next-line no-unused-vars
            } catch (err) {
                setError('Không thể tải danh mục. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };
        getCategories();
    }, []);

    return { categories, loading, error };
};
