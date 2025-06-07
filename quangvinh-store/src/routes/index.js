import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home';
import ProductList from '../pages/ProductList';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import Login from '../pages/Login';
import Register from '../pages/Register';
import NotFound from '../pages/NotFound';
import ProductDetails from "../pages/ProductDetails.jsx";

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