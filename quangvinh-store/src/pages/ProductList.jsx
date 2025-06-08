import React from 'react';
import { useFetchProducts } from '../hooks/useFetch';
import ProductCard from "../components/ui/ProductCard.jsx";
import Carousel from "../components/ui/Carousel.jsx";

const ProductList = () => {
    const { products, loading, error } = useFetchProducts();

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <>
            <div>
                <Carousel />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mx-3">
                {products.map(product => (
                    <ProductCard
                        key={product.id}
                        product={{
                            id: product.id,
                            name: product.title,
                            price: product.price,
                            image: product.thumbnail,
                            images: product.images,
                            rating: product.rating,
                            reviews: product.reviews,
                        }}
                    />

                ))}
            </div>
        </>

    );
};

export default ProductList;