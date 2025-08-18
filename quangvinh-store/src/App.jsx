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
import ManagerLayout from './layouts/ManagerLayout';

// customer Pages
import Home from './pages/customer/home/Home.jsx';
import ProductList from './pages/customer/product/ProductList.jsx';
import ProductDetail from './pages/customer/product/ProductDetails.jsx';
import Login from './pages/customer/login/Login.jsx';
import Register from './pages/customer/login/Register.jsx';
import ForgotPassword from './pages/customer/login/ForgotPassword.jsx';
import Cart from './pages/customer/cart/Cart.jsx';
import Payment from './pages/customer/payment/Payment.jsx';
import NotFound from './pages/customer/common/NotFound.jsx';
import ProfileLayout from './pages/customer/profile/ProfileLayout';
import Info from './pages/customer/profile/Information/Info';
import Address from './pages/customer/profile/Address/Address';
import ChangePassword from './pages/customer/profile/Information/ChangePassword';
import Notifications from './pages/customer/profile/Setting/Notifications';
import Privacy from './pages/customer/profile/Setting/Privacy';
import OrderHistory from './pages/customer/profile/Order/OrderHistory';
import PolicyPage from "./pages/customer/policy/PolicyPage.jsx";
import InstructionPage from "./pages/customer/instruction/InstructionPage.jsx";
import SocialCallback from "./pages/customer/login/SocialCallback.jsx";
import OAuth2RedirectHandler from "./components/common/customer/OAuth2RedirectHandler.jsx";
import BlogDetail from "./pages/customer/blog/BlogDetail.jsx";
import BlogList from "./pages/customer/blog/BlogList.jsx";

// admin Pages
import InstructionManagement from './pages/staff/Instruction/InstructionManagement.jsx';
import AboutUsManagement from './pages/staff/AboutUsManagement';
import CustomerList from './pages/staff/Customer/CustomerList.jsx';
import OrderManagement from './pages/staff/Order/OrderManagement';
import EmployeeManagement from './pages/admin/Employee/EmployeeManagement.jsx';
import CategoryManagement from "./pages/staff/Category/CategoryManagement.jsx";
import BrandManagement from "./pages/staff/Brand/BrandManagement.jsx";
import ProductManagement from "./pages/staff/Product/ProductManagement.jsx";
import BlogManagement from "./pages/admin/Blog/BlogManagement.jsx";
import BlogDetailManager from "./pages/admin/Blog/BlogDetailManager.jsx";
import BlogForm from "./pages/admin/Blog/BlogForm.jsx";
import ProtectedRouteForManager from "./components/auth/ProtectedRouteForManager.jsx";
import LoginForManager from "./pages/admin/LoginForManager.jsx";
import PaymentMethod from "./pages/customer/payment/PaymentMethod.jsx";
import OrderDetail from "./pages/customer/profile/Order/OrderDetails.jsx";
import PoliciesManagement from "./pages/staff/Policy/PoliciesManagement.jsx";
import ProtectedRoute from "./components/common/customer/Protecter/ProtectedRoute.jsx";
import DashboardManagement from "./pages/admin/Dashboard/DashboardManagement";
import StarRateManagement from "./pages/staff/StarRate/StarRateManagement";
import StoreManagement from "./pages/admin/Store/StoreManagement.jsx";
import SNSManagement from "./pages/admin/SNS/SNSManagement.jsx";
import Feedback from "./pages/customer/feedback/Feedback.jsx";
import StoreAdress from "./pages/customer/store/StoreAdress.jsx";
import ProductReviewPage from "./pages/customer/productReview/ProductReviewPage.jsx";
import PaymentResult from "./pages/customer/payment/PaymentResult.jsx";
import CheckoutPage from "./pages/customer/payment/CheckoutPage.jsx";
import TrackOrderPage from "./pages/customer/trackingOrder/TrackOrderPage.jsx";
import OrderTrackingDetail from "./pages/customer/trackingOrder/OrderTrackingDetail.jsx";
import BuyNow from "./pages/customer/payment/BuyNow.jsx";
import BannerManagement from "./pages/staff/Banner/BannerManagement.jsx";


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
                            <Route path="products/detail" element={<ProductDetail />} />
                            <Route path="login" element={<Login />} />
                            <Route path="register" element={<Register />} />
                            <Route path="forgot-password" element={<ForgotPassword />} />
                            <Route path="feedbacks" element={<Feedback/>} />
                            <Route path="stores" element={<StoreAdress/>} />
                            <Route path="/track-order" element={<TrackOrderPage />} />
                            <Route path="/track-order/:orderId" element={<OrderTrackingDetail />} />
                            <Route path="policies" element={<PolicyPage />} />
                            <Route path="policies/:id" element={<PolicyPage />} />
                            <Route path="instructions" element={<InstructionPage />} />
                            <Route path="instructions/:id" element={<InstructionPage />} />
                            <Route path="/social-callback" element={<SocialCallback />} />
                            <Route path="/blogs" element={<BlogList />} />
                            <Route path="/buy-now" element={<BuyNow />} />

                            <Route path="/blog/:blogId" element={<BlogDetail />} />
                            <Route path="cart" element={
                                <ProtectedRoute>
                                    <Cart />
                                </ProtectedRoute>
                            } />
                            <Route path="payment" element={<Payment />} />
                            <Route path="payment-method" element={<PaymentMethod />} />
                            <Route path="checkout" element={<CheckoutPage/>} />
                            <Route path="/order/payment" element={<PaymentResult />} />
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
                        <Route path="/manager/login" element={<LoginForManager />} />
                        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
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
                            <Route path="banner-management" element={<BannerManagement/>} />
                            <Route path="store-management" element={< StoreManagement/>} />
                            <Route path="sns-management" element={<SNSManagement/>} />
                        </Route>

                        {/* Staff routes */}
                        <Route path="/manager/login" element={<LoginForManager />} />
                        <Route path="/staff" element={<Navigate to="/staff/products-management" replace />} />
                        <Route path="/staff" element={
                            <ProtectedRouteForManager>
                                <ManagerLayout />
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
                            <Route path="customer-list" element={<CustomerList />} />
                            <Route path="order-management" element={<OrderManagement />} />
                            <Route path="instruction-management" element={<InstructionManagement />} />
                            <Route path="policies-management" element={<PoliciesManagement />} />
                            <Route path="star-rate-management" element={<StarRateManagement/>} />
                            <Route path="banner-management" element={<BannerManagement/>} />
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
