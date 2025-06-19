import Carousel from '../../components/ui/Carousel.jsx';
import ProductCard from '../../components/ui/ProductCard.jsx';
import { useFetchLandingProducts } from '../../hooks/useFetchLandingProducts';
import banner from '../../assets/images/meobanner.png';

function Home() {
    const { products, topSellingProducts, loading, error } = useFetchLandingProducts();

    if (loading) return <div className="text-center my-6">Loading...</div>;
    if (error) return <div className="text-center my-6 text-red-500">Error: {error}</div>;

    return (
        <div className="bg-[#F2F2EE] text-black">
            <Carousel />

            <h2 className="text-2xl ml-8 font-bold my-6">Tất cả sản phẩm</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
                {products.slice(0, 4).map((product, index) => (
                    <ProductCard
                        key={index}
                        product={{
                            name: product.productName,
                            price: product.unitPrice,
                            image: product.productImages[0] || '',
                            images: product.productImages,
                            rating: null,
                            reviews: [],
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
                {topSellingProducts.slice(0, 4).map((item, index) => (
                    <ProductCard
                        key={index}
                        product={{
                            name: item.product.productName,
                            price: item.product.unitPrice,
                            image: item.product.productImages[0] || '',
                            images: item.product.productImages,
                            rating: item.starRate,
                            reviews: [],
                        }}
                    />
                ))}
            </div>
        </div>
    );
}

export default Home;