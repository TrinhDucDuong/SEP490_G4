/**
 * @file StoreAddress.jsx
 * @description Trang hiển thị danh sách cửa hàng và bản đồ tương tác bằng React Leaflet.
 * Cho phép khách hàng chọn cửa hàng từ danh sách, đồng thời map sẽ tự động zoom đến vị trí cửa hàng đó.
 * @author
 *   - ngothangwork
 * @license MIT
 */

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

import { Card } from "../../../components/ui/position/Card";
import { useFetchStores } from "../../../hooks/customer/useFetchStores";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

/**
 * Component phụ: FlyToStore
 *  Khi selectedStore thay đổi, bản đồ sẽ tự động "bay" (flyTo) tới vị trí cửa hàng đó.
 */
function FlyToStore({ store }) {
    const map = useMap();

    useEffect(() => {
        if (store) {
            map.flyTo([store.location.lat, store.location.lng], 16, {
                duration: 1.5 // thời gian animation (giây)
            });
        }
    }, [store, map]);

    return null;
}

/**
 * StoreAddress Component
 *
 * Chức năng:
 * - Hiển thị danh sách cửa hàng (bên trái).
 * - Hiển thị bản đồ Leaflet với marker cho từng cửa hàng (bên phải).
 * - Khi chọn cửa hàng trong danh sách => bản đồ sẽ zoom tới cửa hàng đó.
 */
const StoreAddress = () => {
    const { stores, loading, error } = useFetchStores();
    const [selectedStore, setSelectedStore] = useState(null);

    // Khi dữ liệu stores load xong => tự động chọn cửa hàng đầu tiên
    useEffect(() => {
        if (!loading && stores.length > 0) {
            setSelectedStore(stores[0]);
        }
    }, [loading, stores]);

    return (
        <div className="flex flex-col lg:flex-row gap-6 p-6">
            {/* Sidebar: Danh sách cửa hàng */}
            <div className="w-full lg:w-1/3 mt-2">
                <h2 className="text-2xl font-bold">Danh sách cửa hàng</h2>
                {loading && <p>Đang tải cửa hàng...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {!loading && stores.length === 0 && <p>Không có cửa hàng nào.</p>}

                {stores.map(store => (
                    <Card
                        key={store.id}
                        className={`p-4 hover:shadow-lg cursor-pointer border ${
                            selectedStore?.id === store.id ? "border-blue-500" : "border-gray-200"
                        }`}
                        onClick={() => setSelectedStore(store)}
                    >
                        <h3 className="font-semibold text-lg">{store.name}</h3>
                        <p className="text-sm">{store.address}</p>
                        <div className="flex flex-row">
                            <p className="mr-2">{store.city}</p>,
                            <p>{store.district}</p>
                        </div>
                        <p className="text-sm text-gray-500">{store.phone}</p>
                        <p className="text-green-600 font-medium">
                            Giờ mở cửa: {store.openingHours}
                        </p>
                    </Card>
                ))}
            </div>

            {/* Bản đồ Leaflet */}
            <div className="w-full lg:w-2/3 h-[600px]">
                <MapContainer
                    center={[10.762622, 106.660172]} // toạ độ mặc định (TP.HCM)
                    zoom={6}
                    className="w-full h-full rounded-lg shadow z-0"
                >
                    <TileLayer
                        url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                        attribution="&copy; Google"
                    />

                    {/* Marker cho từng cửa hàng */}
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

                    {/* Auto zoom tới cửa hàng được chọn */}
                    <FlyToStore store={selectedStore} />
                </MapContainer>
            </div>
        </div>
    );
};

export default StoreAddress;
