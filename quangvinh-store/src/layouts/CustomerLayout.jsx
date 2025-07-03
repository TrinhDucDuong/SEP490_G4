import { Outlet } from 'react-router-dom';
import Header from '../components/layout/customer/Header.jsx';
import Footer from '../components/layout/customer/Footer.jsx';

const CustomerLayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default CustomerLayout;
