import Carousel from '../components/ui/Carousel';
import ProductCard from '../components/ui/ProductCard';
import { useFetchProducts } from '../hooks/useFetch';

function Home() {
    const { products, loading, error } = useFetchProducts();
    if (loading) return <div className="text-center my-6">Loading...</div>;
    if (error) return <div className="text-center my-6 text-red-500">Error: {error}</div>;
    return (
        <div className="bg-black text-white">
            <Carousel />
            <h2 className="text-2xl font-bold my-6">Featured Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
                {products.map((product) => (
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