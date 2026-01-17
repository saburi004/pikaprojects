"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function SponsorshipDetail({ params }) {
    const { id } = use(params);
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    const [sponsorship, setSponsorship] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [applicants, setApplicants] = useState([]); // For owner view

    // Application Form
    const [intro, setIntro] = useState("");
    const [contact, setContact] = useState("");
    const [resume, setResume] = useState(null);
    const [portfolio, setPortfolio] = useState("");
    const [prevProjects, setPrevProjects] = useState(""); // Simplified text for "Previous projects within platform"

    const [showApplyForm, setShowApplyForm] = useState(false);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        const fetchSponsorship = async () => {
            try {
                const res = await fetch(`/api/sponsorships/${id}`);
                if (!res.ok) throw new Error("Not found");
                const data = await res.json();
                setSponsorship(data);

                // If owner, fetch applicants
                if (user && data && user._id === data.sponsorId._id) { // data.sponsorId is populated object
                    const appRes = await fetch(`/api/applications?sponsorshipId=${id}`);
                    const apps = await appRes.json();
                    setApplicants(apps);
                }
            } catch (error) {
                console.error("Error fetching sponsorship:", error);
            } finally {
                setLoading(false);
            }
        };
        if (id && !authLoading) fetchSponsorship();
    }, [id, user, authLoading]);

    const handleApply = async (e) => {
        e.preventDefault();
        if (!user) return router.push("/auth");
        setApplying(true);
        setNotification(null);

        const handleUpload = async (file) => {
            const formData = new FormData();
            formData.append('file', file);
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const data = await res.json();
            return data.url;
        };

        try {
            let resumeUrl = "";
            if (resume) {
                resumeUrl = await handleUpload(resume);
            }

            const appData = {
                sponsorshipId: id,
                developerId: user._id,
                developerName: user.displayName || "Unknown Dev",
                intro,
                contactNumber: contact,
                portfolioUrl: portfolio,
                previousProjects: prevProjects,
                resumeUrl
            };

            const res = await fetch('/api/applications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(appData)
            });

            if (!res.ok) throw new Error("Failed to apply");

            setNotification({ type: 'success', message: 'Application submitted successfully!' });
            setShowApplyForm(false);
        } catch (error) {
            console.error("Application failed:", error);
            setNotification({ type: 'error', message: 'Failed to submit application.' });
        } finally {
            setApplying(false);
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;
    if (!sponsorship) return <div className="p-8">Sponsorship not found.</div>;

    const isOwner = user && sponsorship.sponsorId && (user._id === sponsorship.sponsorId._id || user._id === sponsorship.sponsorId);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg border-t-8 border-[#3c5aa6] p-8">

                <div className="flex justify-between items-start mb-6">
                    <h1 className="text-3xl font-[pikachuBold] text-gray-800 dark:text-white">
                        {sponsorship.title}
                    </h1>
                    <span className="bg-[#FFCB05] text-black font-bold px-4 py-2 rounded-full shadow-sm">
                        Budget: {sponsorship.budget}
                    </span>
                </div>

                <div className="mb-8 space-y-4">
                    <div className="flex gap-4 text-sm text-gray-500">
                        <span>Posted by: {sponsorship.sponsorName}</span>
                        <span>Timeline: {sponsorship.timeline}</span>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg border-l-4 border-[#3c5aa6]">
                        <h3 className="font-bold mb-2">Problem Statement</h3>
                        <p className="whitespace-pre-wrap">{sponsorship.description}</p>
                    </div>

                    <div>
                        <h3 className="font-bold mb-2">Required Skills</h3>
                        <div className="flex gap-2">
                            {sponsorship.skills?.map(skill => (
                                <span key={skill} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {notification && (
                    <div className={`p-4 rounded-lg mb-6 text-center font-bold ${notification.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {notification.message}
                    </div>
                )}

                {/* Action Area */}
                {!isOwner && (
                    <div>
                        {!showApplyForm ? (
                            <button
                                onClick={() => setShowApplyForm(true)}
                                className="w-full bg-[#3c5aa6] text-white font-[pikachuBold] py-4 rounded-lg shadow-lg hover:bg-[#2a4a8b] transition text-xl"
                            >
                                Accept Challenge (Apply)
                            </button>
                        ) : (
                            <form onSubmit={handleApply} className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg space-y-4 animate-fadeIn">
                                <h3 className="font-[pikachuBold] text-xl mb-4">Application Form</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold mb-1">Contact Number</label>
                                        <input type="text" required value={contact} onChange={e => setContact(e.target.value)} className="w-full px-3 py-2 rounded border" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-1">Portfolio / Github</label>
                                        <input type="url" value={portfolio} onChange={e => setPortfolio(e.target.value)} className="w-full px-3 py-2 rounded border" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold mb-1">Short Introduction</label>
                                    <textarea required rows={3} value={intro} onChange={e => setIntro(e.target.value)} className="w-full px-3 py-2 rounded border" placeholder="Why are you the best trainer for this job?" />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold mb-1">Previous Projects (on this platform)</label>
                                    <textarea rows={2} value={prevProjects} onChange={e => setPrevProjects(e.target.value)} className="w-full px-3 py-2 rounded border" placeholder="List IDs or titles..." />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold mb-1">Resume (PDF)</label>
                                    <input type="file" accept="application/pdf" onChange={e => setResume(e.target.files[0])} className="w-full text-sm" />
                                </div>

                                <div className="flex gap-4">
                                    <button type="button" onClick={() => setShowApplyForm(false)} className="flex-1 bg-gray-300 text-black font-bold py-3 rounded-lg">Cancel</button>
                                    <button type="submit" disabled={applying} className="flex-1 bg-[#FFCB05] text-black font-bold py-3 rounded-lg hover:bg-[#E6B800]">
                                        {applying ? "Sending..." : "Submit Application"}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                )}

                {/* Owner View - Applicants */}
                {isOwner && (
                    <div className="mt-12 border-t pt-8">
                        <h2 className="text-2xl font-[pikachuBold] mb-6">Challengers (Applicants)</h2>
                        {applicants.length === 0 ? (
                            <p className="text-gray-500">No applications yet.</p>
                        ) : (
                            <div className="space-y-4">
                                {applicants.map(app => (
                                    <div key={app.id} className="bg-white border p-4 rounded-lg shadow-sm">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-bold text-lg">{app.developerName}</h4>
                                                <p className="text-sm text-gray-600">{app.developerEmail} | {app.contactNumber}</p>
                                            </div>
                                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">{new Date(app.createdAt?.toDate()).toLocaleDateString()}</span>
                                        </div>
                                        <p className="mt-2 text-gray-700 bg-gray-50 p-2 rounded">{app.intro}</p>
                                        <div className="mt-4 flex gap-4 text-sm">
                                            {app.resumeUrl && <a href={app.resumeUrl} target="_blank" className="text-blue-600 underline font-bold">View Resume</a>}
                                            {app.portfolioUrl && <a href={app.portfolioUrl} target="_blank" className="text-blue-600 underline">Portfolio</a>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}
