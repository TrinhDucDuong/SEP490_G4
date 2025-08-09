import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../../context/AuthContext.jsx";
import useFetchAddress from "../../../hooks/Customer/useFetchAddress.js";
import { toast } from "react-toastify";
import Breadcrumb from "../../../components/common/Customer/Breadcrumb.jsx";
import AddressCard from "../Profile/Address/AddressCard.jsx";
import ManualAddressForm from "./ManualAddressForm.jsx";
import PaymentProduct from "./PaymentProduct.jsx";
import Modal from "../../../components/common/Customer/Modal.jsx";
import AddAddressForm from "../Profile/Address/AddAddressForm.jsx";
import UpdateAddressForm from "../Profile/Address/UpdateAddressForm.jsx";
import AddressSelectModal from "./AddressSelectModal.jsx";
import { createAddress } from "../../../utils/api/Customer/AddressAPI.js";
import { useCart } from "../../../context/CartContext.jsx";
import RecommendedProductList from "../Common/RecommendedProducts.jsx";
import PaymentSuccessPopup from "./PaymentSuccessPopup.jsx";

function CheckoutPage() {
    const { user } = useContext(AuthContext);
    const profile = user?.profile;
    const token = localStorage.getItem("token");

    const [selectedAddressId, setSelectedAddressId] = useState("");
    const [promoList, setPromoList] = useState([]);
    const [isAdd, setIsAdd] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [showAddressModal, setShowAddressModal] = useState(false);

    const [order, setOrder] = useState(null);
    const [selectedMethod, setSelectedMethod] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const { cartItems, removeItem, updateQuantity } = useCart();
    const { addresses, refetch } = useFetchAddress();

    useEffect(() => {
        setPromoList(["GIAM10", "FREESHIP", "THANG7SALE"]);
    }, []);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        if (addresses && addresses.length > 0 && !selectedAddressId) {
            setSelectedAddressId(addresses[0].shippingAddressId.toString());
        }
    }, [addresses]);

    const handleAddAddress = async (newAddress) => {
        try {
            await createAddress(newAddress, token);
            toast.success("Thêm địa chỉ thành công!");
            setIsAdd(false);
            refetch();
        } catch (err) {
            toast.error("Lỗi khi thêm địa chỉ");
        }
    };

    const createOrder = async () => {
        if (!selectedAddressId) {
            toast.error("Vui lòng chọn địa chỉ giao hàng");
            return null;
        }

        const formData = {
            shippingAddressId: Number(selectedAddressId),
        };

        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/order`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                const data = await res.json();
                const createdOrder = data.order;
                setOrder(createdOrder);
                return createdOrder;
            } else {
                toast.error("Có lỗi xảy ra khi đặt hàng");
                return null;
            }
        } catch (err) {
            toast.error("Lỗi kết nối tới máy chủ");
            return null;
        }
    };

    const handlePayment = async (orderData) => {
        if (!selectedMethod) {
            toast.warning("Vui lòng chọn phương thức thanh toán.");
            return;
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/order/purchase`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    orderId: Number(orderData.orderId),
                    paymentMethod: selectedMethod,
                }),
            });

            if (res.ok) {
                const result = await res.json();
                const paymentUrl = result.paymentUrl;
                toast.success("Chọn phương thức thanh toán thành công!");

                if (selectedMethod === "VNPAY" && paymentUrl) {
                    window.location.href = paymentUrl;
                    return;
                }
                setIsSuccess(true);
            } else {
                toast.error("Chọn phương thức thanh toán thất bại.");
            }
        } catch (err) {
            toast.error("Lỗi kết nối đến máy chủ.");
        }
    };

    const handleCheckout = async () => {
        let currentOrder = order;
        if (!currentOrder) {
            currentOrder = await createOrder();
        }
        if (currentOrder) {
            await handlePayment(currentOrder);
        }
    };

    const shipping = order?.shippingAddress || {};
    const totalPrice = order?.totalPrice || cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingFee = order?.shippingFee || 0;
    const discount = order?.discount || 0;
    const finalTotal = totalPrice + shippingFee - discount;

    return (
        <div className="max-w-full md:max-w-[1400px] mx-auto">
            <div className="breadcrumb mt-4">
                <Breadcrumb
                    items={[
                        { label: "Trang chủ", to: "/" },
                        { label: "Giỏ hàng", to: "/cart" },
                        { label: "Thanh toán" },
                    ]}
                />
            </div>

            {isSuccess ? (
                <div className="flex justify-center mt-10">
                    <PaymentSuccessPopup
                        orderId={order?.orderId}
                        paymentTime={new Date().toLocaleString("vi-VN")}
                        reference={"000085752257"}
                        paymentMethod={selectedMethod}
                        sender={shipping.name || "Không rõ"}
                        estimatedDelivery={"25 Th06 - 26 Th06"}
                        total={finalTotal}
                    />
                </div>
            ) : (
                <div className="flex flex-col md:flex-row gap-8 md:gap-12 p-4 md:p-8 items-start">
                    <div className="basis-full md:basis-2/3 bg-white p-6">
                        <h2 className="text-2xl font-bold mb-4 text-black">Liên Hệ</h2>
                        {profile ? (
                            <div className="flex items-center gap-4 mb-4">
                                <img
                                    src={profile?.profileImage?.imageUrl}
                                    alt="avatar"
                                    className="w-12 h-12 rounded-full object-cover border"
                                />
                                <div>
                                    <div className="font-semibold text-black">
                                        {profile.firstName} {profile.lastName}
                                    </div>
                                    <div className="text-sm text-gray-600">{profile.email}</div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-sm italic text-gray-500 mb-4">
                                Bạn đã có tài khoản?{" "}
                                <Link to="/login" className="text-blue-600 hover:underline">
                                    Đăng nhập
                                </Link>
                            </div>
                        )}

                        {user ? (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-semibold text-black mb-2">Địa chỉ giao hàng:</h3>
                                    <button
                                        type="button"
                                        onClick={() => setShowAddressModal(true)}
                                        className="text-sm px-3 py-1 border border-black rounded-full bg-black text-white hover:bg-white hover:text-black"
                                    >
                                        Chọn địa chỉ khác
                                    </button>
                                </div>

                                {selectedAddressId ? (
                                    <AddressCard
                                        item={addresses.find((a) => a.shippingAddressId.toString() === selectedAddressId)}
                                        readonly
                                    />
                                ) : (
                                    <div className="text-sm text-gray-500 italic">Chưa chọn địa chỉ nào.</div>
                                )}
                            </div>
                        ) : (
                            <ManualAddressForm />
                        )}

                        {/* Phương thức thanh toán */}
                        <h2 className="text-2xl font-semibold mt-8 mb-4">Chọn phương thức thanh toán</h2>
                        <div className="space-y-3 mb-6">
                            {["COD", "MOMO", "VNPAY"].map((method) => (
                                <label key={method} className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value={method}
                                        checked={selectedMethod === method}
                                        onChange={() => setSelectedMethod(method)}
                                    />
                                    {method === "COD" && "Thanh toán khi nhận hàng (COD)"}
                                    {method === "MOMO" && "Thanh toán qua ví MoMo"}
                                    {method === "VNPAY" && "Thanh toán qua VNPay"}
                                </label>
                            ))}
                        </div>

                        {/* Ghi chú */}
                        <div className="text-sm text-black bg-gray-50 p-3 rounded-md mt-4">
                            <p>Chúng tôi cam kết tất cả sản phẩm đều là hàng thật, nguồn gốc rõ ràng.</p>
                            <p className="mt-2">
                                <FontAwesomeIcon icon={faComments} className="mr-2 text-blue-400" />
                                Liên hệ Zalo [096x.xxx.xxx] để được tư vấn nhanh chóng!
                            </p>
                        </div>

                        {/* Nút Thanh toán */}
                        <button
                            onClick={handleCheckout}
                            className="w-full mt-6 px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition"
                        >
                            THANH TOÁN
                        </button>
                    </div>

                    {/* Cột phải: Tóm tắt đơn hàng */}
                    <div className="basis-full md:basis-1/3 bg-gray-50 p-6">
                        <PaymentProduct
                            cartItems={cartItems}
                            promoList={promoList}
                            removeItem={removeItem}
                            updateQuantity={updateQuantity}
                        />
                    </div>
                </div>
            )}

            {/* Gợi ý sản phẩm */}
            <div className="flex flex-col items-center justify-center bg-white shadow-sm p-4 md:p-8 mb-8">
                <RecommendedProductList />
            </div>

            {/* Modal địa chỉ */}
            <Modal isOpen={isAdd} onClose={() => setIsAdd(false)}>
                <AddAddressForm onAdd={handleAddAddress} onCancel={() => setIsAdd(false)} />
            </Modal>
            <Modal isOpen={!!editingAddress} onClose={() => setEditingAddress(null)}>
                {editingAddress && (
                    <UpdateAddressForm
                        currentAddress={editingAddress}
                        onUpdate={() => {}}
                        onCancel={() => setEditingAddress(null)}
                    />
                )}
            </Modal>
            <AddressSelectModal
                isOpen={showAddressModal}
                onClose={() => setShowAddressModal(false)}
                addresses={addresses}
                onSelect={(addr) => setSelectedAddressId(addr.shippingAddressId.toString())}
                onAddNew={() => setIsAdd(true)}
                onEdit={(addr) => setEditingAddress(addr)}
                onSetMain={(addr) => {}}
            />
        </div>
    );
}

export default CheckoutPage;
