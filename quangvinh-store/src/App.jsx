import { Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Customer/Home.jsx';
import ProductList from './pages/Customer/ProductList.jsx';
import NotFound from './pages/Customer/NotFound.jsx';
import ThemeSettings from './pages/Customer/ThemeSettings.jsx';
import Login from './pages/Customer/Login.jsx';
import Register from './pages/Customer/Register.jsx';
import ForgotPassword from './pages/Customer/ForgotPassword.jsx';
import ProductDetail from './pages/Customer/ProductDetails.jsx';
import Payment from './pages/Customer/Payment.jsx';
import Error404 from './pages/Customer/Error404.jsx';
import ProfileLayout from "./pages/Customer/Profile/ProfileLayout.jsx";
import Info from './pages/Customer/Profile/Information/Info.jsx';
import Address from "./pages/Customer/Profile/Address/Address.jsx";
import ChangePassword from "./pages/Customer/Profile/Information/ChangePassword.jsx";
import Notifications from "./pages/Customer/Profile/Setting/Notifications.jsx";
import Privacy from "./pages/Customer/Profile/Setting/Privacy.jsx";
import OrderHistory from "./pages/Customer/Profile/Order/OrderHistory.jsx";

import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Cart from "./pages/Customer/Cart.jsx";

function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <ToastContainer position="top-right" autoClose={3000} />
                <div className="flex flex-col min-h-screen">
                    <Header />
                    <main className="flex-grow">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/products" element={<ProductList />} />
                            <Route path="/products/:id" element={<ProductDetail />} />
                            <Route path="/settings" element={<ThemeSettings />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/forgot-password" element={<ForgotPassword />} />
                            <Route path="/cart" element={<Cart />} />
                            <Route path="/payment" element={<Payment />} />
                            <Route path="/error" element={<Error404 />} />
                            <Route path="*" element={<NotFound />} />

                            <Route path="/profile" element={<ProfileLayout />}>
                                <Route index element={<Info />} />
                                <Route path="address" element={<Address />} />
                                <Route path="change-password" element={<ChangePassword />} />
                                <Route path="notifications" element={<Notifications />} />
                                <Route path="order-history" element={<OrderHistory />} />
                                <Route path="privacy" element={<Privacy />} />
                            </Route>
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;
