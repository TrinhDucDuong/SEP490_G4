import { Link } from "react-router-dom";

const Breadcrumb = ({ items }) => {
    return (
        <nav className="text-sm text-gray-500 mb-4">
            <ul className="flex items-center space-x-2">
                {items.map((item, index) => (
                    <li key={index} className="flex items-center space-x-2">
                        {item.to ? (
                            <Link to={item.to} className="hover:underline">{item.label}</Link>
                        ) : (
                            <span className="text-gray-700 font-medium">{item.label}</span>
                        )}
                        {index < items.length - 1 && <span>/</span>}
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Breadcrumb;
