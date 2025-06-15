import React, { useState } from "react";
import { useNavigate  } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  let navigate = useNavigate();

  const handleSubmit =async (e) => {
    e.preventDefault();
    // Handle login logic here
      const response = await fetch("http://localhost:5000/api/auth/checkuser", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email: email})
    });
    const json = await response.json();
    console.log("Email: check", email);
    console.log(json.action);
    if(json.action === "signup"){
      console.log("redirect to signup")
      navigate("/signup");
    }
    if(json.action === "login"){
      //direct to password page;
    }
  };

  return (
    <>
      <div className="flex justify-between items-center bg-[#232f3e] h-12 font-roboto">
        
          <div className='flex absolute m-2'>
            <img src={require('../assets/amazon_logo.png')} alt="" className='w-[80px] height-auto bg-inherit' />
            <span className='text-white relative bottom-0 text-sm'>.in</span>
            {/* <span className='text-gray-400 font-bold text-sm relative top-3 right-10'>prime</span> */}
          </div>
        
      </div>
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
        <h2 className="mb-6 text-2xl font-bold text-gray-800">Sign in or create account </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          >
            Login
          </button>
        </form>
      </div>
    </>
  );
}

export default LoginPage;