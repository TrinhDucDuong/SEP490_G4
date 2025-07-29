import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import {Card} from "../../../components/ui/position/Card.jsx";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const fakeStores = [
    {
        id: 1,
        name: 'ROUTINE BÌNH DƯƠNG',
        address: '229B, Yersin, Phường Phú Cường, Tp Thủ Dầu Một, Bình Dương',
        phone: '02742206988',
        city: 'Bình Dương',
        district: 'Tp Thủ Dầu Một',
        openingHours: '09:00 - 22:00',
        location: { lat: 10.980076, lng: 106.653182 },
    },
    {
        id: 2,
        name: 'ROUTINE ĐÀ LẠT',
        address: '25 Ba Tháng Hai, Đà Lạt',
        phone: '0868672532',
        city: 'Lâm Đồng',
        district: 'Đà Lạt',
        openingHours: '09:00 - 22:00',
        location: { lat: 11.9415, lng: 108.4419 },
    },
    {
        id: 3,
        name: 'ROUTINE VÕ VĂN NGÂN',
        address: '114 Võ Văn Ngân, Thủ Đức, TP.HCM',
        phone: '02866863240',
        city: 'Hồ Chí Minh',
        district: 'Thủ Đức',
        openingHours: '09:00 - 22:00',
        location: { lat: 10.845, lng: 106.758 },
    },
    {
        id: 4,
        name: 'ROUTINE TRẦN ĐẠI NGHĨA',
        address: '47 Trần Đại Nghĩa, Hai Bà Trưng, Hà Nội',
        phone: '02466555588',
        city: 'Hà Nội',
        district: 'Hai Bà Trưng',
        openingHours: '09:00 - 22:00',
        location: { lat: 21.001486, lng: 105.849673 },
    },
    {
        id: 5,
        name: 'ROUTINE VINCOM NGUYỄN CHÍ THANH',
        address: 'Tầng 2, Vincom Center, 54A Nguyễn Chí Thanh, Đống Đa, Hà Nội',
        phone: '02466885699',
        city: 'Hà Nội',
        district: 'Đống Đa',
        openingHours: '09:30 - 22:00',
        location: { lat: 21.021138, lng: 105.813077 },
    },
    {
        id: 6,
        name: 'ROUTINE TIMES CITY',
        address: 'Tầng B1, TTTM Times City, 458 Minh Khai, Hai Bà Trưng, Hà Nội',
        phone: '02466778855',
        city: 'Hà Nội',
        district: 'Hai Bà Trưng',
        openingHours: '09:30 - 22:00',
        location: { lat: 20.996981, lng: 105.869199 },
    },
];

const StoreAddress = () => {
    const [selectedStore, setSelectedStore] = useState(null);

    return (
        <div className="flex flex-col lg:flex-row gap-6 p-6">
            {/* Sidebar Store List */}
            <div className="w-full lg:w-1/3 space-y-4">
                <h2 className="text-2xl font-bold">Danh sách cửa hàng</h2>
                {fakeStores.map(store => (
                    <Card
                        key={store.id}
                        className="p-4 hover:shadow-lg cursor-pointer border border-gray-200"
                        onClick={() => setSelectedStore(store)}
                    >
                        <h3 className="font-semibold text-lg">{store.name}</h3>
                        <p className="text-sm">{store.address}</p>
                        <p className="text-sm text-gray-500">{store.phone}</p>
                        <p className="text-green-600 font-medium">Đang mở cửa: {store.openingHours}</p>
                    </Card>
                ))}
            </div>

            {/* Map */}
            <div className="w-full lg:w-2/3 h-[600px]">
                <MapContainer
                    center={[10.762622, 106.660172]}
                    zoom={6}
                    className="w-full h-full rounded-lg shadow z-0"
                >
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {fakeStores.map(store => (
                        <Marker
                            key={store.id}
                            position={[store.location.lat, store.location.lng]}
                        >
                            <Popup>
                                <strong>{store.name}</strong><br />
                                {store.address}<br />
                                {store.phone}
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
};

export default StoreAddress;
