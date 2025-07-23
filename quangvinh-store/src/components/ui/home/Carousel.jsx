import { useFetchBanners } from "../../../hooks/Customer/useFetchBanners.js";
import { useRef, useState, useEffect } from "react";
import bannerDefault from "../../../assets/images/meobanner.png";

function Carousel() {
    const { banners, loading, error } = useFetchBanners();
    const containerRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (currentIndex >= banners.length) setCurrentIndex(0);
    }, [banners.length, currentIndex]);

    const scrollToSlide = (index) => {
        if (index === currentIndex) return;
        const el = document.getElementById(`slide-${index}`);
        if (el) {
            el.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
            setCurrentIndex(index);
        }
    };

    if (loading) return <div className="text-center py-10">Đang tải banner...</div>;
    if (error) return <div className="text-center text-red-500 py-10">Lỗi: {error}</div>;
    if (!banners.length) {
        return (
            <div className="w-full flex justify-center items-center">
                <img src={bannerDefault} alt="Banner mặc định" className="w-full h-[500px] object-cover" />
            </div>
        );
    }

    return (
        <div className="w-full flex justify-center items-center">
            <div className="relative w-full overflow-hidden shadow-lg">
                <div
                    ref={containerRef}
                    className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide"
                >
                    {banners.map((banner, index) => (
                        <img
                            key={index}
                            src={banner.imageUrl}
                            alt={`Banner ${index + 1}`}
                            id={`slide-${index}`}
                            className="flex-shrink-0 w-full h-[500px] object-cover snap-start"
                            onError={e => {
                                e.target.onerror = null;
                                e.target.src = bannerDefault;
                            }}
                        />
                    ))}
                </div>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                    {banners.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => scrollToSlide(index)}
                            className={`w-3 h-3 rounded-full ${
                                currentIndex === index ? "bg-white" : "bg-white/70"
                            } hover:bg-white transition duration-200`}
                            aria-label={`Chuyển đến slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Carousel;