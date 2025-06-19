import { useFetchCategories } from "../../hooks/useFetch.js";

function CategoryDropDown() {
    const { categories, loading: categoriesLoading, error: categoriesError } = useFetchCategories();

    if (categoriesLoading) {
        return (
            <div className="w-full">
                <select className="w-full p-2 border rounded-md bg-gray-100 text-gray-500" disabled>
                    <option>Đang tải danh mục...</option>
                </select>
            </div>
        );
    }

    if (categoriesError) {
        return (
            <div className="w-full">
                <select className="w-full p-2 border rounded-md bg-gray-100 text-gray-500" disabled>
                    <option>Lỗi tải danh mục</option>
                </select>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div>
                {categories &&
                    categories.map((category) => (
                        <div key={category.id || category} value={category.id || category} className="p-2 border rounded-md bg-gray-100 text-gray-500">
                            {category.name || category}
                        </div>
                    ))}
            </div>
        </div>
    );
}

export default CategoryDropDown;