import { Link } from "react-router-dom";

function RecentBlogsSidebar({ blogs }) {
    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Bài viết gần đây</h2>
            <ul className="space-y-4">
                {blogs.map((item) => (
                    <li key={item.blogId} className="border-b pb-2">
                        <Link
                            to={`/blog/${item.blogId}`}
                            className="text-blue-600 hover:underline font-medium"
                        >
                            {item.blogTitle}
                        </Link>
                        <p className="text-sm text-gray-500">
                            {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default RecentBlogsSidebar;
