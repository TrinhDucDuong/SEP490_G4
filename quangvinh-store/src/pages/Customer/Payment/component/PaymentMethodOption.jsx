function PaymentMethodOption({ method, selected, onChange }) {
    const iconMap = {
        cod: '💵',
        vnpay: '💳',
        momo: <img src="/icons/momo.svg" alt="momo" className="inline w-5 h-5" />,
        shopeepay: <img src="/icons/shopeepay.svg" alt="shopeepay" className="inline w-5 h-5" />,
    };

    return (
        <label
            className={`flex items-start gap-3 border p-3 rounded-xl cursor-pointer ${selected ? 'border-black' : 'border-gray-300'}`}
        >
            <input
                type='radio'
                name='payment-method'
                value={method.id}
                checked={selected}
                onChange={onChange}
                className='mt-1 accent-black'
            />
            <div>
                <div className='font-medium text-black flex items-center gap-2'>
                    {iconMap[method.id]} {method.label}
                </div>
                {method.description && (
                    <div className='text-sm text-gray-500 mt-1'>{method.description}</div>
                )}
            </div>
        </label>
    );
}

export default PaymentMethodOption;
