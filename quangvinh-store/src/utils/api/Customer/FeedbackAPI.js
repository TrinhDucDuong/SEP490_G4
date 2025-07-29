import axios from "axios";

export const FeedbackAPI = {
    fetchAll: async () => {
        const response = await axios.get("http://localhost:9999/feedback");
        return response.data.feedbacks;
    }
};
