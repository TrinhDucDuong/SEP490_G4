function AddressCard( item ) {
    return (
        <>
            <div>
                <div className="flex flex-row gap-2">
                    <div>
                        {item.name}
                    </div>
                    <hr/>
                    <div>
                        {item.phoneNumber}
                    </div>
                </div>
                <div>
                    {item.address}
                </div>
                <div>
                    {item.exactAddress}
                </div>
                <div>
                    {item.type}
                </div>
            </div>
            <div>
                <button>
                    Cập nhật
                </button>
                <button>
                    Đặt làm mặc định
                </button>
            </div>
        </>
    )
}

export default AddressCard;