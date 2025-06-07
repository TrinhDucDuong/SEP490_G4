import banner from '../../assets/images/banner.png';

function Carousel() {
    return (
        <div className="relative w-full h-48 md:h-72 lg:h-96 bg-gray-200">
            <img
                src={banner}
                alt="Banner"
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
                <h2 className="text-2xl md:text-4xl font-bold text-white text-center">Welcome to QuangVinh Store!</h2>
            </div>
        </div>
    );
}

export default Carousel;