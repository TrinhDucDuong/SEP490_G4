import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { Search } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const MapClickHandler = ({ onMapClick }) => {
    useMapEvents({
        click(e) {
            onMapClick(e.latlng);
        },
    });
    return null;
};

const MapSelector = ({
                         selectedPosition,
                         onPositionChange,
                         center = [21.028511, 105.804817],
                         zoom = 13,
                         height = "300px"
                     }) => {
    const [mapKey, setMapKey] = useState(0);
    const [mapCenter, setMapCenter] = useState(center);
    const [mapZoom, setMapZoom] = useState(zoom);
    const [searchValue, setSearchValue] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    // Force re-render map when modal opens
    useEffect(() => {
        const timer = setTimeout(() => {
            setMapKey(prev => prev + 1);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    const handleMapClick = (latlng) => {
        onPositionChange(latlng);
    };

    // Search location using Nominatim API (OpenStreetMap)
    const searchLocation = async () => {
        if (!searchValue.trim()) return;

        setIsSearching(true);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchValue)}&countrycodes=vn&limit=1`
            );
            const data = await response.json();

            if (data && data.length > 0) {
                const result = data[0];
                const lat = parseFloat(result.lat);
                const lng = parseFloat(result.lon);

                setMapCenter([lat, lng]);
                setMapZoom(15);
                setMapKey(prev => prev + 1); // Force re-render map

                // Auto select this position
                onPositionChange({ lat, lng });
            } else {
                alert('Không tìm thấy địa điểm này. Vui lòng thử lại với từ khóa khác.');
            }
        } catch (error) {
            console.error('Search error:', error);
            alert('Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại.');
        } finally {
            setIsSearching(false);
        }
    };

    const handleSearchKeyPress = (e) => {
        if (e.key === 'Enter') {
            searchLocation();
        }
    };

    return (
        <div className="space-y-3">
            {/* Search Box */}
            <div className="flex gap-2">
                <div className="flex-1 relative">
                    <input
                        type="text"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onKeyPress={handleSearchKeyPress}
                        placeholder="Tìm kiếm địa điểm (VD: Hà Nội,...)"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <Search size={20} className="absolute left-3 top-2.5 text-gray-400" />
                </div>
                <button
                    onClick={searchLocation}
                    disabled={isSearching || !searchValue.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {isSearching ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            Đang tìm...
                        </>
                    ) : (
                        <>
                            <Search size={16} />
                            Tìm kiếm
                        </>
                    )}
                </button>
            </div>

            {/* Map */}
            <div style={{ height }} className="border border-gray-300 rounded-md">
                <MapContainer
                    key={mapKey}
                    center={mapCenter}
                    zoom={mapZoom}
                    style={{ width: '100%', height: '100%' }}
                    whenReady={() => {
                        // Force invalidate size after render
                        setTimeout(() => {
                            window.dispatchEvent(new Event('resize'));
                        }, 200);
                    }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <MapClickHandler onMapClick={handleMapClick} />
                    {selectedPosition && (
                        <Marker position={[selectedPosition.lat, selectedPosition.lng]}>
                            <Popup>
                                Vị trí đã chọn<br />
                                {selectedPosition.lat.toFixed(6)}, {selectedPosition.lng.toFixed(6)}
                            </Popup>
                        </Marker>
                    )}
                </MapContainer>
            </div>

            {/* Selected Position Info */}
            {selectedPosition && (
                <div className="p-3 bg-blue-50 rounded-md">
                    <p className="text-sm text-blue-800">
                        <strong>Vị trí đã chọn:</strong><br />
                        Vĩ độ: {selectedPosition.lat.toFixed(6)}<br />
                        Kinh độ: {selectedPosition.lng.toFixed(6)}
                    </p>
                </div>
            )}

            {/* Instructions */}
            <div className="text-xs text-gray-500">
                <p>💡 <strong>Hướng dẫn:</strong></p>
                <p>• Tìm kiếm địa điểm trong ô tìm kiếm hoặc click trực tiếp trên bản đồ</p>
                <p>• Click vào vị trí trên bản đồ để chọn tọa độ chính xác</p>
            </div>
        </div>
    );
};

export default MapSelector;
