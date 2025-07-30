export const StoreAPI = {
    fetchStores: async () => {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/store`);
        if (!response.ok) {
            throw new Error("Failed to fetch stores");
        }
        const data = await response.json();
        console.log(data);
        return data.stores || [];
    }
};
