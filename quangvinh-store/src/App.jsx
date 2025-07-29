import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { AuthProvider, AuthContext } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { AuthProviderForManager } from './context/AuthContextForManager.jsx';

// Layouts
import CustomerLayout from './layouts/CustomerLayout';
import AdminLayout from './layouts/AdminLayout';

// Customer Pages
import Home from './pages/Customer/Home/Home.jsx';
import ProductList from './pages/Customer/Product/ProductList.jsx';
import ProductDetail from './pages/Customer/Product/ProductDetails.jsx';
import Login from './pages/Customer/Login/Login.jsx';
import Register from './pages/Customer/Login/Register.jsx';
import ForgotPassword from './pages/Customer/Login/ForgotPassword.jsx';
import Cart from './pages/Customer/Cart/Cart.jsx';
import Payment from './pages/Customer/Payment/Payment.jsx';
import NotFound from './pages/Customer/Common/NotFound.jsx';
import ProfileLayout from './pages/Customer/Profile/ProfileLayout';
import Info from './pages/Customer/Profile/Information/Info';
import Address from './pages/Customer/Profile/Address/Address';
import ChangePassword from './pages/Customer/Profile/Information/ChangePassword';
import Notifications from './pages/Customer/Profile/Setting/Notifications';
import Privacy from './pages/Customer/Profile/Setting/Privacy';
import OrderHistory from './pages/Customer/Profile/Order/OrderHistory';
import PolicyPage from "./pages/Customer/Policy/PolicyPage.jsx";
import InstructionPage from "./pages/Customer/Instruction/InstructionPage.jsx";
import SocialCallback from "./pages/Customer/Login/SocialCallback.jsx";
import OAuth2RedirectHandler from "./components/common/Customer/OAuth2RedirectHandler.jsx";
import BlogDetail from "./pages/Customer/Blog/BlogDetail.jsx";
import BlogList from "./pages/Customer/Blog/BlogList.jsx";

// Admin Pages
import InstructionManagement from './pages/Staff/InstructionManagement';
import AboutUsManagement from './pages/Staff/AboutUsManagement';
import CustomerList from './pages/Staff/Customer/CustomerList.jsx';
import OrderManagement from './pages/Staff/Order/OrderManagement';
import EmployeeManagement from './pages/Admin/Employee/EmployeeManagement.jsx';
import CategoryManagement from "./pages/Staff/Category/CategoryManagement.jsx";
import BrandManagement from "./pages/Staff/Brand/BrandManagement.jsx";
import ProductManagement from "./pages/Staff/Product/ProductManagement.jsx";
import BlogManagement from "./pages/Admin/Blog/BlogManagement.jsx";
import BlogDetailManager from "./pages/Admin/Blog/BlogDetailManager.jsx";
import BlogForm from "./pages/Admin/Blog/BlogForm.jsx";
import ProtectedRouteForManager from "./components/auth/ProtectedRouteForManager.jsx";
import LoginForManager from "./pages/Admin/LoginForManager.jsx";
import PaymentMethod from "./pages/Customer/Payment/PaymentMethod.jsx";
import OrderDetail from "./pages/Customer/Profile/Order/OrderDetails.jsx";
import PoliciesManagement from "./pages/Staff/Policy/PoliciesManagement.jsx";
import ProtectedRoute from "./components/common/Customer/Protecter/ProtectedRoute.jsx";
import DashboardManagement from "./pages/Admin/Dashboard/DashboardManagement";
import StarRateManagement from "./pages/Staff/StarRate/StarRateManagement";
import StoreManagement from "./pages/Admin/Store/StoreManagement.jsx";
import SNSManagement from "./pages/Admin/SNS/SNSManagement.jsx";
import Feedback from "./pages/Customer/Feedback/Feedback.jsx";
import StoreAdress from "./pages/Customer/Store/StoreAdress.jsx";
import ProductReviewPage from "./pages/Customer/ProductReview/ProductReviewPage.jsx";


function App() {
    return (
        <AuthProvider>
            <AuthProviderForManager>
                <CartProviderWrapper>
                    <ToastContainer position="top-right" autoClose={3000} />

                    <Routes>
                        <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
                        <Route path="/" element={<CustomerLayout />}>

                            <Route index element={<Home />} />
                            <Route path="products" element={<ProductList />} />
                            <Route path="products/:id" element={<ProductDetail />} />
                            <Route path="login" element={<Login />} />
                            <Route path="register" element={<Register />} />
                            <Route path="forgot-password" element={<ForgotPassword />} />
                            <Route path="feedbacks" element={<Feedback/>} />
                            <Route path="stores" element={<StoreAdress/>} />

                            <Route path="policies" element={<PolicyPage />} />
                            <Route path="policies/:id" element={<PolicyPage />} />
                            <Route path="instructions" element={<InstructionPage />} />
                            <Route path="instructions/:id" element={<InstructionPage />} />
                            <Route path="/social-callback" element={<SocialCallback />} />
                            <Route path="/blogs" element={<BlogList />} />
                            <Route path="/blog/:blogId" element={<BlogDetail />} />
                            <Route path="cart" element={
                                <ProtectedRoute>
                                    <Cart />
                                </ProtectedRoute>
                            } />
                            <Route path="payment" element={<Payment />} />
                            <Route path="payment-method" element={<PaymentMethod />} />

                            <Route path="review" element={
                                <ProtectedRoute>
                                    <ProductReviewPage />
                                </ProtectedRoute>
                            } />


                            <Route path="profile" element={
                                <ProtectedRoute>
                                    <ProfileLayout />
                                </ProtectedRoute>
                            }>
                                <Route index element={<Info />} />
                                <Route path="address" element={<Address />} />
                                <Route path="change-password" element={<ChangePassword />} />
                                <Route path="notifications" element={<Notifications />} />
                                <Route path="order-history" element={<OrderHistory />} />
                                <Route path="orders/:orderId" element={<OrderDetail />} />
                                <Route path="privacy" element={<Privacy />} />
                            </Route>
                            <Route path="*" element={<NotFound />} />
                        </Route>

                        {/* Admin routes */}
                        <Route path="/admin/login" element={<LoginForManager />} />
                        <Route path="/admin" element={<Navigate to="/admin/category-management" replace />} />
                        <Route path="/admin" element={
                            <ProtectedRouteForManager>
                                <AdminLayout />
                            </ProtectedRouteForManager>
                        }>
                            <Route path="blogs" element={<BlogManagement />} />
                            <Route path="blogs/:id" element={<BlogDetailManager />} />
                            <Route path="blogs/create" element={<BlogForm />} />
                            <Route path="blogs/:id/edit" element={<BlogForm isEdit />} />
                            <Route path="category-management" element={<CategoryManagement />} />
                            <Route path="products-management" element={<ProductManagement />} />
                            <Route path="brands-management" element={<BrandManagement />} />
                            <Route path="customers-management" element={<CustomerList />} />
                            <Route path="orders-management" element={<OrderManagement />} />
                            <Route path="employee-management" element={<EmployeeManagement />} />
                            <Route path="customer-list" element={<CustomerList />} />
                            <Route path="order-management" element={<OrderManagement />} />
                            <Route path="instruction-management" element={<InstructionManagement />} />
                            <Route path="policies-management" element={<PoliciesManagement />} />
                            <Route path="about-us-management" element={<AboutUsManagement />} />
                            <Route path="star-rate-management" element={<StarRateManagement/>} />
                            <Route path="dashboard" element={<DashboardManagement/>} />
                            <Route path="campaign-management" element={<div className="p-6 bg-white rounded-lg shadow">Campaign Management Page</div>} />
                            <Route path="store-management" element={< StoreManagement/>} />
                            <Route path="settings-management" element={<div className="p-6 bg-white rounded-lg shadow">Settings Management Page</div>} />
                            <Route path="sns-management" element={< SNSManagement/>} />
                        </Route>
                    </Routes>
                </CartProviderWrapper>
            </AuthProviderForManager>
        </AuthProvider>
    );
}

const CartProviderWrapper = ({ children }) => {
    const accountId = localStorage.getItem('accountId');
    const { account, token } = useContext(AuthContext);
    return (
        <CartProvider accountId={accountId} token={token}>
            {children}
        </CartProvider>
    );
};

export default App;
