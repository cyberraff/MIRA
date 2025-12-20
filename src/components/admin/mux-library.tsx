"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Film, CheckCircle2 } from "lucide-react";

interface MuxAsset {
    id: string;
    playbackId: string;
    status: string;
    createdAt: string;
    duration: number;
    isImported: boolean;
}

interface MuxLibraryProps {
    onImport: (asset: MuxAsset) => void;
}

export function MuxLibrary({ onImport }: MuxLibraryProps) {
    const [assets, setAssets] = useState<MuxAsset[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const fetchAssets = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/mux/assets");
            const data = await response.json();
            setAssets(data);
        } catch (error) {
            console.error("Failed to fetch Mux assets:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchAssets();
        }
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <button className="border border-white/20 text-white px-8 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                    MUX LIBRARY
                </button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl bg-black border-white/10 text-white rounded-none">
                <DialogHeader>
                    <DialogTitle className="text-xs font-black uppercase tracking-[0.3em]">MUX ASSET LIBRARY</DialogTitle>
                </DialogHeader>

                <div className="mt-8 max-h-[60vh] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-white/20">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="h-8 w-8 animate-spin opacity-20" />
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-20">FETCHING CLOUD ASSETS...</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {assets.length === 0 ? (
                                <p className="text-center py-20 text-[10px] font-black uppercase tracking-widest opacity-20">NO ASSETS FOUND IN MUX</p>
                            ) : (
                                assets.map((asset) => (
                                    <div key={asset.id} className="flex items-center justify-between p-6 border border-white/5 hover:bg-white/5 transition-colors">
                                        <div className="flex items-center gap-6">
                                            <div className="h-12 w-12 bg-zinc-900 flex items-center justify-center">
                                                <Film className="h-6 w-6 opacity-40" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest">{asset.id}</p>
                                                <p className="text-[8px] font-bold uppercase tracking-widest opacity-40 mt-1">
                                                    {(asset.duration / 60).toFixed(2)} MINS • {asset.status} • {new Date(parseInt(asset.createdAt) * 1000).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>

                                        {asset.isImported ? (
                                            <div className="flex items-center gap-2 px-6 py-2 opacity-40">
                                                <CheckCircle2 className="h-3 w-3" />
                                                <span className="text-[8px] font-black uppercase tracking-widest">IMPORTED</span>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    onImport(asset);
                                                    setIsOpen(false);
                                                }}
                                                className="bg-white text-black px-6 py-2 text-[8px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-colors"
                                            >
                                                IMPORT
                                            </button>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
