"use client";

import { useState, useEffect } from "react";
import { Loader2, Trash2, ExternalLink, Flag, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function ModerationPage() {
    const [reports, setReports] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchReports = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/admin/reports");
            const data = await res.json();
            setReports(data);
        } catch (error) {
            console.error("Failed to fetch reports:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handleDeleteComment = async (commentId: string) => {
        if (!confirm("ARE YOU SURE YOU WANT TO DELETE THIS COMMENT? ALL REPORTS FOR IT WILL BE REMOVED.")) return;
        try {
            const res = await fetch(`/api/comments/${commentId}`, { method: "DELETE" });
            if (res.ok) fetchReports();
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    return (
        <div className="space-y-12 pb-20">
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <Flag className="h-4 w-4 text-white/40" />
                    <h1 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40">
                        COMMUNITY MODERATION
                    </h1>
                </div>
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                    REPORTED CONTENT
                </h2>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-40 gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-white/20" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/20">FETCHING REPORTS...</p>
                </div>
            ) : reports.length === 0 ? (
                <div className="py-40 text-center border border-white/5 bg-white/[0.02]">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/20">NO ACTIVE REPORTS. THE COMMUNITY IS CLEAN.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {reports.map((report) => (
                        <div key={report.id} className="border border-white/5 bg-white/[0.02] p-8 flex flex-col md:flex-row gap-8 items-start justify-between">
                            <div className="flex-1 space-y-6">
                                <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest">
                                    <span className="text-white/40">REPORTER:</span>
                                    <span>{report.user.name} ({report.user.email})</span>
                                    <span className="text-white/20">•</span>
                                    <span className="text-white/40">REASON:</span>
                                    <span className="text-red-500">{report.reason}</span>
                                </div>

                                <div className="bg-black border border-white/5 p-6 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <MessageSquare className="h-3 w-3 text-white/20" />
                                        <span className="text-[8px] font-black uppercase tracking-widest text-white/40">CONTENT BY {report.comment.user.name.toUpperCase()}</span>
                                    </div>
                                    <p className="text-xs font-medium leading-relaxed opacity-80">{report.comment.content}</p>
                                </div>

                                <div className="flex items-center gap-6">
                                    <Link
                                        href={`/films/${report.comment.filmId}`}
                                        className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors"
                                    >
                                        <ExternalLink className="h-3 w-3" />
                                        VIEW ON FILM: {report.comment.film.title}
                                    </Link>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => handleDeleteComment(report.comment.id)}
                                    className="bg-red-500 text-white px-8 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all flex items-center gap-2"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    DELETE
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
