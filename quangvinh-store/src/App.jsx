import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import InstructionManagement from "./pages/Staff/InstructionManagement.jsx";
import PoliciesManagement from "./pages/Staff/PoliciesManagement.jsx";
import AboutUsManagement from "./pages/Staff/AboutUsManagement.jsx";
import CustomerList from "./pages/Staff/CustomerList.jsx";
import OrderManagement from "./pages/Staff/OrderManagement.jsx";
import CategoryManagement from "./pages/Staff/CategoryManagement.jsx";
import ProductType from "./pages/Staff/ProductType.jsx";
import BrandManagement from "./pages/Staff/BrandManagement.jsx";
import ProductManagement from "./pages/Staff/ProductManagement.jsx";
import EmployeeManagement from "./pages/Staff/EmployeeManagement.jsx";

function App() {
    return (
        <AuthProvider>
            <div className="flex flex-col min-h-screen">
                <main className="flex-grow">
                    <Routes>
                        {/* Staff/Admin Routes */}
                        <Route path="/instruction-management" element={<InstructionManagement />} />
                        <Route path="/policies-management" element={<PoliciesManagement />} />
                        <Route path="/store-management" element={<AboutUsManagement />} />
                        <Route path="/customers" element={<CustomerList />} />
                        <Route path="/orders" element={<OrderManagement />} />
                        <Route path="/categories" element={<CategoryManagement />} />
                        <Route path="/product-types" element={<ProductType />} />
                        <Route path="/brands" element={<BrandManagement />} />
                        <Route path="/products-management" element={<ProductManagement />} />
                        <Route path="/feedbacks" element={<div>Feedbacks Page</div>} />
                        <Route path="/statistics" element={<div>Statistics Page</div>} />
                        <Route path="/campaign-management" element={<div>Campaign Management Page</div>} />
                        <Route path="/settings-management" element={<div>Settings Management Page</div>} />
                        <Route path="/logout" element={<div>Logout Page</div>} />
                        <Route path="/employee-management" element={<EmployeeManagement />} />
                    </Routes>
                </main>
            </div>
        </AuthProvider>
    );
}

export default App;
