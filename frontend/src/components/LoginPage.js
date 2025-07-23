import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Navbar from "./Navbar";

function LoginPage() {
  const [mobile, setMobile] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const fullMobile = `+${mobile}`;

      // Step 1: Check if user exists
      const resCheck = await fetch("http://localhost:5000/api/auth/checkuser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: fullMobile }),
      });

      const resJson = await resCheck.json();

      if (resJson.action === "signup") {
        // Redirect to Signup
        navigate("/signup");
        return;
      }

      if (resJson.action === "login") {
        // Step 2: Send OTP
        const resOtp = await fetch("http://localhost:5000/api/auth/verifyotp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mobile: fullMobile,
            isNewUser: false, // just login
            name: "N/A", // backend can ignore name/password during login
            password: "N/A",
          }),
        });

        const otpData = await resOtp.json();

        if (resOtp.ok) {
          // Step 3: Redirect to OTP page
          navigate("/otp", {
            state: {
              mobile: fullMobile,
              isNewUser: false,
              otp: otpData.otp,
            },
          });
        } else {
          alert(otpData.error || "Failed to send OTP");
        }
      }
    } catch (error) {
      console.error("Login failed", error);
      alert("Something went wrong. Try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
          <h2 className="mb-6 text-2xl font-bold text-gray-800">
            Sign in or create account
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="mobile"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Mobile Number
              </label>
              <PhoneInput
                country={"in"}
                value={mobile}
                onChange={setMobile}
                inputProps={{
                  required: true,
                  name: "mobile",
                }}
                inputStyle={{
                  width: "100%",
                  height: "40px",
                  fontSize: "14px",
                }}
                containerStyle={{ width: "100%" }}
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              Login with OTP
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
