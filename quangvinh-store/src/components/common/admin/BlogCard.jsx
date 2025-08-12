import React from 'react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const BlogCard = ({ blog }) => {
    return (
        <Link to={`/admin/blogs/${blog.blogId}`} key={blog.blogId}>
            <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-4 flex flex-col cursor-pointer">
                {blog.blogImages.length > 0 && (
                    <img
                        src={blog.blogImages[0].imageUrl}
                        alt="Blog"
                        className="h-48 w-full object-cover rounded-xl mb-3"
                    />
                )}
                <h2 className="text-xl font-semibold mb-2">{blog.blogTitle}</h2>
                <div
                    className="prose max-w-none text-gray-600 text-sm line-clamp-4"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                ></div>
                <div className="mt-4 text-sm text-gray-500">
                    <div>Người tạo: <span className="font-medium">{blog.createdBy.username}</span></div>
                    <div>Ngày tạo: {format(new Date(blog.createdAt), 'dd/MM/yyyy')}</div>
                </div>
            </div>
        </Link>
    );
};

export default BlogCard;
