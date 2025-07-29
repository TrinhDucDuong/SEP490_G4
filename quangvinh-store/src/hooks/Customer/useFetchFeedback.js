import { useEffect, useState } from "react";
import {FeedbackAPI} from "../../utils/api/Customer/FeedbackAPI.js";


export default function useFetchFeedback() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        FeedbackAPI.fetchAll()
            .then(data => setFeedbacks(data))
            .catch(error => console.error("Error fetching feedback:", error))
            .finally(() => setLoading(false));
    }, []);

    return { feedbacks, loading };
}
