import { Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Admin/Home.jsx';
import ProductList from './pages/Admin/ProductList.jsx';
import NotFound from './pages/Admin/NotFound.jsx';
import ThemeSettings from './pages/Admin/ThemeSettings.jsx';
import Login from './pages/Admin/Login.jsx';
import Register from './pages/Admin/Register.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import Cart from "./pages/Admin/Cart.jsx";
import ForgotPassword from "./pages/Admin/ForgotPassword.jsx";
import ProductDetail from "./pages/Admin/ProductDetails.jsx";
import Payment from "./pages/Admin/Payment.jsx";


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