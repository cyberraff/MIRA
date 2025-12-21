"use client";

import { useState } from "react";
import { FilmPlayer } from "@/components/film/film-player";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface FilmViewerProps {
    film: any; // Using any for now to avoid loose typing issues with Prisma include
    initialTime: number;
    hasSubscription: boolean; // For future use
    isLoggedIn: boolean;
}

export function FilmViewer({ film, initialTime, hasSubscription, isLoggedIn }: FilmViewerProps) {
    const [activeTab, setActiveTab] = useState<"MOVIE" | "TRAILER" | "BTS">("MOVIE");

    // "Lock" logic: 
    // Movie: Locked if !hasSubscription (but user said "for now let all be playable", so we skip this check for now)
    // Trailer: Always Free
    // BTS: Always Free

    // For now, simulate everything is free. 
    // To simulate the future state: const isLocked = activeTab === "MOVIE" && !hasSubscription;
    const isLocked = false;

    // Helper to get current playback ID
    const getPlaybackId = () => {
        switch (activeTab) {
            case "MOVIE": return film.videoUrl;
            case "TRAILER": return film.trailerUrl;
            case "BTS": return film.btsUrl;
            default: return film.videoUrl;
        }
    };

    const currentPlaybackId = getPlaybackId();

    return (
        <div className="flex flex-col gap-6">
            {/* Player Container */}
            <div className="aspect-video w-full bg-zinc-900 overflow-hidden relative group shadow-2xl">
                {currentPlaybackId ? (
                    isLocked ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10">
                            <div
                                className="absolute inset-0 bg-cover bg-center opacity-20 blur-sm"
                                style={{ backgroundImage: `url(${film.thumbnailUrl})` }}
                            />
                            <div className="relative z-20 text-center space-y-6 max-w-md px-6">
                                <h3 className="text-2xl font-black uppercase tracking-tighter">
                                    Members Only
                                </h3>
                                <p className="text-xs font-bold uppercase tracking-widest opacity-60">
                                    Sign in or subscribe to stream the full film.
                                </p>
                                <div className="flex gap-4 justify-center">
                                    {!isLoggedIn ? (
                                        <Button asChild className="bg-white text-black hover:bg-zinc-200 font-black tracking-widest text-[10px] px-8 py-6 rounded-none uppercase">
                                            <Link href="/api/auth/signin">Sign In to Watch</Link>
                                        </Button>
                                    ) : (
                                        <Button className="bg-white text-black hover:bg-zinc-200 font-black tracking-widest text-[10px] px-8 py-6 rounded-none uppercase">
                                            Subscribe Now
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <FilmPlayer
                            key={activeTab} // Force re-mount on tab change to reset player state
                            filmId={film.id}
                            playbackId={currentPlaybackId}
                            title={`${film.title} [${activeTab}]`}
                            initialTime={activeTab === "MOVIE" ? initialTime : 0}
                        />
                    )
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
                        <p className="text-xs font-bold uppercase tracking-widest opacity-40">CONTENT NOT AVAILABLE</p>
                    </div>
                )}
            </div>

            {/* Tabs Controller */}
            <div className="flex flex-wrap gap-4 border-b border-white/10 pb-4">
                <button
                    onClick={() => setActiveTab("MOVIE")}
                    className={cn(
                        "text-xs font-black uppercase tracking-widest px-4 py-2 transition-colors",
                        activeTab === "MOVIE"
                            ? "bg-white text-black"
                            : "text-white/40 hover:text-white"
                    )}
                >
                    WATCH MOVIE
                </button>

                {film.trailerUrl && (
                    <button
                        onClick={() => setActiveTab("TRAILER")}
                        className={cn(
                            "text-xs font-black uppercase tracking-widest px-4 py-2 transition-colors",
                            activeTab === "TRAILER"
                                ? "bg-white text-black"
                                : "text-white/40 hover:text-white"
                        )}
                    >
                        TRAILER {activeTab !== "TRAILER" && <span className="opacity-50 ml-2">FREE</span>}
                    </button>
                )}

                {film.btsUrl && (
                    <button
                        onClick={() => setActiveTab("BTS")}
                        className={cn(
                            "text-xs font-black uppercase tracking-widest px-4 py-2 transition-colors",
                            activeTab === "BTS"
                                ? "bg-white text-black"
                                : "text-white/40 hover:text-white"
                        )}
                    >
                        BEHIND THE SCENES {activeTab !== "BTS" && <span className="opacity-50 ml-2">FREE</span>}
                    </button>
                )}
            </div>
        </div>
    );
}
