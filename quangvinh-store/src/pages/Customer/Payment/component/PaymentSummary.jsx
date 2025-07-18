function PaymentSummary() {
    return (
        <div className='bg-white border rounded-xl p-4'>
            <h3 className='font-bold text-black text-lg mb-3'>Tóm Tắt Đơn Hàng</h3>
            <div className='space-y-1 text-sm text-black'>
                <div className='flex justify-between'><span>1 Sản Phẩm</span><span>120.000₫</span></div>
                <div className='flex justify-between'><span>Giá gốc</span><span>800.000₫</span></div>
                <div className='flex justify-between'><span>Giao hàng</span><span>0₫</span></div>
                <div className='flex justify-between text-red-500'><span>Giảm giá</span><span>-80.000₫</span></div>
                <hr className='my-2'/>
                <div className='flex justify-between font-bold text-lg'><span>Total</span><span>1.800.000₫</span></div>
            </div>

            <div className='mt-4'>
                <div className='text-sm text-gray-600 italic'>Đã bao gồm thuế (14.074₫)</div>
                <div className='mt-2 text-sm text-blue-600 underline cursor-pointer'>
                    Sử Dụng Mã Khuyến Mãi
                </div>
            </div>

            <div className='mt-6 flex items-center gap-3'>
                <img src="/images/adidas-shoe.png" alt="product" className='w-16 h-16 object-cover border rounded' />
                <div className='text-sm'>
                    <p className='font-medium'>ADIDAS 4DFWD X PARLEY RUNNING SHOES</p>
                    <p className='text-red-500'>$125.00 <span className='text-gray-500 text-xs line-through ml-1'>200.000₫</span></p>
                </div>
            </div>
        </div>
    );
}

export default PaymentSummary;
