import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Customer/Home.jsx';
import ProductList from '../pages/Customer/ProductList.jsx';
import Cart from '../pages/Customer/Cart.jsx';
import Checkout from '../pages/Customer/Checkout.jsx';
import Login from '../pages/Customer/Login.jsx';
import Register from '../pages/Customer/Register.jsx';
import NotFound from '../pages/Customer/NotFound.jsx';
import ProductDetails from "../pages/Customer/ProductDetails.jsx";

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