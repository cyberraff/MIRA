"use client";

import { useEffect, useRef, useState } from "react";
import MuxPlayer from "@mux/mux-player-react";

interface FilmPlayerProps {
    filmId: string;
    playbackId: string;
    title: string;
    initialTime: number;
}

export function FilmPlayer({ filmId, playbackId, title, initialTime }: FilmPlayerProps) {
    const playerRef = useRef<any>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const saveProgress = async (currentTime: number, completed: boolean = false) => {
            try {
                await fetch(`/api/films/${filmId}/progress`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        lastTimestamp: currentTime,
                        completed,
                    }),
                });
            } catch (error) {
                console.error("Failed to save progress", error);
            }
        };

        const interval = setInterval(() => {
            if (playerRef.current && !playerRef.current.paused) {
                saveProgress(playerRef.current.currentTime);
            }
        }, 10000); // Save every 10 seconds

        return () => clearInterval(interval);
    }, [filmId]);

    const onEnded = () => {
        if (playerRef.current) {
            saveProgress(playerRef.current.currentTime, true);
        }
    };

    const saveProgress = async (currentTime: number, completed: boolean = false) => {
        try {
            await fetch(`/api/films/${filmId}/progress`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    lastTimestamp: currentTime,
                    completed,
                }),
            });
        } catch (error) {
            console.error("Failed to save progress", error);
        }
    };

    return (
        <MuxPlayer
            ref={playerRef}
            playbackId={playbackId}
            metadata={{
                video_id: filmId,
                video_title: title,
            }}
            startTime={initialTime}
            onEnded={onEnded}
            className="h-full w-full"
        />
    );
}
