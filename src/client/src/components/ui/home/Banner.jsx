import { Link } from "react-router-dom";
import banner from "../../../assets/images/banner.png";
function Banner({ item, link = "/" }) {
    if (!item) return null;

    const title = item.title;
    const imageUrl = item.imageUrl || banner;

    return (
        <div className="relative group w-full h-[550px] overflow-hidden rounded-2xl shadow-lg">
            <Link to={link} className="block w-full h-full" title={title}>
                <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <h2 className="text-white text-4xl font-bold drop-shadow-lg text-center px-4">
                        {title}
                    </h2>
                </div>
            </Link>
        </div>
    );
}


export default Banner;
