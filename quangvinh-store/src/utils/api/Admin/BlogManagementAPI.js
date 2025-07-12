// src/api/BlogManagementAPI.js
import axios from "axios";

const BASE_URL = "http://localhost:9999/staff/blog";

export const BlogManagementAPI = {
    getAll: () => axios.get(BASE_URL),
    getById: (id) => axios.get(`${BASE_URL}/${id}`),
    create: (blogInputData, blogImages) => {
        const formData = new FormData();
        formData.append("blogInputData", JSON.stringify(blogInputData));
        blogImages.forEach((image) => {
            formData.append("blogImages", image);
        });

        return axios.post(BASE_URL, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },
};
