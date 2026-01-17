"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export default function Navbar() {
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="bg-[#FFCB05] dark:bg-gray-900 border-b-4 border-[#3c5aa6] dark:border-[#FFCB05] shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">

                    {/* Logo / Brand */}
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0 flex items-center gap-2">
                            <div className="w-8 h-8 bg-red-600 rounded-full border-2 border-white shadow-inner flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full border border-gray-400"></div>
                            </div>
                            <span className="font-[pikachuBold] text-2xl tracking-wider text-[#3c5aa6] dark:text-[#FFCB05] drop-shadow-sm">
                                PokéDev
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link href="/marketplace" className="text-gray-800 dark:text-gray-200 hover:text-white dark:hover:text-white font-[pikachuNormal] font-bold text-lg transition-colors">
                            Marketplace
                        </Link>
                        <Link href="/sponsor" className="text-gray-800 dark:text-gray-200 hover:text-white dark:hover:text-white font-[pikachuNormal] font-bold text-lg transition-colors">
                            Sponsorships
                        </Link>

                        {user ? (
                            <>
                                <Link href="/dashboard" className="text-gray-800 dark:text-gray-200 hover:text-white dark:hover:text-white font-[pikachuNormal] font-bold text-lg transition-colors">
                                    Dashboard
                                </Link>
                                <div className="flex items-center gap-4 ml-4">
                                    <span className="text-sm font-bold text-[#3c5aa6] dark:text-[#FFCB05] bg-white dark:bg-gray-800 px-3 py-1 rounded-full border-2 border-[#3c5aa6] dark:border-[#FFCB05]">
                                        {user.email?.split('@')[0]}
                                    </span>
                                    <button
                                        onClick={logout}
                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full font-bold shadow-md transition-transform transform hover:scale-105"
                                    >
                                        Log Out
                                    </button>
                                </div>
                            </>
                        ) : (
                            <Link href="/auth" className="bg-[#3c5aa6] hover:bg-[#2a4a8b] text-white px-6 py-2 rounded-full font-bold shadow-md transition-transform transform hover:scale-105 border-2 border-white">
                                Log In
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-800 dark:text-white hover:text-gray-600 focus:outline-none"
                        >
                            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-[#FFCB05] dark:bg-gray-900 border-t border-[#3c5aa6]">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link href="/marketplace" className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 dark:text-white hover:bg-[#3c5aa6] hover:text-white transition-colors">
                            Marketplace
                        </Link>
                        <Link href="/sponsor" className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 dark:text-white hover:bg-[#3c5aa6] hover:text-white transition-colors">
                            Sponsorships
                        </Link>
                        {user ? (
                            <>
                                <Link href="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 dark:text-white hover:bg-[#3c5aa6] hover:text-white transition-colors">
                                    Dashboard
                                </Link>
                                <button
                                    onClick={logout}
                                    className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-100 transition-colors"
                                >
                                    Log Out
                                </button>
                            </>
                        ) : (
                            <Link href="/auth" className="block px-3 py-2 rounded-md text-base font-medium text-[#3c5aa6] dark:text-[#FFCB05] font-bold">
                                Log In
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
