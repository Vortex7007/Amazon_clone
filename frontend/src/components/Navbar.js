import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const handleClick = () => {
        console.log('clicked ham');
        setIsOpen(!isOpen);
    }
    return (
        <>
            {/* top layer container */}
            <div className="flex justify-between items-center bg-[#232f3e] h-12 font-roboto">
                <div className='flex '>
                    <div className="hamburger inline-block p-1.5 md:hidden" onClick={handleClick}>
                        <div className="line bg-white h-[2px] w-5 my-1.5 ml-2"></div>
                        <div className="line bg-white h-[2px] w-5 my-1.5 ml-2"></div>
                        <div className="line bg-white h-[2px] w-5 my-1.5 ml-2"></div>
                    </div>
                    <div>
                        <div className='flex absolute m-2'>
                            <img src={require('../assets/amazon_logo.png')} alt="" className='w-[80px] height-auto bg-inherit' />
                            <span className='text-white relative bottom-0 text-sm'>.in</span>
                            <span className='text-gray-400 font-bold text-sm relative top-3 right-10'>prime</span>
                        </div>
                    </div>
                </div>
                <div className='flex mr-2 space-x-2'>
                    <Link to="/login">
                    <div className="flex text-white items-center font-bold text-sm">
                        <span>Name</span>
                        <span>&gt;</span>
                        <img src={require("../assets/account-32.png")} alt="" className='w-9' />
                    </div>
                    </Link>
                    <div>
                        <img src={require("../assets/cart.png")} alt="" className='w-9' />
                    </div>
                </div>
            </div>

            {/* Searchbar */}
            <div className="bg-[#232f3e]">
                <div className="flex justify-center px-2">
                    <div className="relative w-full">
                        {/* Input Field */}
                        <input
                            type="text"
                            placeholder="Search Amazon.in"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none"
                        />

                        {/* Button */}
                        <button className="absolute right-0 top-0 bottom-0 bg-[#febd69] text-white px-3 rounded-lg">
                            <img src={require("../assets/search.png")} alt="search" className="w-7 h-7" />
                        </button>
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
