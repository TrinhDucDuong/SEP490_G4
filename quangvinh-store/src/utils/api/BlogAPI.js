export const fetchBlog = async () => {
    const response = await fetch('http://localhost:9999/blog');
    if (!response.ok) {
        throw new Error('Failed to fetch Blog');
    }
    return await response.json();
};

export const fetchBlogById = async (id) => {
    const response = await fetch(`http://localhost:9999/blog/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch Blog');
    }
    return await response.json();
}