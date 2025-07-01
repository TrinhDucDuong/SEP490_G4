import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import AddAddressForm from "./AddAddressForm";
import UpdateAddressForm from "./UpdateAddressForm";
import { toast } from "react-toastify";
import Modal from "../../../../components/common/Modal.jsx";
import ConfirmDialog from "../../../../components/common/ConfirmDialog.jsx";
import AddressCard from "../../Common/AddressCard.jsx";

function Address() {
    const [address, setAddress] = useState([
        {
            name: "Nguyễn Văn A",
            phoneNumber: "0912345678",
            address: "Số 1, Đường Lê Lợi, Quận 1",
            exactAddress: "Chung cư XYZ, Tầng 5, Căn hộ 501",
            isMain: true,
            type: "Nhà riêng"
        },
        {
            name: "Trần Thị B",
            phoneNumber: "0987654321",
            address: "Số 15, Đường Nguyễn Trãi, Quận 5",
            exactAddress: "Tòa nhà ABC, Lầu 3, Văn phòng 305",
            isMain: false,
            type: "Văn phòng"
        }
    ]);

    const [isAdd, setIsAdd] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);

    const handleAdd = (newAddress) => {
        setAddress(prev => [...prev, newAddress]);
        setIsAdd(false);
        toast.success("Đã thêm địa chỉ mới!");
    };

    const handleUpdate = (updated) => {
        setAddress(prev =>
            prev.map(addr => addr === editingAddress ? updated : addr)
        );
        setEditingAddress(null);
        toast.success("Đã cập nhật địa chỉ!");
    };

    const handleDeleteConfirmed = () => {
        setAddress(prev => prev.filter(addr => addr !== confirmDelete));
        toast.success("Đã xoá địa chỉ!");
        setConfirmDelete(null);
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Địa chỉ của tôi</h2>
                <button
                    className="bg-gray-900 text-white px-4 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-gray-800 transition-colors duration-200"
                    onClick={() => setIsAdd(true)}
                >
                    <FontAwesomeIcon icon={faPlus} />
                    Thêm địa chỉ mới
                </button>
            </div>

            {/* Modal thêm */}
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

            <div className="space-y-4">
                {address.map((item, index) => (
                    <AddressCard
                        key={index}
                        item={item}
                        onEdit={() => setEditingAddress(item)}
                        onSetMain={() => {
                            setAddress(prev => prev.map(addr => ({
                                ...addr,
                                isMain: addr === item
                            })));
                        }}
                        onDelete={() => setConfirmDelete(item)}
                    />
                ))}
            </div>
        </div>
    );
}

export default Address;