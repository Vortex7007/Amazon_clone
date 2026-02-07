import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  fetchSellerProducts,
  updateSellerProduct,
  deleteSellerProduct,
  fetchSellerAnalytics,
  fetchSellerOrders,
  updateOrderStatus,
  sellerLogout
} from '../../redux/seller/sellerSlice';

const SellerDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { products, analytics, orders, loading, error, isAuthenticated } = useSelector(state => state.seller);

  const [activeTab, setActiveTab] = useState('products');
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    price: '',
    productDescription: '',
    about: '',
    category: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/seller');
      return;
    }

    // Fetch initial data
    dispatch(fetchSellerProducts());
    dispatch(fetchSellerAnalytics());
    dispatch(fetchSellerOrders());
  }, [isAuthenticated, navigate, dispatch]);

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setEditForm({
      name: product.name,
      price: product.price,
      productDescription: product.productDescription,
      about: product.about || '',
      category: product.category || ''
    });
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateSellerProduct({
        productId: editingProduct._id,
        productData: editForm
      })).unwrap();
      setEditingProduct(null);
      alert('Product updated successfully!');
    } catch (err) {
      alert('Failed to update product: ' + err);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await dispatch(deleteSellerProduct(productId)).unwrap();
      alert('Product deleted successfully!');
    } catch (err) {
      alert('Failed to delete product: ' + err);
    }
  };

  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    try {
      await dispatch(updateOrderStatus({ orderId, status: newStatus })).unwrap();
      alert('Order status updated successfully!');
    } catch (err) {
      alert('Failed to update order status: ' + err);
    }
  };

  const handleLogout = () => {
    dispatch(sellerLogout());
    navigate('/');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading && !products.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Seller Dashboard</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/addproduct')}
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-lg"
              >
                Add Product
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'products', label: 'My Products', count: products.length },
              { id: 'analytics', label: 'Analytics' },
              { id: 'orders', label: 'Orders', count: orders.filter(o => o.status === 'pending' || o.status === 'confirmed').length }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-yellow-500 text-yellow-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                    tab.id === 'orders' && tab.count > 0 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">My Products</h2>
              <button
                onClick={() => navigate('/addproduct')}
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-lg"
              >
                Add New Product
              </button>
            </div>

            {products.length === 0 ? (
              <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
                <p className="text-gray-600 mb-6">Start selling by adding your first product.</p>
                <button
                  onClick={() => navigate('/addproduct')}
                  className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-lg"
                >
                  Add Product
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                  <div key={product._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <img
                      src={product.image || '/placeholder-image.jpg'}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 mb-2">{product.name}</h3>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.productDescription}</p>
                      <p className="text-lg font-bold text-gray-900 mb-3">₹{product.price}</p>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && analytics && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Sales Analytics</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center">
                  <div className="text-2xl mr-3">💰</div>
                  <div>
                    <p className="text-sm text-gray-600">Total Sales</p>
                    <p className="text-2xl font-bold text-gray-900">₹{(analytics.totalSales || 0).toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center">
                  <div className="text-2xl mr-3">📦</div>
                  <div>
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.totalOrders || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center">
                  <div className="text-2xl mr-3">🛒</div>
                  <div>
                    <p className="text-sm text-gray-600">Products Sold</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.totalProductsSold || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center">
                  <div className="text-2xl mr-3">📊</div>
                  <div>
                    <p className="text-sm text-gray-600">Total Products</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.totalProducts || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Selling Products */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Top Selling Products</h3>
              {!analytics.productSales || analytics.productSales.length === 0 ? (
                <p className="text-gray-600">No sales data yet</p>
              ) : (
                <div className="space-y-3">
                  {analytics.productSales.slice(0, 5).map((product, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-600">Sold: {product.sold} units</p>
                      </div>
                      <p className="font-bold text-gray-900">₹{(product.revenue || 0).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Orders to Fulfill</h2>

            {orders.length === 0 ? (
              <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                <div className="text-4xl mb-4">📋</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                <p className="text-gray-600">Orders will appear here once customers place orders for your products.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map(order => (
                  <div key={order._id} className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-gray-900">Order #{order._id.slice(-8)}</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(order.orderDate).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Items:</h4>
                      {order.items && order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-1">
                          <span className="text-sm">{item.name} (x{item.quantity})</span>
                          <span className="text-sm font-medium">₹{((item.price || 0) * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between font-bold">
                          <span>Total:</span>
                          <span>₹{(order.sellerTotal || 0).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {(order.status === 'pending' || order.status === 'confirmed') && (
                      <div className="flex space-x-2">
                        {order.status === 'pending' && (
                          <button
                            onClick={() => handleOrderStatusUpdate(order._id, 'confirmed')}
                            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded text-sm font-medium"
                          >
                            Confirm Order
                          </button>
                        )}
                        {order.status === 'confirmed' && (
                          <button
                            onClick={() => handleOrderStatusUpdate(order._id, 'shipped')}
                            className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded text-sm font-medium"
                          >
                            Mark as Shipped
                          </button>
                        )}
                        <button
                          onClick={() => handleOrderStatusUpdate(order._id, 'cancelled')}
                          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded text-sm font-medium"
                        >
                          Cancel Order
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* replace_in_file Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Edit Product</h3>

            <form onSubmit={handleUpdateProduct}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editForm.price}
                    onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={editForm.productDescription}
                    onChange={(e) => setEditForm({...editForm, productDescription: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">About</label>
                  <textarea
                    value={editForm.about}
                    onChange={(e) => setEditForm({...editForm, about: e.target.value})}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={editForm.category}
                    onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded"
                >
                  Update Product
                </button>
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
