import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Layout
import CustomerLayout from './layouts/CustomerLayout';
import AdminLayout from './layouts/AdminLayout';

// Customer pages
import Home from './pages/Customer/Home';
import ProductList from './pages/Customer/ProductList';
import ProductDetail from './pages/Customer/ProductDetails';
import Login from './pages/Customer/Login';
import Register from './pages/Customer/Register';
import ForgotPassword from './pages/Customer/ForgotPassword';
import Cart from './pages/Customer/Cart';
import Payment from './pages/Customer/Payment';
import NotFound from './pages/Customer/NotFound';

import ProfileLayout from './pages/Customer/Profile/ProfileLayout';
import Info from './pages/Customer/Profile/Information/Info';
import Address from './pages/Customer/Profile/Address/Address';
import ChangePassword from './pages/Customer/Profile/Information/ChangePassword';
import Notifications from './pages/Customer/Profile/Setting/Notifications';
import Privacy from './pages/Customer/Profile/Setting/Privacy';
import OrderHistory from './pages/Customer/Profile/Order/OrderHistory';

// Admin pages
import InstructionManagement from './pages/Staff/InstructionManagement';
import PoliciesManagement from './pages/Staff/PoliciesManagement';
import AboutUsManagement from './pages/Staff/AboutUsManagement';
import CustomerList from './pages/Staff/CustomerList';
import OrderManagement from './pages/Staff/OrderManagement';
import CategoryManagement from './pages/Staff/CategoryManagement';
import ProductType from './pages/Staff/ProductType';
import BrandManagement from './pages/Staff/BrandManagement';
import ProductManagement from './pages/Staff/ProductManagement';
import EmployeeManagement from './pages/Staff/EmployeeManagement';

function App() {
    return (
        <AuthProvider>
                <ToastContainer position="top-right" autoClose={3000} />
                <Routes>
                    {/* Customer layout & routes */}
                    <Route path="/" element={<CustomerLayout />}>
                        <Route index element={<Home />} />
                        <Route path="products" element={<ProductList />} />
                        <Route path="products/:id" element={<ProductDetail />} />
                        <Route path="login" element={<Login />} />
                        <Route path="register" element={<Register />} />
                        <Route path="forgot-password" element={<ForgotPassword />} />
                        <Route path="cart" element={<Cart />} />
                        <Route path="payment" element={<Payment />} />
                        <Route path="profile" element={<ProfileLayout />}>
                            <Route index element={<Info />} />
                            <Route path="address" element={<Address />} />
                            <Route path="change-password" element={<ChangePassword />} />
                            <Route path="notifications" element={<Notifications />} />
                            <Route path="order-history" element={<OrderHistory />} />
                            <Route path="privacy" element={<Privacy />} />
                        </Route>
                        <Route path="*" element={<NotFound />} />
                    </Route>

                    {/* Admin layout & routes */}
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route path="instruction-management" element={<InstructionManagement />} />
                        <Route path="policies-management" element={<PoliciesManagement />} />
                        <Route path="store-management" element={<AboutUsManagement />} />
                        <Route path="customers" element={<CustomerList />} />
                        <Route path="orders" element={<OrderManagement />} />
                        <Route path="categories" element={<CategoryManagement />} />
                        <Route path="product-types" element={<ProductType />} />
                        <Route path="brands" element={<BrandManagement />} />
                        <Route path="products-management" element={<ProductManagement />} />
                        <Route path="employee-management" element={<EmployeeManagement />} />
                        <Route path="feedbacks" element={<div>Feedbacks Page</div>} />
                        <Route path="statistics" element={<div>Statistics Page</div>} />
                        <Route path="campaign-management" element={<div>Campaign Management Page</div>} />
                        <Route path="settings-management" element={<div>Settings Management Page</div>} />
                        <Route path="logout" element={<div>Logout Page</div>} />
                    </Route>
                </Routes>
        </AuthProvider>
    );
}

export default App;
