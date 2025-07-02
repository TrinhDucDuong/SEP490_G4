import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments } from '@fortawesome/free-solid-svg-icons';
import Breadcrumb from '../../components/common/Breadcrumb';
import { AuthContext } from '../../context/AuthContext';

const containerStyle = {
    width: '100%',
    height: '256px',
};

function Payment() {
    const [provinces, setProvinces] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [districts, setDistricts] = useState([]);
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [mapLocation, setMapLocation] = useState(null);
    const [promoList, setPromoList] = useState([]);

    const { user } = useContext(AuthContext);
    const profile = user?.profile;

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: 'AIzaSyDpPC7ZxeuEmixJHUal00qRF0LhLWd_6eQ',
    });

    useEffect(() => {
        fetch('https://provinces.open-api.vn/api/p/')
            .then(res => res.json())
            .then(data => setProvinces(data));
    }, []);

    useEffect(() => {
        if (selectedProvince) {
            fetch(`https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`)
                .then(res => res.json())
                .then(data => setDistricts(data.districts || []));
        } else {
            setDistricts([]);
        }
    }, [selectedProvince]);

    useEffect(() => {
        setPromoList(['GIAM10', 'FREESHIP', 'THANG7SALE']);
    }, []);

    const handleGetLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    setMapLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                error => {
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

            <div className='flex flex-col md:flex-row gap-8 md:gap-12 p-4 md:p-8 min-h-screen items-stretch'>
                {/* LEFT */}
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
                                    Xin chào, {profile.firstName} {profile.lastName}
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

                    <form className='space-y-4'>
                        <div className='flex gap-4'>
                            <input
                                type='text'
                                name='firstname'
                                placeholder='Tên đệm*'
                                defaultValue={profile?.firstName || ''}
                                className='w-full border rounded-xl px-3 py-2 text-black'
                            />
                            <input
                                type='text'
                                name='lastname'
                                placeholder='Tên*'
                                defaultValue={profile?.lastName || ''}
                                className='w-full border rounded-xl px-3 py-2 text-black'
                            />
                        </div>

                        <input
                            type='email'
                            name='email'
                            placeholder='Email'
                            defaultValue={profile?.email || ''}
                            className='w-full border rounded-xl px-3 py-2 text-black'
                        />

                        <input
                            type='number'
                            name='phone_number'
                            placeholder='Số điện thoại*'
                            required
                            defaultValue={profile?.phoneNumber || ''}
                            className='w-full border rounded-xl px-3 py-2 text-black'
                        />

                        <div className='flex'>
                            <select
                                value={selectedProvince}
                                onChange={(e) => {
                                    setSelectedProvince(e.target.value);
                                    setSelectedDistrict('');
                                }}
                                className='w-full border rounded-xl px-3 py-2 mb-2 mr-2 text-black'
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
                                className='w-full border rounded-xl px-3 py-2 mb-2 text-black disabled:bg-gray-100'
                            >
                                <option value=''>Chọn quận/huyện</option>
                                {districts.map((d) => (
                                    <option key={d.code} value={d.code}>
                                        {d.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <input
                            type='text'
                            placeholder='Địa chỉ*'
                            className='w-full border rounded-xl px-3 py-2 text-black'
                        />

                        <div className='relative w-full h-64 bg-gray-200 rounded-lg mb-2'>
                            {isLoaded && mapLocation && (
                                <GoogleMap
                                    mapContainerStyle={containerStyle}
                                    center={mapLocation}
                                    zoom={15}
                                >
                                    <Marker position={mapLocation} />
                                </GoogleMap>
                            )}
                            <button
                                type='button'
                                onClick={handleGetLocation}
                                className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-2 bg-black text-white rounded-full hover:bg-white hover:text-black opacity-50 transition'
                            >
                                + Thêm vị trí
                            </button>
                        </div>

                        <div className='flex gap-2'>
                            <button type='button' className='px-3 py-1 border border-black bg-white text-black rounded-full hover:bg-gray-300'>
                                Nhà riêng
                            </button>
                            <button type='button' className='px-3 py-1 border border-black bg-white text-black rounded-full hover:bg-gray-300'>
                                Văn phòng
                            </button>
                        </div>

                        <div className='flex flex-col gap-2'>
                            <label className='flex items-center gap-2 text-black'>
                                <input type='checkbox' /> Gửi cho tôi các tin tức ưu đãi qua Email
                            </label>
                            <label className='flex items-center gap-2 text-black'>
                                <input type='checkbox' /> Lưu lại thông tin cho lần sau
                            </label>
                        </div>

                        <div className='text-sm text-black bg-gray-50 p-3 rounded-md'>
                            <p>Chúng tôi cam kết tất cả sản phẩm đều là hàng thật, nguồn gốc rõ ràng.</p>
                            <p className='mt-2'>
                                <FontAwesomeIcon icon={faComments} className='mr-2 text-blue-400' />
                                Liên hệ Zalo [096x.xxx.xxx] để được tư vấn nhanh chóng!
                            </p>
                        </div>

                        <button className='w-full mt-4 px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition'>
                            Tiếp tục phương thức thanh toán
                        </button>
                    </form>
                </div>

                {/* RIGHT */}
                <div className='basis-full md:basis-1/3 bg-gray-50 p-6 flex flex-col'>
                    <div className='rounded-lg shadow-md p-4 mb-6 bg-white'>
                        <h2 className='text-xl font-bold mb-4 text-black'>Tóm Tắt Đơn Hàng</h2>

                        <div className='text-sm mb-6 text-black'>
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

                        {promoList.length > 0 && (
                            <div className='flex flex-col gap-2 mb-4'>
                                <label className='text-sm text-black'>Chọn mã khuyến mãi</label>
                                <select className='border px-3 py-2 rounded-full text-black'>
                                    <option value=''>-- Chọn mã --</option>
                                    {promoList.map((code) => (
                                        <option key={code} value={code}>
                                            {code}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    <div className='rounded-lg shadow-md mt-6 p-4 bg-white'>
                        <h3 className='font-semibold mb-2 text-black'>Chi tiết đơn hàng (1)</h3>
                        <div className='flex items-center gap-3'>
                            <img
                                src='https://via.placeholder.com/50'
                                alt='ADIDAS 4DFWD X PARLEY Running Shoes'
                                className='w-12 h-12 rounded border'
                            />
                            <div>
                                <span className='font-medium text-black'>
                                    ADIDAS 4DFWD X PARLEY Running Shoes
                                </span>
                                <br />
                                <span className='text-blue-600'>125.000₫</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Payment;
