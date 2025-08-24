/**
 * AddressSelectModal Component
 *
 * @author ngothangwork
 * @copyright 2025
 */

import React from 'react';
import Modal from "../../../components/common/customer/Modal.jsx";
import AddressCard from "../profile/address/AddressCard.jsx";
import { toast } from "react-toastify";

/**
 * Modal hiển thị danh sách địa chỉ để người dùng chọn địa chỉ giao hàng.
 *
 * @component
 * @param {Object} props - Các props truyền vào component
 * @param {boolean} props.isOpen - Trạng thái mở/đóng của modal
 * @param {Function} props.onClose - Hàm callback để đóng modal
 * @param {Array<Object>} props.addresses - Danh sách địa chỉ của người dùng
 * @param {Function} props.onSelect - Callback khi chọn một địa chỉ (trả về object địa chỉ)
 * @param {Function} props.onAddNew - Callback khi bấm "Thêm địa chỉ mới"
 * @param {Function} props.onEdit - Callback khi bấm sửa một địa chỉ (trả về object địa chỉ)
 * @param {Function} props.onSetMain - Callback khi bấm đặt làm địa chỉ chính (trả về object địa chỉ)
 *
 * @example
 * <AddressSelectModal
 *   isOpen={isModalOpen}
 *   onClose={() => setIsModalOpen(false)}
 *   addresses={addressList}
 *   onSelect={(addr) => setSelectedAddress(addr)}
 *   onAddNew={handleAddNewAddress}
 *   onEdit={(addr) => handleEditAddress(addr)}
 *   onSetMain={(addr) => handleSetMainAddress(addr)}
 * />
 */
function AddressSelectModal({ isOpen, onClose, addresses, onSelect, onAddNew, onEdit, onSetMain }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto custom-scroll">
                <div className="flex flex-row space-x-4 justify-between items-center">
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
