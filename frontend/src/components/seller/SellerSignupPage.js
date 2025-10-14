import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

function SignupPage() {
  const backendUrl = process.env.REACT_APP_BACKEND_SERVER_LINK;
  const [phone, setPhone] = useState("");
  const [owner, setOwnerName] = useState("");
  const [password, setPassword] = useState("");
  const [companyname, setcompanyname] = useState("");
  const [operatingcity, setOperatingcity ] = useState("");
  const navigate = useNavigate();


const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch(`${backendUrl}/api/verify/verifyotpseller`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mobile: `+${phone}`, // Ensure E.164 format
        owner,
        password,
        isNewUser: true, // if needed by backend
      }),
    });

    const data = await response.json();

    if (response.ok) {
      // Navigate to OTP page with received OTP and user details
      navigate("/sellerotp", {
        state: {
          mobile: `+${phone}`,
          companyname,
          owner,
          operatingcity,
          password,
          isNewUser: true,
          otp: data.otp, // send received OTP to next page
        },
      });
    } else {
      alert(data.error || "Failed to send OTP");
    }
  } catch (err) {
    console.error(err);
    alert("An error occurred. Try again.");
  }
};


  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-sm bg-white p-6 rounded shadow-sm">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Create your account
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Company's owner name
              </label>
              <input
                type="text"
                id="owner"
                value={owner}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter owner's full name"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Your company name
              </label>
              <input
                type="text"
                id="companyname"
                value={companyname}
                onChange={(e) => setcompanyname(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter your company's full name"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                City of operation
              </label>
              <input
                type="text"
                id="operatingcity"
                value={operatingcity}
                onChange={(e) => setOperatingcity(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter your company's city of operation"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="mobile"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Mobile number
              </label>
              <PhoneInput
                country={"in"}
                value={phone}
                onChange={setPhone}
                inputProps={{
                  required: true,
                  name: "mobile"
                }}
                inputStyle={{
                  width: "100%",
                  height: "40px",
                  fontSize: "14px"
                }}
                containerStyle={{ width: "100%" }}
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength="6"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="At least 6 characters"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 text-sm font-medium text-white bg-yellow-500 rounded hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              Continue
            </button>
          </form>

          <p className="text-xs text-gray-600 mt-4">
            By continuing, you agree to Amazon's{" "}
            <span className="text-blue-600 hover:underline cursor-pointer">
              Conditions of Use
            </span>{" "}
            and{" "}
            <span className="text-blue-600 hover:underline cursor-pointer">
              Privacy Notice
            </span>
            .
          </p>
        </div>
      </div>
    </>
  );
}

export default SignupPage;
