import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const BuyNow = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        phoneNumber: "",
        email: "",
        address: "",
        exactAddress: "",
        paymentMethod: "COD",
    });

    const [buyNowItem, setBuyNowItem] = useState(null);

    useEffect(() => {
        const item = sessionStorage.getItem("buyNowItem");
        if (item) {
            setBuyNowItem(JSON.parse(item));
        } else {
            toast.error("Không tìm thấy sản phẩm để mua ngay");
            navigate("/");
        }

        const savedForm = localStorage.getItem("buyNowFormData");
        if (savedForm) {
            setFormData(JSON.parse(savedForm));
        }
    }, [navigate]);

    useEffect(() => {
        localStorage.setItem("buyNowFormData", JSON.stringify(formData));
    }, [formData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.phoneNumber.trim()) {
            toast.error("Vui lòng nhập số điện thoại");
            return;
        }

        if (!formData.email.trim()) {
            toast.error("Vui lòng nhập email");
            return;
        }

        if (!buyNowItem) {
            toast.error("Không có sản phẩm để đặt");
            return;
        }

        const payload = {
            shippingAddressInputData: {
                shippingAddressId: null,
                name: formData.name || "guest",
                phoneNumber: formData.phoneNumber,
                address: formData.address || "",
                exactAddress: formData.exactAddress || "",
                isMain: true,
                type: "null",
            },
            listProductVariantInputData: [
                {
                    productVariantId: buyNowItem.productVariantId,
                    quantity: buyNowItem.quantity,
                },
            ],
            purchaseInputData: {
                orderId: null,
                paymentMethod: formData.paymentMethod,
            },
        };

        try {
            await axios.post("http://localhost:9999/order/guest", payload);
            toast.success("Đặt hàng thành công!");
            sessionStorage.removeItem("buyNowItem");
            navigate("/thank-you");
        } catch (error) {
            console.error(error);
            toast.error("Có lỗi khi đặt hàng");
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8">
            <h2 className="text-3xl font-bold mb-6 text-black">Mua Ngay</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Form thông tin */}
                <form
                    onSubmit={handleSubmit}
                    className="md:col-span-2 bg-white shadow-sm border border-gray-200 p-6 rounded-2xl space-y-4"
                >
                    <input
                        type="text"
                        name="name"
                        placeholder="Tên"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    <input
                        type="text"
                        name="phoneNumber"
                        placeholder="Số điện thoại *"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email *"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black"
                        required
                    />
                    <input
                        type="text"
                        name="address"
                        placeholder="Địa chỉ"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    <input
                        type="text"
                        name="exactAddress"
                        placeholder="Địa chỉ cụ thể"
                        value={formData.exactAddress}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    <div>
                        <label className="block mb-2 font-medium text-gray-700">Phương thức thanh toán</label>
                        <select
                            name="paymentMethod"
                            value={formData.paymentMethod}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black"
                        >
                            <option value="COD">Thanh toán khi nhận hàng (COD)</option>
                            <option value="VNPAY">Thanh toán qua VNPay</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="w-full px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition font-semibold"
                    >
                        Đặt hàng ngay
                    </button>
                </form>

                {/* Sản phẩm mua ngay */}
                {buyNowItem && (
                    <div className="bg-white shadow-sm border border-gray-200 p-6 rounded-2xl flex flex-col items-center">
                        <img
                            src={buyNowItem.productImage}
                            alt={buyNowItem.productName}
                            className="w-36 h-36 object-cover rounded-lg"
                        />
                        <h3 className="text-lg font-semibold mt-4 text-black text-center">
                            {buyNowItem.productName}
                        </h3>
                        <p className="text-sm text-gray-500 text-center">
                            Màu: {buyNowItem.colorHexCode} | Size: {buyNowItem.sizeCode}
                        </p>
                        <p className="text-sm text-gray-500">Số lượng: {buyNowItem.quantity}</p>
                        <p className="text-lg font-bold mt-2 text-red-600">
                            {(buyNowItem.price * buyNowItem.quantity).toLocaleString()} VND
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BuyNow;
