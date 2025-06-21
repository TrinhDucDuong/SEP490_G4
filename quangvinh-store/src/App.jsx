import { Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Customer/Home.jsx';
import ProductList from './pages/Customer/ProductList.jsx';
import NotFound from './pages/Customer/NotFound.jsx';
import ThemeSettings from './pages/Customer/ThemeSettings.jsx';
import Login from './pages/Customer/Login.jsx';
import Register from './pages/Customer/Register.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import Cart from "./pages/Customer/Cart.jsx";
import ForgotPassword from "./pages/Customer/ForgotPassword.jsx";
import ProductDetail from "./pages/Customer/ProductDetails.jsx";
import Payment from "./pages/Customer/Payment.jsx";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';



function App() {
    return (
        <AuthProvider>
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/products" element={<ProductList />} />
                        <Route path="/settings" element={<ThemeSettings />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="*" element={<NotFound />} />z
                        <Route path="/products/:id" element={<ProductDetail />} />
                        <Route path="/payment" element={<Payment />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </AuthProvider>
    );
}

export default App;