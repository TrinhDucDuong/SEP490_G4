import { Link } from "react-router-dom";
import Slider from "react-slick";
import Logodefault from '../../../assets/images/logodefault.png';

const CategorySlider = ({ categories }) => {
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

    return (
        <div className="px-4 py-6">
            <Slider {...settings}>
                {categories.map((category, index) => (
                    <div key={index} className="px-2 ">
                        <Link
                            to={`/products?category=${encodeURIComponent(category)}`}
                            className="block transition-transform duration-300 hover:scale-105 hover: rounded-xl"
                        >
                            <div className="bg-white rounded-xl flex justify-center items-center p-2 transition-colors duration-300">
                                <img
                                    src={category === 'all' ? Logodefault : `/images/categories/${category}.png`}
                                    alt={`Logo ${category}`}
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

export default CategorySlider;
