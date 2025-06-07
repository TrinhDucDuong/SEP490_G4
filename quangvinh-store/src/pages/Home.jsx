import Carousel from '../components/ui/Carousel';
import ProductCard from '../components/ui/ProductCard';

const mockProducts = [
    { id: 1, name: 'Product 1', price: 29.99, image: '/assets/images/product1.jpg' },
    { id: 2, name: 'Product 2', price: 49.99, image: '/assets/images/product2.jpg' },
];

function Home() {
    return (
        <div className="">
            <Carousel />
            <h2 className="text-2xl font-bold my-6">Featured Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {mockProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}

export default Home;