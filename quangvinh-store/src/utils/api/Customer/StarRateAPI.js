import axios from "axios";

export const createProductFeedback = async (data) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/star-rate`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Đã có lỗi xảy ra" };
    }
};
