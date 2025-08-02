import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

import { Card } from "../../../components/ui/position/Card";
import { useFetchStores } from "../../../hooks/Customer/useFetchStores";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const StoreAddress = () => {
     const { stores, loading, error } = useFetchStores();
    //
    // const mockStores = [
    //     {
    //         id: 1,
    //         name: "Cửa hàng Hồ Chí Minh",
    //         address: "123 Lê Lợi, Quận 1, TP.HCM",
    //         phone: "0909123456",
    //         city: "Hồ Chí Minh",
    //         district: "Quận 1",
    //         openingHours: "08:00 - 21:00",
    //         location: {
    //             lat: 10.7769,
    //             lng: 106.7009
    //         },
    //         hasValidLocation: true
    //     },
    //     {
    //         id: 2,
    //         name: "Cửa hàng Hà Nội",
    //         address: "456 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
    //         phone: "0912345678",
    //         city: "Hà Nội",
    //         district: "Cầu Giấy",
    //         openingHours: "09:00 - 22:00",
    //         location: {
    //             lat: 21.0381,
    //             lng: 105.7829
    //         },
    //         hasValidLocation: true
    //     },
    //     {
    //         id: 3,
    //         name: "Cửa hàng Đà Nẵng",
    //         address: "789 Bạch Đằng, Hải Châu, Đà Nẵng",
    //         phone: "0933456789",
    //         city: "Đà Nẵng",
    //         district: "Hải Châu",
    //         openingHours: "07:30 - 20:30",
    //         location: {
    //             lat: 16.0678,
    //             lng: 108.2208
    //         },
    //         hasValidLocation: true
    //     }
    // ];

    // const stores = mockStores;
    // const loading = false;
    // const error = null;


    console.log(stores);
    const [selectedStore, setSelectedStore] = useState(null);




    return (
        <div className="flex flex-col lg:flex-row gap-6 p-6">
            <div className="w-full lg:w-1/3 mt-2">
                <h2 className="text-2xl font-bold">Danh sách cửa hàng</h2>
                {loading && <p>Đang tải cửa hàng...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {!loading && stores.length === 0 && <p>Không có cửa hàng nào.</p>}
                {stores.map(store => (
                    <Card
                        key={store.id}
                        className="p-4 hover:shadow-lg cursor-pointer border border-gray-200"
                        onClick={() => setSelectedStore(store)}
                    >
                        <h3 className="font-semibold text-lg">{store.name}</h3>
                        <p className="text-sm">{store.address}</p>
                        <div className="flex flex-row">
                            <p className="m-r-2">{store.city}</p>,
                            <p> {store.district}</p>
                        </div>
                        <p className="text-sm text-gray-500">{store.phone}</p>
                        <p className="text-green-600 font-medium">Giờ mở cửa: {store.openingHours}</p>
                    </Card>
                ))}
            </div>

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
                    {stores.map(store => (
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
