import React from 'react';
import Modal from "../../../components/common/Customer/Modal.jsx";
import AddressCard from "../Profile/Address/AddressCard.jsx";

function AddressSelectModal({ isOpen, onClose, addresses, onSelect, onAddNew, onEdit, onSetMain }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto custom-scroll">
                <div className="flex flex-row space-y-4 justify-between items-center">
                    <h3 className="text-lg font-semibold text-black mb-2">Chọn địa chỉ giao hàng</h3>

                    <button
                        className="mt-4 px-4 py-2 bg-black text-white border border-black rounded-full hover:bg-white hover:text-black"
                        onClick={() => {
                            onClose();
                            onAddNew();
                        }}
                    >
                        + Thêm địa chỉ mới
                    </button>
                </div>


                {addresses.map(addr => (
                    <div
                        key={addr.shippingAddressId}
                        className="cursor-pointer border rounded-xl bg-white hover:bg-gray-100 transition-all duration-200"
                        onClick={() => {
                            onSelect(addr);
                            onClose();
                        }}
                    >
                        <AddressCard
                            item={addr}
                            onEdit={() => onEdit(addr)}
                            onSetMain={() => onSetMain(addr)}
                            onDelete={() => toast.warn("Xoá địa chỉ chưa hỗ trợ")}
                        />
                    </div>
                ))}


            </div>
        </Modal>
    );
}

export default AddressSelectModal;
