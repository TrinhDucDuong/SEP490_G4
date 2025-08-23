import axios from 'axios';

// Hàm tạo header cho request có kèm Authorization (Bearer token)
// Truyền vào token của người dùng để xác thực khi gọi API
const authHeader = (token) => ({
    headers: {
        Authorization: `Bearer ${token}`, // Gắn token vào header
        'Content-Type': 'application/json', // Định dạng dữ liệu gửi đi là JSON
    }
});

// Hàm lấy danh sách địa chỉ của người dùng
// - Tham số: token (dùng để xác thực người dùng)
// - Gửi request GET đến API /addresses
// - Trả về mảng shippingAddresses từ response
export const getAddresses = async (token) => {
    const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/addresses`,
        authHeader(token)
    );
    return response.data.shippingAddresses;
};

// Hàm tạo mới một địa chỉ cho người dùng
// - Tham số: newAddress (dữ liệu địa chỉ mới), token (dùng để xác thực)
// - Gửi request POST đến API /addresses với body là newAddress
// - Trả về dữ liệu từ response (thông tin địa chỉ vừa được tạo)
export const createAddress = async (newAddress, token) => {
    const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/addresses`,
        newAddress,
        authHeader(token)
    );
    return response.data;
};
