function ProductCard({ product }) {
    return (
        <div className="border rounded-lg p-4 shadow hover:shadow-lg transition">
            <img
                src={product.image || '/assets/images/placeholder.jpg'}
                alt={product.name}
                className="w-full h-48 object-cover mb-2"
            />
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-gray-600">${product.price}</p>
            <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Add to Cart
            </button>
        </div>
    );
}

export default ProductCard;