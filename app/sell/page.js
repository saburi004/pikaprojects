"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function SellPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [techStack, setTechStack] = useState("");
    const [liveUrl, setLiveUrl] = useState("");
    const [category, setCategory] = useState("Web App");

    // Files
    const [images, setImages] = useState([]);
    const [demoVideo, setDemoVideo] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleImageChange = (e) => {
        if (e.target.files) {
            setImages(e.target.files);
        }
    };

    const handleVideoChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setDemoVideo(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (!user) {
            setError("You must be logged in to sell a project.");
            setLoading(false);
            return;
        }

        try {
            // 1. Upload Images
            const imageUrls = await Promise.all(
                images.map(img => handleUpload(img))
            );

            let videoUrl = "";
            if (demoVideo) {
                videoUrl = await handleUpload(demoVideo);
            }

            const projectData = {
                sellerId: user._id,
                sellerName: user.displayName,
                title,
                description,
                price: Number(price),
                category,
                techStack: techStack.split(',').map(t => t.trim()),
                liveUrl,
                images: imageUrls,
                demoVideo: videoUrl
            };

            const res = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(projectData)
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to create project");
            }

            router.push('/dashboard');

        } catch (err) {
            console.error("Error listing project:", err);
            setError(err.message || "Failed to create project. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) return <div className="p-8">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
            <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg border-t-8 border-[#FFCB05] p-8">
                <h1 className="text-3xl font-[pikachuBold] mb-6 text-gray-800 dark:text-white">
                    List Your Project
                </h1>

                {error && (
                    <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                            Project Title
                        </label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#FFCB05] outline-none dark:bg-gray-700 dark:text-white"
                            placeholder="e.g., PokéDex Helper"
                        />
                    </div>

                    {/* Category & Price */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                Category
                            </label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#FFCB05] outline-none dark:bg-gray-700 dark:text-white"
                            >
                                <option>Web App</option>
                                <option>Mobile App</option>
                                <option>Game</option>
                                <option>UI Kit</option>
                                <option>Script/Bot</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                Price ($)
                            </label>
                            <input
                                type="number"
                                required
                                min="0"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#FFCB05] outline-none dark:bg-gray-700 dark:text-white"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                            Description
                        </label>
                        <textarea
                            required
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#FFCB05] outline-none dark:bg-gray-700 dark:text-white"
                            placeholder="Describe your project..."
                        />
                    </div>

                    {/* Tech Stack */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                            Tech Stack (comma separated)
                        </label>
                        <input
                            type="text"
                            value={techStack}
                            onChange={(e) => setTechStack(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#FFCB05] outline-none dark:bg-gray-700 dark:text-white"
                            placeholder="React, Next.js, Firebase..."
                        />
                    </div>

                    {/* Live URL */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                            Deployed Link (Optional)
                        </label>
                        <input
                            type="url"
                            value={liveUrl}
                            onChange={(e) => setLiveUrl(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#FFCB05] outline-none dark:bg-gray-700 dark:text-white"
                            placeholder="https://my-project.vercel.app"
                        />
                    </div>

                    {/* Files */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                Images (Screenshots)
                            </label>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                Demo Video (Optional)
                            </label>
                            <input
                                type="file"
                                accept="video/*"
                                onChange={handleVideoChange}
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                        </div>
                    </div>


                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#FFCB05] hover:bg-[#E6B800] text-black font-[pikachuBold] py-4 rounded-lg shadow-lg text-xl transition-transform hover:scale-105"
                    >
                        {loading ? "Listing..." : "List Project for Sale"}
                    </button>
                </form>
            </div>
        </div>
    );
}
