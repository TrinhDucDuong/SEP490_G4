import { useState } from "react";
import {createProductFeedback} from "../../utils/api/Customer/StarRateAPI.js";


const useCreateProductFeedback = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const submitFeedback = async (data) => {
        setLoading(true);
        setError(null);
        try {
            await createProductFeedback(data);
            setSuccess(true);
        } catch (err) {
            setError(err.message || "Lỗi không xác định");
        } finally {
            setLoading(false);
        }
    };

    return { submitFeedback, loading, error, success };
};

export default useCreateProductFeedback;
