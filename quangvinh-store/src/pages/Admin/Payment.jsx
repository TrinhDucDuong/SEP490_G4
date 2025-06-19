import { useState, useEffect } from "react";
import ProductInCartCard from "../../components/ui/productInCartCard.jsx";

function Payment() {
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [cartItems, setCartItems] = useState([
        { id: 1, name: 'Sản phẩm A', price: 100000, quantity: 2 },
        { id: 2, name: 'Sản phẩm B', price: 150000, quantity: 1 },
        { id: 3, name: 'Sản phẩm C', price: 200000, quantity: 3 },
    ]);

    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const removeItem = (id) => setCartItems(cartItems.filter(item => item.id !== id));

    useEffect(() => {
        fetch("https://provinces.open-api.vn/api/p/")
            .then((res) => res.json())
            .then((data) => setProvinces(data));
    }, []);

    useEffect(() => {
        if (selectedProvince) {
            fetch(`https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`)
                .then((res) => res.json())
                .then((data) => setDistricts(data.districts || []));
        } else {
            setDistricts([]);
            setWards([]);
        }
    }, [selectedProvince]);

    useEffect(() => {
        if (selectedDistrict) {
            fetch(`https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`)
                .then((res) => res.json())
                .then((data) => setWards(data.wards || []));
        } else {
            setWards([]);
        }
    }, [selectedDistrict]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        console.log("🧾 Dữ liệu submit:", data);
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-md w-full max-w-6xl mx-auto p-6 mt-10">
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Cột trái: Thông tin giao hàng */}
                    <div className="md:w-2/3 space-y-6">
                        <h2 className="text-xl font-semibold">Thông tin giao hàng</h2>
                        <div className="flex gap-4">
                            <input name="firstName" type="text" placeholder="Họ đệm" required className="w-1/2 p-2 border rounded-md" />
                            <input name="lastName" type="text" placeholder="Tên" required className="w-1/2 p-2 border rounded-md" />
                        </div>
                        <input name="phone" type="tel" placeholder="Số điện thoại" required className="w-full p-2 border rounded-md" />
                        <input name="email" type="email" placeholder="Email" className="w-full p-2 border rounded-md" />
                        <input name="addressDetail" type="text" placeholder="Địa chỉ cụ thể (số nhà, tên đường...)" required className="w-full p-2 border rounded-md" />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <select name="province" required value={selectedProvince} onChange={(e) => {
                                setSelectedProvince(e.target.value);
                                setSelectedDistrict("");
                            }} className="p-2 border rounded-md">
                                <option value="">Tỉnh/Thành phố</option>
                                {provinces.map((p) => (
                                    <option key={p.code} value={p.code}>{p.name}</option>
                                ))}
                            </select>
                            <select name="district" required value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)} disabled={!districts.length} className="p-2 border rounded-md">
                                <option value="">Quận/Huyện</option>
                                {districts.map((d) => (
                                    <option key={d.code} value={d.code}>{d.name}</option>
                                ))}
                            </select>
                            <select name="ward" required disabled={!wards.length} className="p-2 border rounded-md">
                                <option value="">Xã/Phường</option>
                                {wards.map((w) => (
                                    <option key={w.code} value={w.code}>{w.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center gap-2">
                                <input type="checkbox" name="subscribe" />
                                Gửi cho tôi tin tức qua email
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="checkbox" name="saveInfo" />
                                Lưu lại thông tin cho lần sau
                            </label>
                        </div>

                        <div>
                            <h3 className="font-medium">Phương thức thanh toán</h3>
                            <label className="block">
                                <input type="radio" name="paymentMethod" value="qr" defaultChecked className="mr-2" />
                                Thanh toán qua QR
                            </label>
                            <label className="block">
                                <input type="radio" name="paymentMethod" value="cod" className="mr-2" />
                                Thanh toán khi nhận hàng
                            </label>
                        </div>
                    </div>

                    {/* Cột phải: Giỏ hàng */}
                    <div className="md:w-1/3 bg-gray-50 border border-gray-200 rounded-md p-4 h-fit">
                        <h3 className="text-lg font-semibold mb-4">Giỏ hàng</h3>
                        <div className="space-y-4">
                            {cartItems.length === 0 ? (
                                <p className="text-center text-gray-400 text-sm">Giỏ hàng trống</p>
                            ) : (
                                cartItems.map(item => (
                                    <ProductInCartCard key={item.id} item={item} onRemove={removeItem} />
                                ))
                            )}
                        </div>
                        <div className="mt-6 border-t pt-4">
                            <div className="flex justify-between items-center font-medium">
                                <span>Tổng cộng:</span>
                                <span>{totalPrice.toLocaleString('vi-VN')} VNĐ</span>
                            </div>
                        </div>
                        <button type="submit" className="mt-6 w-full bg-black text-white py-2 rounded-md hover:bg-white hover:text-black hover:rounded-sm hover:border-2 transition">
                            Đặt hàng
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default Payment;
