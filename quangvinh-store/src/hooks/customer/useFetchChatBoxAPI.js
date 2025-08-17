import { useState } from "react";
import {sendChatMessage} from "../../utils/api/Customer/ChatBotAPI.js";


export const useFetchChatBoxAPI = () => {
    const [loading, setLoading] = useState(false);

    const handleSendToBot = async (question) => {
        setLoading(true);
        const answer = await sendChatMessage(question);
        setLoading(false);
        return answer;
    };

    return {
        handleSendToBot,
        loading,
    };
};
