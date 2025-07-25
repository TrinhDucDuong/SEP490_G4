import axios from "axios";

export const FeedbackAPI = {
    fetchAll: async () => {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/feedback`);
        return response.data.feedbacks;
    }
};
