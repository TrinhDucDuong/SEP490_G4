import React, {useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import AddressCard from "../Common/AddressCard.jsx";

function Address() {
    const [address, setAddress] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const [isAdd, setIsAdd] = useState(false);



    return (
        <>
            <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-4">
                <div className="flex flex-row justify-between mb-4">
                    <h2 className="text-xl font-bold mb-2">Địa chỉ của tôi</h2>
                    <button className="bg-black text-white p-2 rounded-full">
                        <FontAwesomeIcon icon={faPlus} style={{color: "#FFFFFF",}} /> Thêm địa chỉ mới
                    </button>
                </div>
                <hr/>
                <div className="border-t-xl mt-10 border-gray-200 shadow-md p-4">
                    {address.map((item, index) => (
                        <AddressCard item={item} key={index} />
                    ))}
                </div>
            </div>
        </>

    );
}

export default Address;
