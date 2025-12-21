"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { FilmPlayer } from "./film-player"; // Reuse existing player or use simple Mux player
import MuxPlayer from "@mux/mux-player-react";

interface TrailerButtonProps {
    trailerUrl: string;
    title: string;
}

export function TrailerButton({ trailerUrl, title }: TrailerButtonProps) {
    if (!trailerUrl) return null;

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="border-white/20 hover:bg-white hover:text-black font-black uppercase tracking-widest text-[10px] px-8 h-12 rounded-none transition-colors">
                    Watch Trailer
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl bg-black border-white/10 p-0 overflow-hidden text-white">
                <DialogHeader className="sr-only">
                    <DialogTitle>Trailer: {title}</DialogTitle>
                </DialogHeader>
                <div className="aspect-video w-full bg-black">
                    <MuxPlayer
                        streamType="on-demand"
                        playbackId={trailerUrl}
                        metadata={{
                            video_title: `Trailer: ${title}`,
                        }}
                        accentColor="#ffffff"
                        className="w-full h-full"
                        autoPlay
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
