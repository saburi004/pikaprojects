"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function NewSponsorship() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [budget, setBudget] = useState("");
    const [timeline, setTimeline] = useState("");
    const [skills, setSkills] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (!user) {
            setError("You must be logged in.");
            setLoading(false);
            return;
        }

        try {
            const data = {
                sponsorId: user._id,
                sponsorName: user.displayName || "Unknown Sponsor",
                title,
                description,
                budget,
                timeline,
                skills: skills.split(",").map(s => s.trim()),
            };

            const res = await fetch('/api/sponsorships', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!res.ok) throw new Error("Failed to create sponsorship");

            router.push("/dashboard");

        } catch (err) {
            console.error("Error creating sponsorship:", err);
            setError("Failed to create sponsorship.");
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) return <div className="p-8">Loading...</div>;

    return (
        <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
            <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border-t-8 border-[#3c5aa6]">
                <h1 className="text-3xl font-[pikachuBold] mb-6 text-gray-800 dark:text-white">Post a Challenge</h1>

                {error && <div className="bg-red-100 p-3 rounded mb-4 text-red-600">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Project Title</label>
                        <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#3c5aa6] outline-none dark:bg-gray-700 dark:text-white" />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Problem Statement (Description)</label>
                        <textarea required rows={5} value={description} onChange={e => setDescription(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#3c5aa6] outline-none dark:bg-gray-700 dark:text-white" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Budget</label>
                            <input type="text" required value={budget} onChange={e => setBudget(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#3c5aa6] outline-none dark:bg-gray-700 dark:text-white" placeholder="$500 - $1000" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Timeline</label>
                            <input type="text" required value={timeline} onChange={e => setTimeline(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#3c5aa6] outline-none dark:bg-gray-700 dark:text-white" placeholder="2 Weeks" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Required Skills (comma separated)</label>
                        <input type="text" value={skills} onChange={e => setSkills(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#3c5aa6] outline-none dark:bg-gray-700 dark:text-white" placeholder="React, Node.js, Design" />
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-[#3c5aa6] text-white font-[pikachuBold] py-3 rounded-lg hover:bg-[#2a4a8b] transition">
                        {loading ? "Posting..." : "Post Sponsorship"}
                    </button>
                </form>
            </div>
        </div>
    );
}
