import React from 'react';
import { Routes, Route } from 'react-router-dom';
import InstructionManagement from "../pages/Staff/InstructionManagement.jsx";
import PoliciesManagement from "../pages/Staff/PoliciesManagement.jsx";
import AboutUsManagement from "../pages/Staff/AboutUsManagement.jsx";
import CustomerList from "../pages/Staff/CustomerList.jsx";
import OrderManagement from "../pages/Staff/OrderManagement.jsx";

const ManagerLayout = () => {
    return (
        <div className="min-h-screen">
            {/* Layout chung cho cả Staff và Admin - không có Header và Footer của Customer */}
            <Routes>
                <Route path="/instruction-management" element={<InstructionManagement />} />
                <Route path="/policies-management" element={<PoliciesManagement />} />
                <Route path="/store-management" element={<AboutUsManagement />} />
                <Route path="/products" element={<div>Products Management Page</div>} />
                <Route path="/categories" element={<div>Categories Management Page</div>} />
                <Route path="/customers" element={<CustomerList />} />
                <Route path="/orders" element={<OrderManagement />} />
                <Route path="/feedbacks" element={<div>Feedbacks Management Page</div>} />
                <Route path="/statistics" element={<div>Statistics Page</div>} />
                <Route path="/staff-list" element={<div>Staff Management Page</div>} />
                <Route path="/campaign-management" element={<div>Campaign Management Page</div>} />
                <Route path="/settings" element={<div>Settings Page</div>} />
                <Route path="/logout" element={<div>Logout Page</div>} />

                {/* Routes chỉ dành cho Admin */}
                <Route path="/dashboard" element={<div>Dashboard Page (Admin Only)</div>} />
                <Route path="/employee-management" element={<div>Employee Management Page (Admin Only)</div>} />
            </Routes>
        </div>
    );
};

export default ManagerLayout;
