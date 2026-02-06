import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { createOrder, clearCurrentOrder } from '../redux/order/orderSlice';
import { clearCart } from '../redux/cart/cartSlice';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items: cartItems, totalAmount: cartTotal } = useSelector(state => state.cart);
  const { user } = useSelector(state => state.user);
  const { loading, error } = useSelector(state => state.order);

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [addressError, setAddressError] = useState(null);

  const backendUrl = process.env.REACT_APP_BACKEND_SERVER_LINK || "http://localhost:5000";

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
      navigate('/cart');
      return;
    }

    fetchAddresses();
  }, [user, cartItems, navigate]);

  const fetchAddresses = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoadingAddresses(true);
      const response = await fetch(`${backendUrl}/api/address`, {
        headers: {
          "auth-token": token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAddresses(data);
        // Auto-select default address if available
        const defaultAddress = data.find(addr => addr.isDefault);
        if (defaultAddress) {
          setSelectedAddress(defaultAddress);
        }
      } else if (response.status === 401) {
        localStorage.removeItem("authToken");
        navigate("/login");
      } else {
        throw new Error("Failed to fetch addresses");
      }
    } catch (err) {
      console.error("Error fetching addresses:", err);
      setAddressError(err.message);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateShipping = () => {
    // Free shipping over ₹500, otherwise ₹80
    return calculateSubtotal() > 500 ? 0 : 80;
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.08; // 8% tax
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping() + calculateTax();
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert('Please select a shipping address');
      return;
    }

    const orderData = {
      userId: user._id,
      items: cartItems.map(item => ({
        productId: item.productId || item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      totalAmount: calculateTotal(),
      shippingAddress: selectedAddress
    };

    try {
      const result = await dispatch(createOrder(orderData)).unwrap();

      // Clear cart on backend
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          await fetch(`${backendUrl}/api/cart/clear`, {
            method: 'POST',
            headers: {
              "auth-token": token,
            },
          });
        } catch (cartError) {
          console.error('Failed to clear cart on backend:', cartError);
        }
      }

      dispatch(clearCart());
      dispatch(clearCurrentOrder());
      navigate(`/order-confirmation/${result.order._id}`);
    } catch (err) {
      console.error('Failed to place order:', err);
      alert('Failed to place order. Please try again.');
    }
  };

  if (loadingAddresses) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading checkout...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Cart Items and Shipping Address */}
            <div className="space-y-8">
              {/* Cart Items Summary */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.productId || item.id} className="flex items-center space-x-4">
                      <img
                        src={item.image || '/placeholder-image.jpg'}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        <p className="text-sm font-medium text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address Selection */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Shipping Address</h2>
                  <button
                    onClick={() => navigate('/addresses')}
                    className="text-yellow-600 hover:text-yellow-700 text-sm font-medium"
                  >
                    Manage Addresses
                  </button>
                </div>

                {addressError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {addressError}
                  </div>
                )}

                {addresses.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">📍</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses found</h3>
                    <p className="text-gray-600 mb-4">Please add a shipping address to continue.</p>
                    <button
                      onClick={() => navigate('/addresses')}
                      className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-lg transition-colors"
                    >
                      Add Address
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {addresses.map((address) => (
                      <div
                        key={address._id}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          selectedAddress && selectedAddress._id === address._id
                            ? 'border-yellow-500 bg-yellow-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedAddress(address)}
                      >
                        <div className="flex items-start">
                          <input
                            type="radio"
                            checked={selectedAddress && selectedAddress._id === address._id}
                            onChange={() => setSelectedAddress(address)}
                            className="mt-1 mr-3"
                          />
                          <div className="flex-1">
                            {address.isDefault && (
                              <span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded mb-2">
                                Default
                              </span>
                            )}
                            <h3 className="font-medium text-gray-900">{address.name}</h3>
                            <p className="text-gray-600 text-sm">{address.mobile}</p>
                            <p className="text-gray-700 text-sm">{address.address}</p>
                            <p className="text-gray-700 text-sm">
                              {address.city}, {address.state} - {address.pincode}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Order Total */}
            <div className="space-y-8">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Order Total</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">₹{calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-900">
                      {calculateShipping() === 0 ? 'FREE' : `₹${calculateShipping().toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="text-gray-900">₹{calculateTax().toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-gray-900">Total</span>
                      <span className="text-gray-900">₹{calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                  </div>
                )}

                <button
                  onClick={handlePlaceOrder}
                  disabled={loading || !selectedAddress}
                  className={`w-full py-3 px-4 rounded-lg font-bold text-lg transition-colors ${
                    loading || !selectedAddress
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-yellow-400 hover:bg-yellow-500 text-gray-900'
                  }`}
                >
                  {loading ? 'Placing Order...' : 'Place Order'}
                </button>

                {!selectedAddress && (
                  <p className="text-red-600 text-sm mt-2 text-center">
                    Please select a shipping address
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
