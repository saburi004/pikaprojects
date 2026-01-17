"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";

export default function Sponsorships() {
    const { user } = useAuth();
    const router = useRouter();
    const [sponsorships, setSponsorships] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSponsorships = async () => {
            try {
                const res = await fetch('/api/sponsorships');
                const data = await res.json();
                setSponsorships(data);
            } catch (error) {
                console.error("Error fetching sponsorships:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSponsorships();
    }, []);

    if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="w-12 h-12 border-4 border-[#FFCB05] border-t-transparent rounded-full animate-spin"></div></div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-[pikachuBold] text-gray-800 dark:text-white">
                        Sponsor Gym (Career Center)
                    </h1>
                    <button
                        onClick={() => user ? router.push('/sponsor/new') : router.push('/auth')}
                        className="bg-[#3c5aa6] text-white px-6 py-3 rounded-xl font-[pikachuNormal] hover:bg-[#2a4a8b] shadow-lg transform transition hover:scale-105"
                    >
                        + Post New Sponsorship
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {sponsorships.map((s) => (
                        <Link href={`/sponsor/${s._id}`} key={s._id}>
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border-l-8 border-[#FFCB05] hover:shadow-xl transition-all">
                                <h3 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">{s.title}</h3>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {s.skills?.map(skill => (
                                        <span key={skill} className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm text-gray-600 dark:text-gray-300">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">{s.description}</p>
                                <div className="flex justify-between items-center text-sm font-bold">
                                    <span className="text-[#3c5aa6] dark:text-[#FFCB05]">Budget: {s.budget}</span>
                                    <span className="text-gray-500">Timeline: {s.timeline}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {sponsorships.length === 0 && (
                    <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl shadow-inner">
                        <h3 className="text-xl font-bold mb-2">No Challenges posted yet!</h3>
                        <p className="text-gray-500">Be the first to sponsor a project.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
