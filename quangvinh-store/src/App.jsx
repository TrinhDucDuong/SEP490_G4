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
import InstructionManagement from "./pages/Staff/InstructionManagement.jsx";
import PoliciesManagement from "./pages/Staff/PoliciesManagement.jsx";
import AboutUsManagement from "./pages/Staff/AboutUsManagement.jsx";
import CustomerList from "./pages/Staff/CustomerList.jsx";



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
                        {/*<Route path="/instruction" element={<Instruction />} />*/}
                        <Route path="/instruction-management" element={<InstructionManagement />} />
                        {/*<Route path="/policies" element={<Policies />} />*/}
                        <Route path="/policies-management" element={<PoliciesManagement />} />
                        {/*<Route path="/about-us" element={<AboutUs />} />*/}
                        <Route path="/store-management" element={<AboutUsManagement />} />
                        <Route path="/products" element={<div>Products Page</div>} />
                        <Route path="/categories" element={<div>Categories Page</div>} />
                        <Route path="/customers" element={<CustomerList />} />
                        <Route path="/orders" element={<div>Orders Page</div>} />
                        <Route path="/feedbacks" element={<div>Feedbacks Page</div>} />
                        <Route path="/statistics" element={<div>Statistics Page</div>} />
                        <Route path="/staff" element={<div>Staff Page</div>} />
                        <Route path="/campaign-management" element={<div>Campaign Management Page</div>} />
                        <Route path="/settings" element={<div>Settings Page</div>} />
                        <Route path="/logout" element={<div>Logout Page</div>} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </AuthProvider>
    );
}

export default App;