import './App.css';
import 'react-phone-input-2/lib/style.css';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { userLoginSuccess } from './redux/user/userSlice';
import { sellerLoginSuccess } from './redux/seller/sellerSlice';
import Navbar from './components/Navbar';
import ShortMenu from './components/ShortMenu';
import HorizontalProductmenu from './components/HorizontalProductmenu'
import Carousel from './components/Carousel';
import BigHorizontalProductmenu from './components/BigHorizontalProductmenu';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import OtpPage from './components/OtpPage';
import AddproductPage from './components/seller/AddproductPage';
import SellerLogin from './components/seller/SellerLogin';
import SellerOtppage from './components/seller/SellerOtppage';
import SellerSignupPage from './components/seller/SellerSignupPage';
import SellerDashboard from './components/seller/SellerDashboard';
import ProductDetail from './components/ProductDetail';
import CartPage from './components/CartPage';
import AddressPage from './components/AddressPage';
import UserProfile from './components/UserProfile';
import CheckoutPage from './components/CheckoutPage';
import OrderConfirmation from './components/OrderConfirmation';
import OrderHistory from './components/OrderHistory';
console.log("Current Backend URL:", process.env.REACT_APP_BACKEND_SERVER_LINK);
function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check for existing user auth token and restore user state
    const userToken = localStorage.getItem('authToken');
    if (userToken) {
      const backendUrl = process.env.REACT_APP_BACKEND_SERVER_LINK || "http://localhost:5000";
      fetch(`${backendUrl}/api/auth/user`, {
        headers: {
          "auth-token": userToken,
        },
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('User token invalid');
        }
      })
      .then(userData => {
        dispatch(userLoginSuccess({
          token: userToken,
          user: userData
        }));
      })
      .catch(error => {
        console.error('Failed to restore user session:', error);
        localStorage.removeItem('authToken');
      });
    }

    // Check for existing seller auth token and restore seller state
    const sellerToken = localStorage.getItem('sellerToken');
    if (sellerToken) {
      const backendUrl = process.env.REACT_APP_BACKEND_SERVER_LINK || "http://localhost:5000";
      // For sellers, we can validate the token by trying to fetch seller products
      fetch(`${backendUrl}/api/seller/products`, {
        headers: {
          "auth-token": sellerToken,
        },
      })
      .then(response => {
        if (response.ok) {
          // Token is valid, restore seller session
          dispatch(sellerLoginSuccess({
            token: sellerToken,
            seller: {} // We don't have seller data endpoint, so we'll fetch it later
          }));
        } else {
          throw new Error('Seller token invalid');
        }
      })
      .catch(error => {
        console.error('Failed to restore seller session:', error);
        localStorage.removeItem('sellerToken');
      });
    }
  }, [dispatch]);

  return (
    <><Router>
      <Routes>
        <Route
          path='/'
          element={
            <>
              <Navbar />
              <ShortMenu />
              <HorizontalProductmenu />
              <Carousel />
              <BigHorizontalProductmenu />
            </>
          } />
        <Route exact path='/login' element={<LoginPage />} />
        <Route exact path='/seller' element={<SellerLogin />} />
        <Route exact path='/signup' element={<SignupPage />} />
        <Route exact path='/sellersignup' element={<SellerSignupPage/>} />
        <Route exact path='/otp' element={<OtpPage />} />
        <Route exact path='/sellerotp' element={<SellerOtppage />} />
        <Route exact path='/seller/dashboard' element={<SellerDashboard />} />
        <Route exact path='/addproduct' element={<AddproductPage />} />
        <Route exact path='/product/:id' element={<ProductDetail />} />
        <Route exact path='/cart' element={<CartPage />} />
        <Route exact path='/checkout' element={<CheckoutPage />} />
        <Route exact path='/order-confirmation/:orderId' element={<OrderConfirmation />} />
        <Route exact path='/orders' element={<OrderHistory />} />
        <Route exact path='/addresses' element={<AddressPage />} />
        <Route exact path='/profile' element={<UserProfile />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
