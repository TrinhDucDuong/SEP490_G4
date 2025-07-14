import React, { useState } from "react";
import { useFetchBlogs } from "../../../hooks/Customer/useFetchBlog.js";
import NewsCard from "../../../components/ui/home/NewsCard.jsx";
import Breadcrumb from "../../../components/common/Customer/Breadcrumb.jsx";

function BlogList() {
    const { blogs, loading, error } = useFetchBlogs();

    const [filterOption, setFilterOption] = useState("all");

    const handleFilterChange = (e) => {
        setFilterOption(e.target.value);
    };

    // Hàm xử lý lọc/sắp xếp
    const getFilteredAndSortedBlogs = () => {
        if (!blogs) return [];

        let filtered = [...blogs];

        if (filterOption === "latest") {
            filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (filterOption === "oldest") {
            filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        } else if (filterOption === "last7days") {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            filtered = filtered.filter(blog => new Date(blog.createdAt) >= sevenDaysAgo);
            filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Mới nhất trước
        }

        return filtered;
    };

    const displayedBlogs = getFilteredAndSortedBlogs();

    return (
        <>
            <div>
                <Breadcrumb
                    items={[
                        { label: 'Trang chủ', to: '/' },
                        { label: 'Bài viết', to: '/blogs' },
                    ]}
                />
            </div>

            <div className="container mx-auto p-4 px-4 md:px-28">
                <h1 className="text-3xl font-bold mb-6">Danh sách bài viết</h1>

                {/* Dropdown lọc bài viết */}
                <div className="mb-6">
                    <label htmlFor="filter" className="mr-2 font-medium text-gray-700">Lọc theo:</label>
                    <select
                        id="filter"
                        value={filterOption}
                        onChange={handleFilterChange}
                        className="border rounded px-3 py-2 text-gray-700"
                    >
                        <option value="all">Tất cả</option>
                        <option value="latest">Mới nhất</option>
                        <option value="oldest">Cũ nhất</option>
                        <option value="last7days">Trong 7 ngày gần đây</option>
                    </select>
                </div>

                {/* Hiển thị trạng thái */}
                {loading && <p>Đang tải...</p>}
                {error && <p className="text-red-500">Lỗi: {error}</p>}

                {/* Danh sách blog */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {!loading && !error && displayedBlogs.length > 0 ? (
                        displayedBlogs.map((blog) => (
                            <NewsCard key={blog.blogId} news={blog} />
                        ))
                    ) : (
                        !loading && !error && (
                            <p className="text-gray-500">Không có bài viết nào phù hợp.</p>
                        )
                    )}
                </div>
            </div>
        </>
    );
}

export default BlogList;
