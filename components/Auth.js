/* eslint-disable */
"use client";

import { useState } from "react";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    trainerName: "",
  });

  /* Social login handlers removed as Firebase is deprecated */


  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLogin) {
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      if (!formData.trainerName || !formData.email || !formData.password) {
        alert("Please fill all fields.");
        return;
      }

      setLoading(true);

      try {
        const res = await fetch("/api/users/buyers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            b_name: formData.trainerName,
            b_email: formData.email,
            b_password: formData.password,
          }),
        });

        const result = await res.json();

        if (res.ok && result.status === "success") {
          alert(`Signup successful! Your Buyer ID is ${result.bid}`);
          setIsLogin(true);
          setFormData({
            email: "",
            password: "",
            confirmPassword: "",
            trainerName: "",
          });
        } else {
          alert(result.message || "Signup failed.");
        }
      } catch (error) {
        console.error("Signup Error:", error);
        alert("An error occurred during signup.");
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(true);

      try {
        const response = await fetch("/api/users/buyers/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            b_email: formData.email,
            b_password: formData.password,
          }),
        });

        const result = await response.json();

        if (result.status === "success") {
          alert("Login successful!");
          // Save user info in localStorage or redirect to dashboard
          // localStorage.setItem("buyerId", result.bid);
          // router.push("/dashboard");
        } else {
          alert(result.message || "Invalid email or password.");
        }
      } catch (error) {
        console.error("Login error:", error);
        alert("Something went wrong during login.");
      }

      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-red-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Pokeball Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-16 h-16 border-4 border-white rounded-full"></div>
        <div className="absolute top-60 right-32 w-12 h-12 border-3 border-white rounded-full"></div>
        <div className="absolute bottom-40 left-1/4 w-20 h-20 border-4 border-white rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-14 h-14 border-3 border-white rounded-full"></div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Pokeball-shaped container */}
        <div className="relative">
          {/* Animated Border */}
          <div className="absolute -inset-1 bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 rounded-3xl blur opacity-75 animate-pulse"></div>

          {/* Main Form Container */}
          <div className="relative bg-yellow-400/90 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-yellow-300/50">
            {/* Pokemon Logo Area */}
            <div className="text-center mb-8">
              <div className="inline-block relative">
                <div className="w-16 h-16 mx-auto mb-4 relative">
                  {/* Pokeball */}
                  <div className="w-16 h-16 bg-gradient-to-b from-red-500 to-red-600 rounded-full relative overflow-hidden shadow-lg">
                    <div className="absolute bottom-0 w-full h-8 bg-gradient-to-b from-white to-gray-200"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full border-4 border-gray-800 shadow-inner"></div>
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-800"></div>
                  </div>
                  {/* Sparkle effects */}
                  <div className="absolute -top-2 -right-2 w-2 h-2 bg-yellow-300 rounded-full animate-ping"></div>
                  <div className="absolute -bottom-1 -left-2 w-1 h-1 bg-blue-300 rounded-full animate-ping animation-delay-1000"></div>
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  Welcome to <span className="text-red-600">PikaProjects</span>
                </h1>
                <p className="text-gray-700 text-sm">Begin your journey</p>
              </div>
            </div>

            {/* Toggle Buttons */}
            <div className="flex mb-6 bg-black/10 rounded-full p-1">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all duration-300 ${isLogin
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                  : "text-gray-700 hover:text-gray-900"
                  }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all duration-300 ${!isLogin
                  ? "bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg"
                  : "text-gray-700 hover:text-gray-900"
                  }`}
              >
                Sign Up
              </button>
            </div>

            {/* Form */}
            <div className="space-y-4">
              {!isLogin && (
                <div className="relative group">
                  <input
                    type="text"
                    name="trainerName"
                    placeholder="Trainer Name"
                    value={formData.trainerName}
                    onChange={handleInputChange}
                    className="w-full p-4 bg-yellow-300/50 border border-yellow-500/30 rounded-2xl text-gray-800 placeholder-black focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 group-hover:bg-yellow-300/70"
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-400/20 to-orange-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              )}

              <div className="relative group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-4 bg-yellow-300/50 border border-yellow-500/30 rounded-2xl text-gray-800 placeholder-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:bg-yellow-300/70"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>

              <div className="relative group">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full p-4 bg-yellow-300/50 border border-yellow-500/30 rounded-2xl text-gray-800 placeholder-black focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 group-hover:bg-yellow-300/70"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>

              {!isLogin && (
                <div className="relative group">
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full p-4 bg-yellow-300/50 border border-yellow-500/30 rounded-2xl text-gray-800 placeholder-black focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 group-hover:bg-yellow-300/70"
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-400/20 to-orange-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                className="w-full relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 rounded-2xl"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative bg-gradient-to-r from-red-500 to-yellow-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg">
                  <span className="relative z-10">
                    {isLogin ? "🚀 Start Journey" : "⚡ Become Trainer"}
                  </span>
                </div>
              </button>
            </div>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-gray-700 text-sm">
                {isLogin ? "New trainer? " : "Already a trainer? "}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-red-600 hover:text-red-500 font-medium transition-colors duration-200"
                >
                  {isLogin ? "Join now" : "Login here"}
                </button>
              </p>
            </div>

            {/* Social Login */}
            {/* Social Login Removed */}
            <div className="mt-4 text-center text-gray-600 text-sm">
              <p>Social Login is temporarily unavailable.</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
