import { Link } from "react-router-dom";
import Slider from "react-slick";
import Logodefault from '../../../assets/images/logodefault.png';

const BrandSlider = ({ brands = [] }) => {
    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: { slidesToShow: 4 }
            },
            {
                breakpoint: 768,
                settings: { slidesToShow: 3 }
            },
            {
                breakpoint: 480,
                settings: { slidesToShow: 2 }
            }
        ]
    };

    if (!brands.length) {
        return <div className="text-white text-center py-8">Không có thương hiệu</div>;
    }

    return (
        <div className="px-4 py-6">
            <Slider {...settings}>
                {brands.map((brand, idx) => (
                    <div key={brand.brandId || idx} className="px-2">
                        <Link
                            to={`/products?brand=${encodeURIComponent(brand.brandName)}`}
                            className="block transition-transform duration-300 hover:scale-105 rounded-xl"
                        >
                            <div className="bg-white rounded-xl flex justify-center items-center p-2 transition-colors duration-300">
                                <img
                                    src={
                                        brand.images && brand.images.length > 0
                                            ? brand.images[0].imageUrl
                                            : Logodefault
                                    }
                                    alt={brand.brandName || "Thương hiệu"}
                                    className="w-[178px] h-[86px] object-contain"
                                />
                            </div>
                        </Link>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default BrandSlider;
