import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments } from '@fortawesome/free-solid-svg-icons';
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
import {useCart} from "../../../context/CartContext.jsx";
import { useNavigate } from 'react-router-dom';
import RecommendedProductList from "../Common/RecommendedProducts.jsx";


function Payment() {
    const { user } = useContext(AuthContext);
    const profile = user?.profile;
    const accountId = localStorage.getItem('accountId');
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const [selectedAddressId, setSelectedAddressId] = useState('');
    const [promoList, setPromoList] = useState([]);
    const [isAdd, setIsAdd] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [showAddressModal, setShowAddressModal] = useState(false);

    const { cartItems, removeItem, updateQuantity } = useCart();
    const { addresses, refetch } = useFetchAddress();

    useEffect(() => {
        setPromoList(['GIAM10', 'FREESHIP', 'THANG7SALE']);
    }, []);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        if (addresses && addresses.length > 0 && !selectedAddressId) {
            setSelectedAddressId(addresses[0].shippingAddressId.toString());
        }
    }, [addresses]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedAddressId) {
            toast.error('Vui lòng chọn địa chỉ giao hàng');
            return;
        }
        const formData = {
            shippingAddressId: Number(selectedAddressId),
        };

        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });
            console.log(formData);
            if (res.ok) {
                const data = await res.json();
                const createdOrder = data.order;
                console.log(createdOrder);
                localStorage.setItem("currentOrder", JSON.stringify(createdOrder));
                toast.success('Đơn hàng đã được thêm vào thành công, bạn hãy tiếp tục tiến hành thanh toán!');
                navigate('/payment-method', { state: { order: createdOrder } });
            } else {
                toast.error('Có lỗi xảy ra khi đặt hàng');
            }
        } catch (err) {
            toast.error('Lỗi kết nối tới máy chủ');
        }
    };

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

    const handleUpdateAddress = async (updated) => {

    };

    return (
        <div className='max-w-full md:max-w-[900px] lg:max-w-[1400px] mx-auto bg-[#F2F2EE]'>
            <div className='breadcrumb mt-4'>
                <Breadcrumb
                    items={[
                        { label: 'Trang chủ', to: '/' },
                        { label: 'Giỏ hàng', to: '/cart' },
                        { label: 'Thanh toán' },
                    ]}
                />
            </div>

            <div className='flex flex-col md:flex-row gap-8 md:gap-12 p-4 md:p-8 items-stretch'>
                <div className='basis-full md:basis-2/3 bg-white p-6 mb-8 md:mb-0 flex flex-col'>
                    <h2 className='text-2xl font-bold mb-4 text-black'>Liên Hệ</h2>

                    {profile ? (
                        <div className='flex items-center gap-4 mb-4'>
                            <img
                                src={profile?.profileImage?.imageUrl}
                                alt='avatar'
                                className='w-12 h-12 rounded-full object-cover border'
                            />
                            <div>
                                <div className='font-semibold text-black'>
                                   {profile.firstName} {profile.lastName}
                                </div>
                                <div className='text-sm text-gray-600'>{profile.email}</div>
                            </div>
                        </div>
                    ) : (
                        <div className='text-sm italic text-gray-500 mb-4'>
                            Bạn đã có tài khoản?{' '}
                            <Link to='/login' className='text-blue-600 hover:underline'>
                                Đăng nhập
                            </Link>
                        </div>
                    )}

                    <form className='space-y-4' onSubmit={handleSubmit}>
                        {!user && (
                            <>
                                <div className='flex gap-4'>
                                    <input
                                        type='text'
                                        name='firstname'
                                        placeholder='Tên đệm*'
                                        className='w-full border rounded-xl px-3 py-2 text-black'
                                    />
                                    <input
                                        type='text'
                                        name='lastname'
                                        placeholder='Tên*'
                                        className='w-full border rounded-xl px-3 py-2 text-black'
                                    />
                                </div>

                                <input
                                    type='email'
                                    name='email'
                                    placeholder='Email'
                                    className='w-full border rounded-xl px-3 py-2 text-black'
                                />

                                <input
                                    type='number'
                                    name='phone_number'
                                    placeholder='Số điện thoại*'
                                    required
                                    className='w-full border rounded-xl px-3 py-2 text-black'
                                />
                            </>
                        )}

                        {user ? (
                            <div className='space-y-4'>
                                <div className='flex justify-between items-center'>
                                    <h3 className='text-lg font-semibold text-black mb-2'>Địa chỉ giao hàng:</h3>
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
                                        item={addresses.find(a => a.shippingAddressId.toString() === selectedAddressId)}
                                        readonly
                                    />
                                ) : (
                                    <div className='text-sm text-gray-500 italic'>Chưa chọn địa chỉ nào.</div>
                                )}
                            </div>
                        ) : (
                            <ManualAddressForm />
                        )}

                        <div className='text-sm text-black bg-gray-50 p-3 rounded-md mt-4'>
                            <p>Chúng tôi cam kết tất cả sản phẩm đều là hàng thật, nguồn gốc rõ ràng.</p>
                            <p className='mt-2'>
                                <FontAwesomeIcon icon={faComments} className='mr-2 text-blue-400' />
                                Liên hệ Zalo [096x.xxx.xxx] để được tư vấn nhanh chóng!
                            </p>
                        </div>

                        <button
                            type='submit'
                            className='w-full mt-4 px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition'
                        >
                            Tiếp tục phương thức thanh toán
                        </button>
                    </form>

                </div>
                <div className='basis-full md:basis-1/3 bg-gray-50 p-6 flex flex-col'>
                    <PaymentProduct
                        cartItems={cartItems}
                        promoList={promoList}
                        removeItem={removeItem}
                        updateQuantity={updateQuantity}
                    />
                </div>
            </div>

            <div className="flex flex-col items-center justify-center bg-white shadow-sm p-4 md:p-8 mb-8 md:mb-0">
                <RecommendedProductList />
            </div>

            <Modal isOpen={isAdd} onClose={() => setIsAdd(false)}>
                <AddAddressForm onAdd={handleAddAddress} onCancel={() => setIsAdd(false)} />
            </Modal>
            <Modal isOpen={!!editingAddress} onClose={() => setEditingAddress(null)}>
                {editingAddress && (
                    <UpdateAddressForm
                        currentAddress={editingAddress}
                        onUpdate={handleUpdateAddress}
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
                onSetMain={(addr) => handleUpdateAddress({ ...addr, main: true })}
            />
        </div>
    );
}

export default Payment;
