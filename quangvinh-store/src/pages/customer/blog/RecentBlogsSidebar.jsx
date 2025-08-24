import { Link } from "react-router-dom";

/**
 * Component RecentBlogsSidebar hiển thị danh sách các bài viết gần đây.
 *
 * @author ngothangwork
 * @component
 *
 * @param {Object} props - Props truyền vào component
 * @param {Array<Object>} props.blogs - Danh sách bài viết gần đây
 * @param {number|string} props.blogs[].blogId - ID của bài viết
 * @param {string} props.blogs[].blogTitle - Tiêu đề bài viết
 * @param {string} props.blogs[].createdAt - Ngày tạo bài viết (ISO string)
 *
 * @returns {JSX.Element} Giao diện danh sách bài viết gần đây
 */

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
