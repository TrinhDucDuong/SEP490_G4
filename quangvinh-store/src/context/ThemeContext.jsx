import { createContext, useState, useContext } from 'react';

// Tạo Context để quản lý theme của ứng dụng
const ThemeContext = createContext();

// Provider để bọc quanh các component cần truy cập theme
export const ThemeProvider = ({ children }) => {
    // State lưu thông tin theme hiện tại
    const [theme, setTheme] = useState({
        primary: '#000000',      // Màu chủ đạo
        background: '#ffffff',   // Màu nền
        text: '#000000'          // Màu chữ
    });

    // Trả về Provider chứa giá trị theme và hàm setTheme
    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// Custom hook tiện lợi để các component khác sử dụng theme
export const useTheme = () => useContext(ThemeContext);
