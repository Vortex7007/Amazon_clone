import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [userName, setUserName] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);

    // Get authentication state from Redux
    const { isAuthenticated: userAuthenticated } = useSelector((state) => state.user);
    const { isAuthenticated: sellerAuthenticated } = useSelector((state) => state.seller);
    const cart = useSelector((state) => state.cart);
    const cartQuantity = cart?.totalQuantity || 0;
    const backendUrl = process.env.REACT_APP_BACKEND_SERVER_LINK || "http://localhost:5000";

    // Determine if user is authenticated (either as customer or seller)
    const isAuthenticated = userAuthenticated || sellerAuthenticated;
    const isSeller = sellerAuthenticated && !userAuthenticated;
    
    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("authToken");
            if (!token) {
                setLoadingUser(false);
                return;
            }

            try {
                const response = await fetch(`${backendUrl}/api/auth/user`, {
                    headers: {
                        "auth-token": token,
                    },
                });

                if (response.ok) {
                    const userData = await response.json();
                    setUserName(userData.name);
                } else {
                    // Token might be invalid, clear it
                    localStorage.removeItem("authToken");
                }
            } catch (err) {
                console.error("Error fetching user:", err);
            } finally {
                setLoadingUser(false);
            }
        };

        fetchUser();
    }, [backendUrl]);
    
    const handleClick = () => {
        console.log('clicked ham');
        setIsOpen(!isOpen);
    }

    // Determine display name and account link based on authentication type
    let displayName = "Sign In";
    let accountLink = "/login";

    if (isSeller) {
      displayName = "Seller Dashboard";
      accountLink = "/seller/dashboard";
    } else if (userName) {
      displayName = userName;
      accountLink = "/profile";
    }
    
    return (
        <>

            {/* Responsive Navbar Layout */}
            <div className="bg-[#1a2233] font-roboto">
                {/* Mobile: stacked layout */}
                <div className="flex flex-col lg:hidden">
                    <div className="flex justify-between items-center h-10">
                        <div className='flex'>
                            <div className="hamburger inline-block p-1.5 md:hidden" onClick={handleClick}>
                                <div className="line bg-white h-[2px] w-5 my-1.5 ml-2"></div>
                                <div className="line bg-white h-[2px] w-5 my-1.5 ml-2"></div>
                                <div className="line bg-white h-[2px] w-5 my-1.5 ml-2"></div>
                            </div>
                            <Link to="/">
                            <div>
                                <div className='flex flex-col m-2 items-start justify-center'>
                                    <div className='flex items-end'>
                                        <img src={require('../assets/amazon_logo.png')} alt="" className='w-[80px] h-auto bg-inherit' />
                                        <span className='text-white text-sm ml-0 mb-1'>.in</span>
                                    </div>
                                    <span className='text-gray-400 font-bold text-xs ml-14 mt-[-10px]'>prime</span>
                                </div>
                            </div>
                            </Link>
                        </div>
                        <div className='flex mr-2 space-x-2'>
                            <Link to={accountLink}>
                        <div className="flex text-white items-center font-bold text-sm">
                            <span className="max-w-[100px] truncate">{loadingUser ? "Loading..." : displayName}</span>
                            <span>&gt</span>
                            <img src={require("../assets/account-32.png")} alt="" className='w-9' />
                        </div>
                            </Link>
                            {!isSeller && (
                                <Link to="/cart" className="relative">
                                    <img src={require("../assets/cart.png")} alt="Cart" className='w-9' />
                                    {cartQuantity > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-yellow-400 text-gray-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                            {cartQuantity > 9 ? '9+' : cartQuantity}
                                        </span>
                                    )}
                                </Link>
                            )}
                        </div>
                    </div>
                    {/* Searchbar below for mobile */}
                    <div className="flex justify-center px-2 mt-2">
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="Search Amazon.in"
                                className="w-full px-4 py-1.5 border border-gray-300 rounded-lg focus:outline-none"
                            />
                            <button className="absolute right-0 top-0 bottom-0 bg-[#febd69] text-white px-3 rounded-lg">
                                <img src={require("../assets/search.png")} alt="search" className="w-7 h-7" />
                            </button>
                        </div>
                    </div>
                </div>
                {/* Desktop: horizontal layout */}
                {/* Desktop: horizontal layout */}
<div className="hidden lg:flex justify-between items-center h-12 px-4">
  <div className='flex items-center'>
    <div className="hamburger inline-block p-1.5 xl:hidden" onClick={handleClick}>
      <div className="line bg-white h-[2px] w-5 my-1.5 ml-2"></div>
      <div className="line bg-white h-[2px] w-5 my-1.5 ml-2"></div>
      <div className="line bg-white h-[2px] w-5 my-1.5 ml-2"></div>
    </div>

    {/* 🔥 Entire logo is now clickable */}
    <Link to="/" className="flex flex-col m-2 items-start justify-center cursor-pointer select-none">
      <div className="flex items-end">
        <img
          src={require('../assets/amazon_logo.png')}
          alt=""
          className="w-[80px] h-auto bg-inherit"
        />
        <span className="text-white text-sm ml-0 mb-1">.in</span>
      </div>
      <span className="text-gray-400 font-bold text-xs ml-14 mt-[-10px]">prime</span>
    </Link>
  </div>
                    {/* Searchbar in center for desktop */}
                    <div className="flex-1 flex justify-center mx-8">
                        <div className="relative w-full max-w-xl">
                            <input
                                type="text"
                                placeholder="Search Amazon.in"
                                className="w-full px-4 py-1.5 border border-gray-300 rounded-lg focus:outline-none"
                            />
                            <button className="absolute right-0 top-0 bottom-0 bg-[#febd69] text-white px-3 rounded-lg">
                                <img src={require("../assets/search.png")} alt="search" className="w-7 h-7" />
                            </button>
                        </div>
                    </div>
                    <div className='flex mr-2 space-x-2'>
                        <Link to={accountLink}>
                        <div className="flex text-white items-center font-bold text-sm">
                            <span className="max-w-[100px] truncate">{loadingUser ? "Loading..." : displayName}</span>
                            <span>&gt</span>
                            <img src={require("../assets/account-32.png")} alt="" className='w-9' />
                        </div>
                        </Link>
                        {!isSeller && (
                            <Link to="/cart" className="relative">
                                <img src={require("../assets/cart.png")} alt="Cart" className='w-9' />
                                {cartQuantity > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-yellow-400 text-gray-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                        {cartQuantity > 9 ? '9+' : cartQuantity}
                                    </span>
                                )}
                            </Link>
                        )}
                    </div>
                </div>
            </div>


            {/* Overlay */}
            <div className={`fixed inset-0 bg-black bg-opacity-50 z-10 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`} onClick={handleClick}></div>

            {/* Sliding menu */}
            <div className="slidingmenu relative font-roboto">
                <div className={`fixed top-0 left-0 h-full w-4/5 bg-white z-20 transform transition-transform duration-300 overflow-scroll ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
                    <nav className="flex flex-col bg-gray-300">
                        {/* <a href="/" className="text-gray-800 hover:bg-gray-200 p-2 rounded">
                            Home
                        </a>
                        <a href="/" className="text-gray-800 hover:bg-gray-200 p-2 rounded">
                            About
                        </a>
                        <a href="/" className="text-gray-800 hover:bg-gray-200 p-2 rounded">
                            Services
                        </a>
                        <a href="/" className="text-gray-800 hover:bg-gray-200 p-2 rounded">
                            Contact
                        </a> */}
                        <div className="flex flex-col bg-[#232f3e] w-full h-32 ">
                            <div className="text-white text-sm items-center ml-auto flex h-14 mr-2">
                                <div>Your Account</div>
                                <img src={require("../assets/account-32.png")} alt="" className='w-9 mx-1' />
                            </div>
                            <div className="top-14 text-white flex flex-col ml-5 absolute">
                                <span className="text-xl font-bold">Browse</span>
                                <span className="relative text-3xl bottom-1">Amazon</span>
                            </div>
                        </div>
                        <div className="bg-white">
                            <div className="flex justify-between items-center h-14">
                                <span className="m-5 font-bold text-xl">Amazon Home</span>
                                <img src={require("../assets/home.png")} alt="" className="w-6 m-3" />
                            </div>
                        </div>
                        <div className="bg-white mt-1.5">
                            <div className="flex justify-between flex-col">
                                <span className="m-5 font-bold text-xl">Trending</span>
                                <span className="ml-5 my-3"> Best Sellers</span>
                                <span className="ml-5 my-3"> New Releases</span>
                                <span className="ml-5 my-3"> Movers and Shakers</span>
                            </div>
                        </div>
                        <div className="bg-white mt-1.5">
                            <div className="flex justify-between flex-col">
                                <span className="m-5 font-bold text-xl">Top Categories for You</span>
                                <span className="ml-5 my-3"> Home & Kitchen</span>
                                <span className="ml-5 my-3"> Health & Household  Supplies</span>
                                <span className="ml-5 my-3"> Apparel</span>
                                <span className="ml-5 my-3"> Sports & Outdoors</span>
                                <span className="ml-5 my-3"> See All Categories</span>
                            </div>
                        </div>
                        <div className="bg-white mt-1.5 pb-7">
                            <div className="flex justify-between flex-col">
                                <span className="m-5 font-bold text-xl">Programs & Features</span>
                                <span className="ml-5 my-3"> Today's Deals</span>
                                <span className="ml-5 my-3"> Amazon Bazaar</span>
                                <span className="ml-5 my-3"> Amazon Pay</span>
                                <span className="ml-5 my-3"> Handloom and Handicrafts</span>
                                <span className="ml-5 my-3"> Amazon Saheli</span>
                                <span className="ml-5 my-3"> Amazon Custom</span>
                                <span className="ml-5 my-3"> Prime</span>
                                <span className="ml-5 my-3"> Buy more, Save more</span>
                                <span className="ml-5 my-3"> Sell on Amazon</span>
                                <span className="ml-5 my-3"> International Brands</span>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
        </>
    )
}
