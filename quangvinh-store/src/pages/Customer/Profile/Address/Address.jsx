import React, { useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import Modal from "../../../../components/common/Customer/Modal.jsx";
import ConfirmDialog from "../../../../components/common/Customer/ConfirmDialog.jsx";
import AddressCard from "./AddressCard.jsx";
import useFetchAddress from '../../../../hooks/Customer/useFetchAddress.js';
import { AuthContext } from '../../../../context/AuthContext';
import AddAddressForm from "./AddAddressForm.jsx";
import UpdateAddressForm from "./UpdateAddressForm.jsx";

function Address() {
    const { token } = useContext(AuthContext);
    const { addresses, loading, error, refetch } = useFetchAddress();

    const [address, setAddress] = useState([]);
    const [isAdd, setIsAdd] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);

    useEffect(() => {
        if (!loading && addresses) {
            setAddress(addresses);
        }
    }, [addresses, loading]);

    const handleAdd = async (newAddress) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/addresses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(newAddress),
            });
            console.log(newAddress);
            if (response.ok) {
                const created = await response.json();
                setAddress(prev => [...prev, created]);
                toast.success("Đã thêm địa chỉ mới!");
                setIsAdd(false);
                refetch();
            } else {
                toast.error("Thêm địa chỉ thất bại!");
            }
        } catch (error) {
            console.error("Lỗi thêm địa chỉ:", error);
            toast.error("Thêm địa chỉ thất bại!");
        }
    };

    const handleUpdate = async (updated) => {
        try {
            const response = await fetch('http://localhost:9999/addresses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...updated,
                }),
            });

            if (response.ok) {
                const updatedResult = await response.json();
                setAddress(prev =>
                    prev.map(addr => addr.shippingAddressId === updatedResult.shippingAddressId ? updatedResult : addr)
                );
                setEditingAddress(null);
                toast.success("Đã cập nhật địa chỉ!");
                refetch();
            } else {
                toast.error("Cập nhật địa chỉ thất bại!");
            }
        } catch (error) {
            console.error("Lỗi cập nhật địa chỉ:", error);
            toast.error("Cập nhật địa chỉ thất bại!");
        }
    };


    const handleDeleteConfirmed = async () => {
        if (!confirmDelete) return;
        try {
            const response = await fetch(`http://localhost:9999/addresses?shippingAddressId=${confirmDelete.shippingAddressId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok) {
                setAddress(prev => prev.filter(addr => addr.shippingAddressId !== confirmDelete.shippingAddressId));
                toast.success("Đã xoá địa chỉ!");
                refetch();
            } else {
                toast.error("Xoá địa chỉ thất bại!");
            }
        } catch (error) {
            console.error("Lỗi khi xoá địa chỉ:", error);
            toast.error("Lỗi khi xoá địa chỉ!");
        }
        setConfirmDelete(null);
    };

    const handleSetMain = async (addressId) => {
        try {
            const response = await fetch(`http://localhost:9999/addresses?shippingAddressId=${addressId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok) {
                toast.success("Đã đặt làm địa chỉ chính!");
                refetch();
            } else {
                toast.error("Đặt địa chỉ chính thất bại!");
            }
        } catch (error) {
            console.error("Lỗi khi đặt địa chỉ chính:", error);
            toast.error("Lỗi khi đặt địa chỉ chính!");
        }
    };



    return (
        <div className="bg-white shadow-sm">
            <div className="flex flex-col border-b border-b-black pb-2 sm:flex-row justify-between items-start sm:items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 m-4 sm:mb-0">Địa chỉ của tôi</h2>
                <button
                    className="bg-black text-white px-4 py-2.5 rounded-sm border border-black text-sm font-medium flex items-center m-4 gap-2 hover:bg-white hover:text-black transition-colors duration-200"
                    onClick={() => setIsAdd(true)}
                >
                    <FontAwesomeIcon icon={faPlus} />
                    Thêm địa chỉ mới
                </button>
            </div>

            <Modal isOpen={isAdd} onClose={() => setIsAdd(false)}>
                <AddAddressForm
                    onAdd={handleAdd}
                    onCancel={() => setIsAdd(false)}
                />
            </Modal>

            <Modal isOpen={!!editingAddress} onClose={() => setEditingAddress(null)}>
                {editingAddress && (
                    <UpdateAddressForm
                        currentAddress={editingAddress}
                        onUpdate={handleUpdate}
                        onCancel={() => setEditingAddress(null)}
                    />
                )}
            </Modal>

            <ConfirmDialog
                isOpen={!!confirmDelete}
                onClose={() => setConfirmDelete(null)}
                onConfirm={handleDeleteConfirmed}
                message={`Bạn có chắc chắn muốn xoá địa chỉ của "${confirmDelete?.name}"?`}
            />

            {loading ? (
                <p>Đang tải danh sách địa chỉ...</p>
            ) : error ? (
                <p className="text-red-500">Lỗi khi tải địa chỉ</p>
            ) : (
                <div className="">
                    {address.map((item) => (
                        <AddressCard
                            key={item.shippingAddressId}
                            item={item}
                            onEdit={() => setEditingAddress(item)}
                            onSetMain={() => handleSetMain(item.shippingAddressId)}
                            onDelete={() => setConfirmDelete(item)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Address;