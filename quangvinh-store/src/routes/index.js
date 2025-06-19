import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Admin/Home.jsx';
import ProductList from '../pages/Admin/ProductList.jsx';
import Cart from '../pages/Admin/Cart.jsx';
import Checkout from '../pages/Admin/Checkout.jsx';
import Login from '../pages/Admin/Login.jsx';
import Register from '../pages/Admin/Register.jsx';
import NotFound from '../pages/Admin/NotFound.jsx';
import ProductDetails from "../pages/Admin/ProductDetails.jsx";

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            { path: '/', element: <Home /> },
            { path: '/products', element: <ProductList /> },
            { path: '/products/:id', element: <ProductDetails /> },
            { path: '/cart', element: <Cart /> },
            { path: '/checkout', element: <Checkout /> },
            { path: '/login', element: <Login /> },
            { path: '/register', element: <Register /> },
            { path: '*', element: <NotFound /> },
        ],
    },
]);

export default router;