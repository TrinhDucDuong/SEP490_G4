import React, { useEffect, useState } from 'react';
import ProvinceSelect from './ProvinceSelect.jsx';
import WardSelect from './WardSelect.jsx';

const AddressSelector = () => {
    const [rawData, setRawData] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [wards, setWards] = useState([]);
    const [selectedWard, setSelectedWard] = useState('');

    useEffect(() => {
        fetch('https://api.luat.ai/administrative')
            .then((res) => res.json())
            .then((data) => {
                const newData = data.filter((d) => d.type === 'new');
                setRawData(newData);

                const uniqueProvinces = Array.from(new Set(newData.map((item) => item.newProvince)));
                setProvinces(uniqueProvinces);
            })
            .catch((err) => console.error('Error fetching data:', err));
    }, []);

    useEffect(() => {
        if (selectedProvince) {
            const filteredWards = rawData
                .filter((item) => item.newProvince === selectedProvince)
                .map((item) => item.newWard);
            const uniqueWards = Array.from(new Set(filteredWards));
            setWards(uniqueWards);
        } else {
            setWards([]);
        }
    }, [selectedProvince, rawData]);

    return (
        <div>
            <ProvinceSelect
                provinces={provinces}
                selectedProvince={selectedProvince}
                onSelectProvince={setSelectedProvince}
            />
            <WardSelect
                wards={wards}
                selectedWard={selectedWard}
                onSelectWard={setSelectedWard}
            />
        </div>
    );
};

export default AddressSelector;
