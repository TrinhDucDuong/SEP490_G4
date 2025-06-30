import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments } from '@fortawesome/free-solid-svg-icons';
import Breadcrumb from '../../components/common/Breadcrumb.jsx';

const containerStyle = {
    width: '100%',
    height: '256px',
};

const centerDefault = {
    lat: 21.028511,
    lng: 105.804817,
};

function Payment() {
    const [provinces, setProvinces] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [districts, setDistricts] = useState([]);
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [mapLocation, setMapLocation] = useState(null);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: 'AIzaSyDpPC7ZxeuEmixJHUal00qRF0LhLWd_6eQ',
    });

    useEffect(() => {
        fetch('https://provinces.open-api.vn/api/p/')
            .then((res) => res.json())
            .then((data) => setProvinces(data));
    }, []);

    useEffect(() => {
        if (selectedProvince) {
            fetch(`https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`)
                .then((res) => res.json())
                .then((data) => setDistricts(data.districts || []));
        } else {
            setDistricts([]);
        }
    }, [selectedProvince]);

    const handleGetLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setMapLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => {
                    alert('Không thể lấy vị trí: ' + error.message);
                }
            );
        } else {
            alert('Trình duyệt không hỗ trợ định vị.');
        }
    };

    return (
        <div className='max-w-full md:max-w-[900px] lg:max-w-[1400px] mx-auto'>
            <div className='breadcrumb mt-4'>
                <Breadcrumb
                    items={[
                        { label: 'Trang chủ', to: '/' },
                        { label: 'Giỏ hàng', to: '/cart' },
                        { label: 'Thanh toán' },
                    ]}
                />
            </div>
            <div className='cart-wrapper flex flex-col md:flex-row gap-8 md:gap-12W p-4 md:p-8 min-h-screen items-stretch'>
                <div className='cart-left basis-full md:basis-2/3 bg-white p-6 mb-8 md:mb-0 flex flex-col'>
                    <div className='breadcrumb mb-4'></div>
                    <div className='information'>
                        <h2 className='title text-2xl font-bold mb-2 text-black'>Liên Hệ</h2>
                        <div className='question mb-4 text-sm italic opacity-50 text-gray-800'>
                            <span>Bạn đã có tài khoản? </span>
                            <Link to='/login' className='text-blue-600 hover:underline'>
                                Đăng nhập
                            </Link>
                        </div>
                        <h3 className='text-lg font-semibold mb-2 text-black'>Thông Tin Giao Hàng</h3>
                        <form className='information_detail space-y-4'>
                            <div className='name-fields flex gap-4'>
                                <div className='flex-1'>
                                    <input
                                        type='text'
                                        name='firstname'
                                        placeholder='Tên đệm*'
                                        className='w-full border rounded-xl px-3 py-2 text-black'
                                    />
                                </div>
                                <div className='flex-1'>
                                    <input
                                        type='text'
                                        name='lastname'
                                        placeholder='Tên*'
                                        className='w-full border rounded-xl px-3 py-2 text-black'
                                    />
                                </div>
                            </div>
                            <div>
                                <input
                                    type='email'
                                    name='email'
                                    placeholder='Email'
                                    className='w-full border rounded-xl px-3 py-2 text-black'
                                />
                            </div>
                            <div>
                                <input
                                    type='number'
                                    name='phone_number'
                                    placeholder='Số điện thoại*'
                                    required
                                    className='w-full border rounded-xl px-3 py-2 text-black'
                                />
                            </div>
                            <div className='address-fields flex'>
                                <select
                                    value={selectedProvince}
                                    onChange={(e) => {
                                        setSelectedProvince(e.target.value);
                                        setSelectedDistrict('');
                                    }}
                                    className='w-full border opacity-50 rounded-xl px-3 py-2 mb-2 mr-2 text-black'
                                >
                                    <option value=''>Chọn tỉnh/thành phố</option>
                                    {provinces.map((p) => (
                                        <option key={p.code} value={p.code}>
                                            {p.name}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    value={selectedDistrict}
                                    onChange={(e) => setSelectedDistrict(e.target.value)}
                                    disabled={!districts.length}
                                    className='w-full border opacity-50 rounded-xl px-3 py-2 mb-2 text-black disabled:bg-gray-100'
                                >
                                    <option value=''>Chọn quận/huyện</option>
                                    {districts.map((d) => (
                                        <option key={d.code} value={d.code}>
                                            {d.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <input
                                    type='text'
                                    placeholder='Địa chỉ*'
                                    className='w-full border rounded-xl px-3 py-2 text-black'
                                />
                            </div>
                            <div className='map-preview relative w-full h-64 bg-gray-200 rounded-lg mb-2' id='map'>
                                {isLoaded && mapLocation && (
                                    <GoogleMap mapContainerStyle={containerStyle} center={mapLocation} zoom={15}>
                                        <Marker position={mapLocation} />
                                    </GoogleMap>
                                )}
                                <button
                                    type='button'
                                    onClick={handleGetLocation}
                                    className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-2 bg-black text-white rounded-full hover:bg-white hover:text-black rounded opacity-50 transition'
                                >
                                    + Thêm vị trí
                                </button>
                            </div>

                            <div className='address-type flex gap-2'>
                                <button
                                    type='button'
                                    className='px-3 py-1 border border-black bg-white text-black rounded-full hover:bg-gray-300'
                                >
                                    Nhà riêng
                                </button>
                                <button
                                    type='button'
                                    className='px-3 py-1 border border-black bg-white text-black rounded-full hover:bg-gray-300'
                                >
                                    Văn phòng
                                </button>
                            </div>
                            <div className='options flex flex-col gap-2'>
                                <label className='flex items-center gap-2 text-black'>
                                    <input type='checkbox' /> Gửi cho tôi các tin tức ưu đãi qua Email
                                </label>
                                <label className='flex items-center gap-2 text-black'>
                                    <input type='checkbox' /> Lưu lại thông tin cho lần sau
                                </label>
                            </div>
                            <div className='payment-methods flex flex-col gap-2'>
                                <div>
                                    Chúng tôi cam kết tất cả sản phẩm đều là hàng thật, nguồn gốc rõ ràng. Nói không với hàng
                                    giả. hoàn tiền nếu phát hiện sai cam kết.
                                </div>
                                <div>
                                    <FontAwesomeIcon className='mx-6' icon={faComments} style={{ color: '#74C0FC' }} />
                                    Liên hệ Zalo [096x.xxx.xxx] để được tư vấn nhanh chóng!
                                </div>
                            </div>
                            <button className='w-full mt-4 px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition'>
                                Tiếp tục phương thức thanh toán
                            </button>
                        </form>
                    </div>
                </div>

                <div className='cart-right basis-full md:basis-1/3 bg-gray-50 p-6 flex flex-col'>
                    <div className='rounded-lg shadow-md p-4 mb-6 bg-white'>
                        <h2 className='text-xl font-bold mb-4 text-black'>Tóm Tắt Đơn Hàng</h2>
                        <div className='order-summary text-sm mb-6 text-black'>
                            <div className='flex justify-between mb-1'>
                                <span>1 Sản phẩm</span>
                                <span>120.000₫</span>
                            </div>
                            <div className='flex justify-between mb-1'>
                                <span>Giá gốc</span>
                                <span>800.000₫</span>
                            </div>
                            <div className='flex justify-between mb-1'>
                                <span>Giao hàng</span>
                                <span>0₫</span>
                            </div>
                            <div className='flex justify-between font-bold mb-1'>
                                <span>Tổng cộng</span>
                                <span>1.800.000₫</span>
                            </div>
                            <div className='flex justify-between text-xs text-gray-500'>
                                <span>(Đã bao gồm thuế 14.074₫)</span>
                                <span>14.074₫</span>
                            </div>
                        </div>
                        <div className='flex items-center mb-6'>
                            <input
                                type='text'
                                placeholder='Nhập Khuyến Mãi Của Bạn'
                                className='w-2/3 border rounded-full px-3 py-2 text-black'
                            />
                            <button
                                type='button'
                                className='ml-3 px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition'
                            >
                                Áp dụng
                            </button>
                        </div>
                    </div>

                    <div className='rounded-lg shadow-md mt-6 p-4 bg-white'>
                        <h3 className='font-semibold mb-2 text-black'>Chi tiết đơn hàng (1)</h3>
                        <div className='order-item flex items-center gap-3'>
                            <img
                                src='https://via.placeholder.com/50'
                                alt='ADIDAS 4DFWD X PARLEY Running Shoes'
                                className='w-12 h-12 rounded border'
                            />
                            <div className='item-details'>
                                <span className='item-name font-medium text-black'>
                                    ADIDAS 4DFWD X PARLEY Running Shoes
                                </span>
                                <br />
                                <span className='item-price text-blue-600'>$125.00</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Payment;