import {useContext, useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faComments} from "@fortawesome/free-solid-svg-icons";
import {AuthContext} from "../../../context/AuthContext.jsx";
import useFetchAddress from "../../../hooks/customer/useFetchAddress.js";
import {toast} from "react-toastify";
import Breadcrumb from "../../../components/common/customer/Breadcrumb.jsx";
import AddressCard from "../profile/Address/AddressCard.jsx";
import PaymentProduct from "./PaymentProduct.jsx";
import Modal from "../../../components/common/customer/Modal.jsx";
import AddAddressForm from "../profile/Address/AddAddressForm.jsx";
import UpdateAddressForm from "../profile/Address/UpdateAddressForm.jsx";
import AddressSelectModal from "./AddressSelectModal.jsx";
import {createAddress} from "../../../utils/api/Customer/AddressAPI.js";
import RecommendedProductList from "../common/RecommendedProducts.jsx";
import PaymentResult from "./PaymentResult.jsx";
import {useCart} from "../../../context/CartContext.jsx";

function CheckoutPage() {
    const {user} = useContext(AuthContext);
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
    const [result, setResult] = useState(null);

    const {cartItems, removeItem, updateQuantity} = useCart();
    const {addresses, refetch} = useFetchAddress();
    const { clearCart } = useCart();

    const [provinces, setProvinces] = useState([]);
    const [wards, setWards] = useState([]);

    useEffect(() => {
        setPromoList(["GIAM10", "FREESHIP", "THANG7SALE"]);
    }, []);

    const [guestForm, setGuestForm] = useState({
        firstname: "",
        lastname: "",
        email: "",
        phoneNumber: "",
        province: "",
        ward: "",
        exactAddress: "",
    });

    const [errors, setErrors] = useState({});

    // Fetch provinces
    useEffect(() => {
        fetch('https://provinces.open-api.vn/api/v2/p/')
            .then(res => res.json())
            .then(setProvinces)
            .catch(error => {
                console.error('Lỗi khi tải danh sách tỉnh:', error);
                toast.error('Không thể tải danh sách tỉnh');
            });
    }, []);

    // Fetch wards when province changes
    useEffect(() => {
        if (guestForm.province) {
            fetch(`https://provinces.open-api.vn/api/v2/w?province_code=${guestForm.province}`)
                .then(res => res.json())
                .then(setWards)
                .catch(error => {
                    console.error('Lỗi khi tải danh sách phường:', error);
                    toast.error('Không thể tải danh sách phường');
                });
            setGuestForm({ ...guestForm, ward: '' });
        } else {
            setWards([]);
            setGuestForm({ ...guestForm, ward: '' });
        }
    }, [guestForm.province]);

    const validateGuestForm = () => {
        let newErrors = {};
        if (!guestForm.firstname.trim()) newErrors.firstname = "Tên đệm là bắt buộc";
        if (!guestForm.lastname.trim()) newErrors.lastname = "Tên là bắt buộc";
        if (!guestForm.email.trim()) {
            newErrors.email = "Email là bắt buộc";
        } else if (!/\S+@\S+\.\S+/.test(guestForm.email)) {
            newErrors.email = "Email không hợp lệ";
        }
        if (!guestForm.phoneNumber.trim()) {
            newErrors.phoneNumber = "Số điện thoại là bắt buộc";
        } else if (!/^[0-9]{9,11}$/.test(guestForm.phoneNumber)) {
            newErrors.phoneNumber = "Số điện thoại không hợp lệ (9–11 số)";
        }
        if (!guestForm.province.trim()) newErrors.province = "Tỉnh/Thành phố là bắt buộc";
        if (!guestForm.ward.trim()) newErrors.ward = "Phường/Xã là bắt buộc";
        if (!guestForm.exactAddress.trim()) newErrors.exactAddress = "Địa chỉ chi tiết là bắt buộc";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    useEffect(() => {
        window.scrollTo({top: 0, behavior: "smooth"});
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
        if (user) {
            if (!selectedAddressId) {
                toast.error("Vui lòng chọn địa chỉ giao hàng");
                return null;
            }
            const formData = {shippingAddressId: Number(selectedAddressId)};
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
                    setResult(data);
                    const createdOrder = data.order;
                    setOrder(createdOrder);
                    await clearCart();
                    return createdOrder;
                } else {
                    toast.error("Có lỗi xảy ra khi đặt hàng");
                    return null;
                }
            } catch (err) {
                toast.error("Lỗi kết nối tới máy chủ");
                return null;
            }
        } else {
            if (!validateGuestForm()) {
                toast.error("Vui lòng điền đầy đủ thông tin hợp lệ");
                return null;
            }
            if (!selectedMethod) {
                toast.error("Vui lòng chọn phương thức thanh toán");
                return null;
            }

            const formData = {
                shippingAddressInputData: {
                    shippingAddressId: null,
                    name: `${guestForm.firstname} ${guestForm.lastname}`,
                    phoneNumber: guestForm.phoneNumber,
                    address: `${guestForm.province}, ${guestForm.ward}`,
                    exactAddress: guestForm.exactAddress,
                    isMain: true,
                    type: "null",
                },
                listProductVariantInputData: cartItems.map(item => ({
                    productId: item.productId,
                    colorHexCode: item.colorHexCode,
                    sizeCode: item.sizeCode,
                    quantity: item.quantity,
                })),
                purchaseInputData: {
                    orderId: null,
                    paymentMethod: selectedMethod,
                }
            };
            try {
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/order/guest`, {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(formData),
                });
                if (res.ok) {
                    const result = await res.json();
                    setResult(result);
                    const paymentUrl = result.paymentUrl;
                    toast.success("Chọn phương thức thanh toán thành công!");
                    if (selectedMethod === "VNPAY" && paymentUrl) {
                        window.location.href = paymentUrl;
                        return;
                    }
                    await clearCart();
                    setIsSuccess(true);
                } else {
                    toast.error("Có lỗi xảy ra khi đặt hàng (Guest)");
                    return null;
                }
            } catch (err) {
                toast.error("Lỗi kết nối tới máy chủ (Guest)");
                return null;
            }
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
                setResult(result);
                console.log(result);
                const paymentUrl = result.paymentUrl;
                toast.success("Chọn phương thức thanh toán thành công!");

                if (selectedMethod === "VNPAY" && paymentUrl) {
                    window.location.href = paymentUrl;
                    return;
                }

                setIsSuccess(true);
                await clearCart();
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

    console.log(result);

    return (
        <div className="max-w-full md:max-w-[1400px] mx-auto">
            <div className="breadcrumb mt-4">
                <Breadcrumb
                    items={[
                        {label: "Trang chủ", to: "/"},
                        {label: "Giỏ hàng", to: "/cart"},
                        {label: "Thanh toán"},
                    ]}
                />
            </div>

            {isSuccess ? (
                <div className="flex justify-center mt-10">
                    <PaymentResult result={result}/>
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
                            <>
                                <div className="space-y-4">
                                    <div className="flex gap-4">
                                        <div className="w-full">
                                            <input
                                                type="text"
                                                placeholder="Tên đệm*"
                                                className="w-full border rounded-xl px-3 py-2 text-black"
                                                value={guestForm.firstname}
                                                onChange={(e) => setGuestForm({...guestForm, firstname: e.target.value})}
                                            />
                                            {errors.firstname && <p className="text-red-500 text-sm">{errors.firstname}</p>}
                                        </div>
                                        <div className="w-full">
                                            <input
                                                type="text"
                                                placeholder="Tên*"
                                                className="w-full border rounded-xl px-3 py-2 text-black"
                                                value={guestForm.lastname}
                                                onChange={(e) => setGuestForm({...guestForm, lastname: e.target.value})}
                                            />
                                            {errors.lastname && <p className="text-red-500 text-sm">{errors.lastname}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <input
                                            type="email"
                                            placeholder="Email*"
                                            className="w-full border rounded-xl px-3 py-2 text-black"
                                            value={guestForm.email}
                                            onChange={(e) => setGuestForm({...guestForm, email: e.target.value})}
                                        />
                                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                                    </div>

                                    <div>
                                        <input
                                            type="number"
                                            placeholder="Số điện thoại*"
                                            className="w-full border rounded-xl px-3 py-2 text-black"
                                            value={guestForm.phoneNumber}
                                            onChange={(e) => setGuestForm({...guestForm, phoneNumber: e.target.value})}
                                        />
                                        {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
                                    </div>

                                    <div>
                                        <select
                                            className="w-full border rounded-xl px-3 py-2 text-black"
                                            value={guestForm.province}
                                            onChange={(e) => setGuestForm({...guestForm, province: e.target.value})}
                                        >
                                            <option value="">Chọn Tỉnh/Thành phố*</option>
                                            {provinces.map((province) => (
                                                <option key={province.code} value={province.name}>
                                                    {province.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.province && <p className="text-red-500 text-sm">{errors.province}</p>}
                                    </div>

                                    <div>
                                        <select
                                            className="w-full border rounded-xl px-3 py-2 text-black"
                                            value={guestForm.ward}
                                            onChange={(e) => setGuestForm({...guestForm, ward: e.target.value})}
                                            disabled={!guestForm.province}
                                        >
                                            <option value="">Chọn Phường/Xã*</option>
                                            {wards.map((ward) => (
                                                <option key={ward.code} value={ward.name}>
                                                    {ward.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.ward && <p className="text-red-500 text-sm">{errors.ward}</p>}
                                    </div>

                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Địa chỉ chi tiết*"
                                            className="w-full border rounded-xl px-3 py-2 text-black"
                                            value={guestForm.exactAddress}
                                            onChange={(e) => setGuestForm({...guestForm, exactAddress: e.target.value})}
                                        />
                                        {errors.exactAddress && <p className="text-red-500 text-sm">{errors.exactAddress}</p>}
                                    </div>
                                </div>
                            </>
                        )}

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

                        <div className="text-sm text-black bg-gray-50 p-3 rounded-md mt-4">
                            <p>Chúng tôi cam kết tất cả sản phẩm đều là hàng thật, nguồn gốc rõ ràng.</p>
                            <p className="mt-2">
                                <FontAwesomeIcon icon={faComments} className="mr-2 text-blue-400"/>
                                Liên hệ Zalo [096x.xxx.xxx] để được tư vấn nhanh chóng!
                            </p>
                        </div>

                        <button
                            onClick={handleCheckout}
                            className="w-full mt-6 px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition"
                        >
                            THANH TOÁN
                        </button>
                    </div>

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

            <div className="flex flex-col items-center justify-center bg-white shadow-sm p-4 md:p-8 mb-8">
                <RecommendedProductList/>
            </div>

            <Modal isOpen={isAdd} onClose={() => setIsAdd(false)}>
                <AddAddressForm onAdd={handleAddAddress} onCancel={() => setIsAdd(false)}/>
            </Modal>
            <Modal isOpen={!!editingAddress} onClose={() => setEditingAddress(null)}>
                {editingAddress && (
                    <UpdateAddressForm
                        currentAddress={editingAddress}
                        onUpdate={() => {
                        }}
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
                onSetMain={(addr) => {
                }}
            />
        </div>
    );
}

export default CheckoutPage;