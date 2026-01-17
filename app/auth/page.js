"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

// Assuming this is inside a functional component, e.g., function AuthPage() { ... }
// Adding missing context and state declarations based on the provided snippet and common patterns
// The original content was missing the component function wrapper and some state declarations.
// This assumes the component is named `AuthPage` for demonstration.

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { login, signup } = useAuth();

    // Form States
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (isLogin) {
                await login(email, password);
                router.push("/dashboard");
            } else {
                await signup({
                    email,
                    password,
                    displayName,
                    contactNumber
                });
                router.push("/dashboard");
            }
        } catch (err) {
            console.error("Auth error:", err);
            setError(err.message || "Authentication failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-[#FFCB05] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#ff0000] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>

            <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border-4 border-[#FFCB05]">

                {/* Header Tabs */}
                <div className="flex text-lg font-bold font-[pikachuBold]">
                    <button
                        onClick={() => setIsLogin(true)}
                        className={`flex-1 py-4 text-center transition-colors ${isLogin
                            ? "bg-[#FFCB05] text-black"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-500 hover:bg-gray-300"
                            }`}
                    >
                        I Choose You! (Login)
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        className={`flex-1 py-4 text-center transition-colors ${!isLogin
                            ? "bg-[#FFCB05] text-black"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-500 hover:bg-gray-300"
                            }`}
                    >
                        New Trainer? (Sign Up)
                    </button>
                </div>

                {/* Form Container */}
                <div className="p-8">
                    <div className="text-center mb-6">
                        <h2 className="text-3xl font-[pikachuBold] text-gray-800 dark:text-white mb-2">
                            {isLogin ? "Welcome Back!" : "Join the Adventure"}
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400">
                            {isLogin ? "Ready to catch 'em all?" : "Start your journey today!"}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Trainer Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#FFCB05] focus:border-transparent dark:bg-gray-700 dark:text-white transition-all outline-none"
                                        placeholder="Ash Ketchum"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        PokéNav (Contact Number)
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        value={contactNumber}
                                        onChange={(e) => setContactNumber(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#FFCB05] focus:border-transparent dark:bg-gray-700 dark:text-white transition-all outline-none"
                                        placeholder="+1 234 567 8900"
                                    />
                                </div>
                            </>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#FFCB05] focus:border-transparent dark:bg-gray-700 dark:text-white transition-all outline-none"
                                placeholder="trainer@pokemon.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#FFCB05] focus:border-transparent dark:bg-gray-700 dark:text-white transition-all outline-none"
                                placeholder="••••••••"
                            />
                        </div>

                        {error && (
                            <div className="p-3 bg-red-100 text-red-600 rounded-lg text-sm text-center">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#FFCB05] hover:bg-[#E6B800] text-black font-[pikachuBold] py-3 rounded-lg shadow-md transform transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                            ) : (
                                isLogin ? "Log In" : "Register"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
