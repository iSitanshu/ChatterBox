import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  changeStatus,
  showStatus,
  statusSlice,
} from "../features/status/statusSlice";
import axios from "axios";
import { addUser } from "../features/user/userSlice";
import { useNavigate } from "react-router-dom";
import { GoogleLogin, googleLogout, useGoogleLogin } from "@react-oauth/google";

const LoginPopup = () => {
  const [currState, setCurrState] = useState("Login");
  const [userregister, setUserRegister] = useState({
    username: "",
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const errorMessage = (error) => console.log(error);

  const handleChange = (e) => {
    setUserRegister({ ...userregister, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
    try {
      const endpoint =
        currState === "Sign Up"
          ? "/api/v1/user/register"
          : "/api/v1/user/login";
      const response = await axios.post(endpoint, userregister);
      dispatch(addUser(response.data.data.user));
      if (response.data && response.data.data && response.data.data.user) {
        dispatch(changeStatus());
      } else {
        alert("Something went wrong");
      }
    } catch (error) {
      if (error.response) {
        console.error("Server responded with an error:", error.response.data);
      } else if (error.request) {
        console.error("Network error:", error.request);
      } else {
        console.error("Error:", error.message);
      }
    }
  };

  const handleSubmitviaGoogle = async (e) => {
    try {
      const response = await axios.post('/api/v1/user/authGoogle', e)
      dispatch(addUser(response.data.data.user));
      if (response.data && response.data.data && response.data.data.user) {
        dispatch(changeStatus());
      } else {
        alert("Something went wrong");
      }
    } catch (error) {
      if (error.response) {
        console.error("Server responded with an error:", error.response.data);
      } else if (error.request) {
        console.error("Network error:", error.request);
      } else {
        console.error("Error:", error.message);
      }
    }
  }

  // Google Login
  const [profile, setProfile] = useState(null);

  const handleCredentialResponse = (response) => {
    const jwtToken = response.credential; // this is the JWT

    axios
      .post("/api/v1/user/google", {
        token: jwtToken,
      })
      .then((res) => {
        console.log("User logged in:", res.data);
        handleSubmitviaGoogle({
          username: res.data.user.name,
          email: res.data.user.email,
          password: res.data.user.googleId
        })
      })
      .catch((err) => {
        console.error("Login failed", err);
      });
  };

  // log out function to log the user out of google and set the profile array to null
  const logOut = () => {
    googleLogout();
    setProfile(null);
  };

  return (
    <div className="fixed inset-0 flex flex-col gap-6 items-center justify-center bg-gray-900 bg-opacity-60 z-50">
      <form
        className="bg-white w-[90%] sm:w-[400px] p-6 rounded-2xl shadow-xl relative"
        onSubmit={handleSubmit}
      >
        {/* Title and Close */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">{currState}</h2>
          <img
            src="https://png.pngtree.com/png-vector/20190411/ourmid/pngtree-vector-cross-icon-png-image_925896.jpg"
            alt="Close"
            onClick={() => dispatch(changeStatus())}
            className="w-5 h-5 cursor-pointer hover:scale-110 transition-transform duration-200"
          />
        </div>

        {/* Inputs */}
        <div className="flex flex-col gap-4 mb-4">
          {currState === "Sign Up" && (
            <input
              type="text"
              name="username"
              placeholder="Your name"
              onChange={handleChange}
              required
              className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            onChange={handleChange}
            required
            className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Enter the Password"
            onChange={handleChange}
            required
            className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-md font-semibold hover:bg-green-800 transition duration-300"
        >
          {currState === "Sign Up" ? "Create Account" : "Login"}
        </button>

        {/* Terms and Conditions */}
        {/* <div className="flex items-start mt-4 gap-2 text-sm text-gray-600">
          <input type="checkbox" required className="mt-1" />
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div> */}

        {/* Switch Auth Mode */}
        <p className="mt-4 text-sm text-center text-gray-700">
          {currState === "Login" ? (
            <>
              Create a new account?{" "}
              <span
                onClick={() => setCurrState("Sign Up")}
                className="text-green-800 font-semibold cursor-pointer hover:underline"
              >
                Click here
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span
                onClick={() => setCurrState("Login")}
                className="text-green-700 font-semibold cursor-pointer hover:underline"
              >
                Login here
              </span>
            </>
          )}
        </p>
      </form>
      <GoogleLogin
        onSuccess={(responseMessage) => handleCredentialResponse(responseMessage)}
        onError={errorMessage}
      />
      {profile && (
        <div>
          <img src={profile.picture} alt="user image" />
          <h3>User Logged in</h3>
          <p>Name: {profile.name}</p>
          <p>Email Address: {profile.email}</p>
          <br />
          <br />
          <button onClick={logOut}>Log out</button>
        </div>
      )}
    </div>
  );
};

export default LoginPopup;
