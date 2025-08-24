import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';

const SingleImageUpload = ({ imageFile, setImageFile, error, setError }) => {
    const [previewUrl, setPreviewUrl] = useState(null);

    // handle file
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            setError('File phải là ảnh!');
            return;
        }
        setError('');
        setImageFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setPreviewUrl(null);
    };

    return (
        <div className="flex items-center gap-4">
            {previewUrl ? (
                <div className="relative">
                    <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <button
                        type="button"
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        onClick={handleRemoveImage}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            ) : (
                <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-xs text-gray-500">Tải ảnh</span>
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </label>
            )}
            {error && <p className="text-red-500 text-xs ml-2 mt-2">{error}</p>}
        </div>
    );
};

export default SingleImageUpload;
