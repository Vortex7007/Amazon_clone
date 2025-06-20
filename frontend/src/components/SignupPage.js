import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

function SignupPage() {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Directly navigate to OTP page with user details
    navigate("/otp", {
      state: {
        mobile: `+${phone}`,
        name,
        password,
        isNewUser: true
      }
    });
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
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Create your account
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Your name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter your full name"
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
