import axios from "axios";

const BASE_URL = "http://localhost:9999/staff/blog";

const getToken = () => {
    return localStorage.getItem("adminAuthToken") || sessionStorage.getItem("adminAuthToken") || "";
};

const authHeaders = () => ({
    Authorization: `Bearer ${getToken()}`,
});

export const BlogManagementAPI = {
    getAll: () => axios.get(BASE_URL, { headers: authHeaders() }),

    getById: (id) => axios.get(`${BASE_URL}/${id}`, { headers: authHeaders() }),

    create: (formData) =>
        axios.post(BASE_URL, formData, {
            headers: {
                ...authHeaders(),
                "Content-Type": "multipart/form-data",
            },
        }),

    update: (id, formData) =>
        axios.put(`${BASE_URL}/${id}`, formData, {
            headers: {
                ...authHeaders(),
                "Content-Type": "multipart/form-data",
            },
        }),

    delete: (id) => axios.delete(`${BASE_URL}/${id}`, { headers: authHeaders() }),
};