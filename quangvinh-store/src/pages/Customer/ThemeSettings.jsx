import { useTheme } from '../../context/ThemeContext.jsx';

function ThemeSettings() {
    const { theme, setTheme } = useTheme();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTheme((prev) => ({ ...prev, [name]: value }));
        localStorage.setItem('theme', JSON.stringify({ ...theme, [name]: value }));
    };

    return (
        <div className="p-6 max-w-lg mx-auto">
            <h2 className="text-xl font-bold mb-4">Chỉnh màu giao diện</h2>
            <div className="space-y-4">
                <label className="block">
                    Màu nền:    
                    <input type="color" name="background" value={theme.background} onChange={handleChange} className="ml-2" />
                </label>
                <label className="block">
                    Màu chữ:
                    <input type="color" name="text" value={theme.text} onChange={handleChange} className="ml-2" />
                </label>
                <label className="block">
                    Màu chính:
                    <input type="color" name="primary" value={theme.primary} onChange={handleChange} className="ml-2" />
                </label>
            </div>
        </div>
    );
}

export default ThemeSettings;
