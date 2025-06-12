import Carousel from '../components/ui/Carousel';
import ProductCard from '../components/ui/ProductCard';
import { useFetchProducts } from '../hooks/useFetch';
import { useMemo } from 'react';
import banner from '../assets/images/meobanner.png';

function Home() {
    const { products, loading, error } = useFetchProducts();

    const popularProducts = useMemo(() => {
        return products
            .filter(product => product.rating >= 4.5)
            .slice(0, 4);
    }, [products]);

    const bestSellingProducts = useMemo(() => {
        return products
            .sort((a, b) => (b.sales || 0) - (a.sales || 0))
            .slice(0, 4);
    }, [products]);

    if (loading) return <div className="text-center my-6">Loading...</div>;
    if (error) return <div className="text-center my-6 text-red-500">Error: {error}</div>;

    return (
        <div className="bg-[#F2F2EE] text-black">
            <Carousel />
            <h2 className="text-2xl ml-8 font-bold my-6">Popular Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
                {popularProducts.map((product) => (
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
            <h2 className="text-2xl ml-8 font-bold my-6">Best Seller</h2>
            <div className="relative w-full h-48 md:h-72 lg:h-96 bg-gray-200">
                <img
                    src={banner}
                    alt="Banner"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <h2 className="text-2xl md:text-4xl font-bold text-white text-center">
                        Best Selling Collection
                    </h2>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4 mt-6">
                {bestSellingProducts.map((product) => (
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
        </div>
    );
}

export default Home;