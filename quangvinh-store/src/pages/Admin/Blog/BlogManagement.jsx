import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useFetchBlogs } from "../../../hooks/Admin/useFetchBlogManagementAPI.js";
import BlogCard from "../../../components/common/Admin/BlogCard.jsx";

function BlogManagement() {
    const { blogs, loading } = useFetchBlogs();
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("newest");

    const filteredAndSortedBlogs = useMemo(() => {
        let filtered = blogs.filter(blog =>
            blog.blogTitle.toLowerCase().includes(searchTerm.toLowerCase())
        );

        switch (sortOption) {
            case "newest":
                filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case "oldest":
                filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                break;
            case "title-asc":
                filtered.sort((a, b) => a.blogTitle.localeCompare(b.blogTitle));
                break;
            case "title-desc":
                filtered.sort((a, b) => b.blogTitle.localeCompare(a.blogTitle));
                break;
            default:
                break;
        }

        return filtered;
    }, [blogs, searchTerm, sortOption]);

    if (loading) return <div className="p-4 text-gray-700">Đang tải dữ liệu blog...</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Quản lý bài viết</h1>
                <Link to="/admin/blogs/create"
                      className="px-2 py-1 bg-green-200 border border-green-900 text-green-900 rounded-full hover:bg-green-500 hover:text-white transition-all duration-200">
                    + Tạo bài viết
                </Link>
            </div>

            <div className="flex flex-col rounded-full md:flex-row gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tiêu đề..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-3 py-2 border rounded-full w-full md:w-1/2"
                />

                <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="px-3 py-2 border rounded-full w-full md:w-1/4"
                >
                    <option value="newest">Mới nhất</option>
                    <option value="oldest">Cũ nhất</option>
                    <option value="title-asc">Tiêu đề A → Z</option>
                    <option value="title-desc">Tiêu đề Z → A</option>
                </select>
            </div>

            {filteredAndSortedBlogs.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredAndSortedBlogs.map((blog) => (
                        <BlogCard key={blog.blogId} blog={blog} />
                    ))}
                </div>
            ) : (
                <div className="text-gray-500">Không có bài viết phù hợp.</div>
            )}
        </div>
    );
}

export default BlogManagement;
