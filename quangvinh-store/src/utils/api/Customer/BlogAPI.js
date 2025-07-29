export const fetchBlog = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/blog`);
    if (!response.ok) {
        throw new Error('Failed to fetch Blog');
    }
    return await response.json();
};

export const fetchBlogById = async (id) => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/blog/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch Blog');
    }
    return await response.json();
}