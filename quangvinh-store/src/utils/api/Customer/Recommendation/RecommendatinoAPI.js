export const RecommendationAPI = {
    getRecommendedProducts: async () => {
        try {
            const response = await fetch('http://localhost:9999/recommendation/cache', {
                method: 'POST',
                headers: {
                    'Accept': '*/*'
                },
                body: ''
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Error fetching recommended products:", error);
            throw error;
        }
    }
};
