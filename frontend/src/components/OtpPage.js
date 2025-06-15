import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function OtpPage() {
  const [otp, setOtp] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const { mobile, name, password, isNewUser } = location.state || {};

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!mobile || !otp) {
      alert("Missing data. Please restart signup.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          mobile,
          name,
          password,
          otp
        })
      });

      const json = await response.json();

      if (response.ok) {
        alert("Signup successful! Redirecting...");
        navigate("/"); // or navigate to /login
      } else {
        alert(json.error || "OTP verification failed");
      }
    } catch (error) {
      console.error("Signup failed", error);
      alert("An error occurred. Try again later.");
    }
  };

  return (
    <>
      <div className="flex justify-center items-center bg-[#232f3e] h-14">
        <div className="flex items-center">
          <img
            src={require("../assets/amazon_logo.png")}
            alt="Amazon Logo"
            className="w-24 h-auto"
          />
          <span className="text-white text-sm -ml-2">.in</span>
        </div>
      </div>

      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-sm bg-white p-6 rounded shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Verify OTP
          </h2>

          <form onSubmit={handleVerifyOtp}>
            <label
              htmlFor="otp"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Enter the OTP sent to <span className="font-semibold">{mobile}</span>
            </label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="6-digit OTP"
              required
            />

            <button
              type="submit"
              className="w-full px-4 py-2 text-sm font-medium text-white bg-yellow-500 rounded hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              Confirm OTP
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default OtpPage;
