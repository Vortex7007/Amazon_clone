import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userLogout } from "../redux/user/userSlice";
import Navbar from "./Navbar";

const UserProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const backendUrl = process.env.REACT_APP_BACKEND_SERVER_LINK || "http://localhost:5000";

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchUserProfile();
  }, [navigate]);

  const fetchUserProfile = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${backendUrl}/api/auth/user`, {
        headers: {
          "auth-token": token,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else if (response.status === 401) {
        localStorage.removeItem("authToken");
        dispatch(userLogout());
        navigate("/login");
      } else {
        throw new Error("Failed to fetch user profile");
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    dispatch(userLogout());
    navigate("/");
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-600">Error: {error}</div>
            <button
              onClick={() => navigate("/")}
              className="mt-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-lg"
            >
              Go Home
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Profile Header */}
            <div className="bg-yellow-400 px-6 py-4">
              <h1 className="text-2xl font-bold text-gray-900">My Account</h1>
              <p className="text-gray-700">Manage your account settings and preferences</p>
            </div>

            {/* Profile Content */}
            <div className="p-6">
              {/* User Information */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Profile Information</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <p className="text-gray-900 font-medium">{user?.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mobile Number
                      </label>
                      <p className="text-gray-900 font-medium">{user?.mobile}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Actions */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Account Management</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link
                    to="/addresses"
                    className="bg-white border border-gray-300 rounded-lg p-4 hover:border-yellow-500 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">📍</div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Address Book</h3>
                        <p className="text-sm text-gray-600">Manage your delivery addresses</p>
                      </div>
                    </div>
                  </Link>

                  <Link
                    to="/orders"
                    className="bg-white border border-gray-300 rounded-lg p-4 hover:border-yellow-500 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">📦</div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Order History</h3>
                        <p className="text-sm text-gray-600">View your past orders</p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Account Settings */}
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Account Settings</h2>
                <div className="space-y-3">
                  <button
                    onClick={handleLogout}
                    className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
