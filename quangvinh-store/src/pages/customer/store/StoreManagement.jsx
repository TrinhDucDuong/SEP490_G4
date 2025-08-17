import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Card } from "@/components/ui/card";

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
];

const StoreManagement = () => {
    const [selectedStore, setSelectedStore] = useState(null);

    return (
        <div className="flex flex-col lg:flex-row gap-6 p-6">
            {/* Sidebar store List */}
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
                    className="w-full h-full rounded-lg shadow"
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

export default StoreManagement;
