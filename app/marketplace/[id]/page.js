"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function ProjectDetail({ params }) {
    const { id } = use(params);
    const { user } = useAuth();
    const router = useRouter();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [requestStatus, setRequestStatus] = useState(null);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await fetch(`/api/projects/${id}`);
                if (!res.ok) throw new Error("Project not found");
                const data = await res.json();
                setProject(data);

                // Check status logic if needed, e.g. from a separate request endpoint
            } catch (error) {
                console.error("Error fetching project:", error);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchProject();
    }, [id]);

    const handleBuy = async () => {
        if (!user) return router.push("/auth");
        if (!confirm(`Are you sure you want to buy "${project.title}" for $${project.price}? (Dummy Payment)`)) return;

        setBuying(true);
        try {
            // Simulate Payment Process
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Update Project Status (API call)
            const res = await fetch(`/api/projects/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'sold', buyerId: user._id })
            });

            if (!res.ok) throw new Error("Purchase failed");

            setNotification({ type: 'success', message: 'Congratulations! You caught a new project! (Payment Successful)' });
            setTimeout(() => router.push("/dashboard"), 2000);
        } catch (error) {
            console.error("Purchase failed:", error);
            setNotification({ type: 'error', message: 'Purchase failed. Please try again.' });
        } finally {
            setBuying(false);
        }
    };

    const handleRequest = async () => {
        if (!user) return router.push("/auth");
        // setRequesting(true);
        alert("Request feature coming soon!");
    };

    if (loading) return <div className="p-8">Loading...</div>;
    if (!project) return <div className="p-8">Project not found.</div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden border-t-8 border-[#3c5aa6]">

                {/* Gallery / Media (Simplified) */}
                <div className="bg-gray-200 dark:bg-gray-700 h-96 relative">
                    {project.images && project.images.length > 0 ? (
                        <img src={project.images[0]} alt={project.title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">No Image Preview</div>
                    )}
                    {project.status === 'sold' && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="text-white text-4xl font-[pikachuBold] rotate-[-12deg] border-4 border-white px-8 py-2">SOLD</span>
                        </div>
                    )}
                </div>

                <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-3xl font-[pikachuBold] text-gray-800 dark:text-white mb-2">
                                {project.title}
                            </h1>
                            <div className="flex gap-2">
                                {project.techStack?.map(stack => (
                                    <span key={stack} className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-sm">
                                        {stack}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-[pikachuBold] text-[#3c5aa6] dark:text-[#FFCB05] mb-1">
                                ${project.price}
                            </div>
                            <div className="text-sm text-gray-500">Fixed Price</div>
                        </div>
                    </div>

                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8 whitespace-pre-wrap">
                        {project.description}
                    </p>

                    {project.demoVideo && (
                        <div className="mb-8 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            <h3 className="font-bold mb-2">Demo Video</h3>
                            <a href={project.demoVideo} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                Watch Demo Video
                            </a>
                        </div>
                    )}

                    {project.liveUrl && (
                        <div className="mb-8">
                            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-bold">
                                Visit Live Project &rarr;
                            </a>
                        </div>
                    )}

                    {/* Notification */}
                    {notification && (
                        <div className={`p-4 rounded-lg mb-6 text-center font-bold ${notification.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {notification.message}
                        </div>
                    )}

                    {/* Actions */}
                    {user?._id !== project.sellerId && project.status !== 'sold' && (
                        <div className="flex gap-4 border-t pt-6">
                            <button
                                onClick={handleBuy}
                                disabled={buying || requesting}
                                className="flex-1 bg-[#FFCB05] hover:bg-[#E6B800] text-black font-[pikachuBold] py-4 rounded-lg shadow-lg text-lg transition-transform hover:scale-105 disabled:opacity-50"
                            >
                                {buying ? "Processing..." : "Buy Project"}
                            </button>
                            <button
                                onClick={handleRequest}
                                disabled={buying || requesting}
                                className="flex-1 bg-white hover:bg-gray-50 border-2 border-[#3c5aa6] text-[#3c5aa6] font-[pikachuBold] py-4 rounded-lg shadow-lg text-lg transition-transform hover:scale-105 disabled:opacity-50"
                            >
                                {requesting ? "Sending..." : "Send Request"}
                            </button>
                        </div>
                    )}

                    {user?._id === project.sellerId && (
                        <div className="text-center text-gray-500 italic mt-4">
                            This is your project.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
