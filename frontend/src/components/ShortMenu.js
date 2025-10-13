import React from 'react'
import { Link } from "react-router-dom";

export default function ShortMenu() {
    return (
        <div className='flex flex-col'>
            <div className='flex flex-col bg-[#232f3e] text-white font-semibold h-11'>
                <div className='mx-4 text-xs'>
                    Shop By
                </div>
                <div className='flex mx-4 space-x-6 text-sm'>
                    <span>Category</span>
                    <span>Your Lists</span>
                    <span>Deals</span>
                    <Link to="/addproduct">
                        <span >Sell</span>
                    </Link>
                </div>
            </div>
            <div className='text-white flex bg-[#37475a] items-center h-11'>
                <img src={require("../assets/location.png")} alt="" className='w-5 ml-4 mr-1'/>
                <span className='font-semibold text-sm' >Deliver to Rahul- Patna 800027&#11167;</span>
            </div>
        </div>
    )
}
