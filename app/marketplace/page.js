"use client";

import { useEffect, useState } from "react";
import Link from "next/link";


export default function Marketplace() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("All");

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch('/api/projects');
                const data = await res.json();
                setProjects(data);
            } catch (error) {
                console.error("Error fetching projects:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    const filteredProjects = filter === "All" || !filter
        ? projects
        : projects.filter(p => p.category === filter);

    if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="w-12 h-12 border-4 border-[#FFCB05] border-t-transparent rounded-full animate-spin"></div></div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-[pikachuBold] mb-8 text-center text-gray-800 dark:text-white">
                    PokéMart (Marketplace)
                </h1>

                {/* Categories */}
                <div className="flex justify-center gap-4 mb-12 flex-wrap">
                    {["All", "Web App", "Mobile App", "Game", "UI Kit", "Script/Bot"].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-6 py-2 rounded-full font-bold border-2 transition-transform hover:scale-105 ${filter === cat
                                ? "bg-[#FFCB05] text-black border-[#3c5aa6]"
                                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredProjects.map((project) => (
                        <Link href={`/marketplace/${project._id}`} key={project._id} className="group">
                            <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border-2 border-transparent hover:border-[#FFCB05] transition-all duration-300 h-full flex flex-col">
                                <div className="h-48 bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                                    {project.images && project.images.length > 0 ? (
                                        <img
                                            src={project.images[0]}
                                            alt={project.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            No Image
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2 bg-[#FFCB05] text-black text-xs font-bold px-2 py-1 rounded">
                                        {project.category}
                                    </div>
                                </div>

                                <div className="p-5 flex flex-col flex-grow">
                                    <h3 className="font-bold text-xl mb-2 text-gray-800 dark:text-white truncate">
                                        {project.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                                        {project.description}
                                    </p>

                                    <div className="mt-auto flex justify-between items-center">
                                        <span className="text-2xl font-[pikachuNormal] font-bold text-[#3c5aa6] dark:text-[#FFCB05]">
                                            ${project.price}
                                        </span>
                                        <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                            By {project.sellerName || "Trainer"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {filteredProjects.length === 0 && (
                    <div className="text-center py-20 text-gray-500">
                        No projects found in this category. Be the first to list one!
                    </div>
                )}
            </div>
        </div>
    );
}
