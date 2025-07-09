import React from "react";
import {useFetchBlogs} from "../../../hooks/useFetchBlog.js";
import NewsCard from "../../../components/ui/home/NewsCard.jsx";
import Breadcrumb from "../../../components/common/Customer/Breadcrumb.jsx";


function BlogList() {
    const {blogs, loading, error} = useFetchBlogs();

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
            <div className="container mx-auto p-4 px-28">

                <h1 className="text-3xl font-bold mb-6">Danh sách bài viết</h1>

                {loading && <p>Đang tải...</p>}
                {error && <p className="text-red-500">Lỗi: {error}</p>}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {!loading && !error && blogs.map((blog) => (
                        <NewsCard key={blog.blogId} news={blog}/>
                    ))}
                </div>
            </div>
        </>

    );
}

export default BlogList;
