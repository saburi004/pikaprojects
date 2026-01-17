"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";


export default function Dashboard() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("seller");
    const [loadingData, setLoadingData] = useState(false);

    // Data States
    const [myProjects, setMyProjects] = useState([]);
    const [myBuyRequests, setMyBuyRequests] = useState([]);
    const [mySponsorships, setMySponsorships] = useState([]);
    const [myApplications, setMyApplications] = useState([]);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/auth");
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            setLoadingData(true);
            try {
                if (activeTab === 'seller') {
                    // Use _id from MongoDB user object
                    const userId = user._id || user.uid;
                    if (!userId) {
                        console.warn("User ID missing, skipping projects fetch");
                        setMyProjects([]);
                        setLoadingData(false);
                        return;
                    }
                    const res = await fetch(`/api/projects?sellerId=${userId}`);

                    if (!res.ok) throw new Error("Failed to fetch projects");

                    const data = await res.json();
                    if (Array.isArray(data)) {
                        setMyProjects(data);
                    } else {
                        console.error("Projects data is not an array:", data);
                        setMyProjects([]);
                    }
                    // Buy requests logic pending migration
                }
                // Other tabs logic pending migration
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
                setMyProjects([]); // Safety fallback
            } finally {
                setLoadingData(false);
            }
        };

        fetchData();
    }, [user, activeTab]);

    if (authLoading || !user) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    const TabButton = ({ id, label }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`px-6 py-3 font-[pikachuBold] rounded-t-lg transition-colors ${activeTab === id
                ? "bg-[#FFCB05] text-black border-t-4 border-[#3c5aa6]"
                : "bg-gray-200 dark:bg-gray-700 text-gray-500 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
        >
            {label}
        </button>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-[pikachuBold] mb-8 text-gray-800 dark:text-white">
                    Welcome back, {user.displayName || "Trainer"}!
                </h1>

                {/* Tabs */}
                <div className="flex space-x-2 border-b-2 border-gray-300 dark:border-gray-700 mb-8 overflow-x-auto">
                    <TabButton id="seller" label="Seller Zone" />
                    <TabButton id="buyer" label="My Collection (Buyer)" />
                    <TabButton id="sponsor" label="Sponsor Gym" />
                    <TabButton id="developer" label="Challenger (Dev)" />
                </div>

                {/* Content Area */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 min-h-[400px]">
                    {loadingData ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="w-12 h-12 border-4 border-[#FFCB05] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <>
                            {activeTab === "seller" && (
                                <div className="space-y-8">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-2xl font-bold">My Projects for Sale</h2>
                                        <button
                                            onClick={() => router.push('/sell')} // We need to create this page
                                            className="bg-[#3c5aa6] text-white px-4 py-2 rounded-lg font-[pikachuNormal] hover:bg-[#2a4a8b]"
                                        >
                                            + List New Project
                                        </button>
                                    </div>

                                    {myProjects.length === 0 ? (
                                        <p className="text-gray-500">You haven't listed any projects yet.</p>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {myProjects.map((p) => (
                                                <div key={p._id} className="border rounded-lg p-4 shadow hover:shadow-md transition-shadow">
                                                    <h3 className="font-bold text-lg mb-2">{p.title}</h3>
                                                    <p className="text-sm text-gray-600 mb-2 truncate">{p.description}</p>
                                                    <div className="flex justify-between items-center">
                                                        <span className="font-bold text-[#3c5aa6]">${p.price}</span>
                                                        <span className={`px-2 py-1 rounded text-xs ${p.status === 'sold' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                                            {p.status.toUpperCase()}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="mt-8 border-t pt-6">
                                        <h2 className="text-2xl font-bold mb-4">Incoming Buy Requests</h2>
                                        {myBuyRequests.length === 0 ? (
                                            <p className="text-gray-500">No requests yet.</p>
                                        ) : (
                                            <div className="space-y-4">
                                                {myBuyRequests.map(req => (
                                                    <div key={req.id} className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                                        <div>
                                                            <p className="font-bold">Project ID: {req.projectId}</p>
                                                            <p className="text-sm">Buyer: {req.buyerId}</p>
                                                        </div>
                                                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                                                            {req.status}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === "buyer" && (
                                <div>
                                    <h2 className="text-2xl font-bold mb-4">My Purchases</h2>
                                    <p className="text-gray-500">Your purchased projects will appear here.</p>
                                    <div className="mt-8">
                                        <button onClick={() => router.push('/marketplace')} className="bg-[#FFCB05] text-black px-6 py-2 rounded-lg font-bold">
                                            Browse Marketplace
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeTab === "sponsor" && (
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-2xl font-bold">My Sponsored Posts</h2>
                                        <button
                                            onClick={() => router.push('/sponsor/new')}
                                            className="bg-[#3c5aa6] text-white px-4 py-2 rounded-lg font-[pikachuNormal] hover:bg-[#2a4a8b]"
                                        >
                                            + Create Sponsorship
                                        </button>
                                    </div>
                                    {mySponsorships.length === 0 ? (
                                        <p className="text-gray-500">You haven't sponsored any projects yet.</p>
                                    ) : (
                                        <ul className="space-y-4">
                                            {mySponsorships.map((s) => (
                                                <li key={s.id} className="border p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                                                    <h3 className="font-bold">{s.title}</h3>
                                                    <p className="text-gray-600 text-sm">Budget: {s.budget}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}

                            {activeTab === "developer" && (
                                <div>
                                    <h2 className="text-2xl font-bold mb-4">My Applications</h2>
                                    {myApplications.length === 0 ? (
                                        <p className="text-gray-500">You haven't applied to any projects yet.</p>
                                    ) : (
                                        <div className="space-y-4">
                                            {myApplications.map(app => (
                                                <div key={app.id} className="border p-4 rounded-lg flex justify-between items-center">
                                                    <div>
                                                        <p className="font-bold">Applied to Sponsorship ID: {app.sponsorshipId}</p>
                                                        <p className="text-sm text-gray-600">Date: {app.createdAt?.toDate ? new Date(app.createdAt.toDate()).toLocaleDateString() : 'Just now'}</p>
                                                    </div>
                                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                                                        {app.status}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <div className="mt-8">
                                        <button onClick={() => router.push('/sponsor')} className="bg-[#FFCB05] text-black px-6 py-2 rounded-lg font-bold">
                                            Find Work
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
