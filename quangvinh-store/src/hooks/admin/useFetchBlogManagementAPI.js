import { useEffect, useState } from "react";
import { BlogManagementAPI } from "../../utils/api/Admin/BlogManagementAPI";

export const useFetchBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        BlogManagementAPI.getAll()
            .then((res) => {
                setBlogs(res.data.blogs);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch blogs", err);
                setLoading(false);
            });
    }, []);

    return { blogs, loading };
};

export const useFetchBlogById = (blogId) => {
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!blogId) return;

        BlogManagementAPI.getById(blogId)
            .then((res) => {
                setBlog(res.data.blog);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch blog detail", err);
                setLoading(false);
            });
    }, [blogId]);

    return { blog, loading };
};
