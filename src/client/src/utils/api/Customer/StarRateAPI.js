export const fetchStarRate = async ({ productId, pageNumber = 0, pageSize = 3, numberOfStarRate }) => {
    const params = new URLSearchParams({
        productId,
        pageNumber,
        pageSize,
    });

    if (numberOfStarRate !== null && numberOfStarRate !== undefined && numberOfStarRate !== "") {
        params.append('numberOfStarRate', numberOfStarRate);
    }

    const response = await fetch(`http://localhost:9999/star-rate?${params.toString()}`);

    if (!response.ok) {
        throw new Error('Failed to fetch Star Rate');
    }

    const data = await response.json();
    return data.starRate || [];
};
