"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface Film {
    id: string;
    title: string;
    category: string;
}

interface CollectionFilm {
    id: string;
    film: Film;
    order: number;
}

interface CollectionManagerProps {
    collectionId: string;
    initialFilms: CollectionFilm[];
    allFilms: Film[];
}

export function CollectionManager({
    collectionId,
    initialFilms,
    allFilms,
}: CollectionManagerProps) {
    const router = useRouter();
    const [films, setFilms] = useState(initialFilms);
    const [isLoading, setIsLoading] = useState(false);

    const addFilm = async (filmId: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/collections/${collectionId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ filmId, order: films.length }),
            });

            if (response.ok) {
                router.refresh();
                // In a real app, we'd update state or refetch
                const newFilm = allFilms.find((f) => f.id === filmId);
                if (newFilm) {
                    setFilms([...films, { id: Math.random().toString(), film: newFilm, order: films.length }]);
                }
            }
        } catch (error) {
            console.error("Error adding film:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const removeFilm = async (collectionFilmId: string) => {
        // This would need a specific API route or a DELETE on the collection film
        // For MVP, let's assume we can handle it
        console.log("Remove film", collectionFilmId);
    };

    return (
        <div className="space-y-12">
            <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black uppercase tracking-widest opacity-40">FILMS IN COLLECTION</h3>
                <Dialog>
                    <DialogTrigger asChild>
                        <button className="bg-white text-black px-6 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-colors">
                            ADD FILM
                        </button>
                    </DialogTrigger>
                    <DialogContent className="bg-black border-white/10 rounded-none text-white max-w-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-black uppercase tracking-tighter">ADD TO COLLECTION</DialogTitle>
                        </DialogHeader>
                        <div className="max-h-[60vh] overflow-auto space-y-0 mt-8 border-t border-white/10">
                            {allFilms
                                .filter((f) => !films.find((cf) => cf.film.id === f.id))
                                .map((film) => (
                                    <div
                                        key={film.id}
                                        className="flex items-center justify-between p-6 border-b border-white/10 hover:bg-white/5 transition-colors"
                                    >
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-widest">{film.title}</p>
                                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mt-1">{film.category}</p>
                                        </div>
                                        <button
                                            onClick={() => addFilm(film.id)}
                                            disabled={isLoading}
                                            className="text-[10px] font-black uppercase tracking-widest border border-white/20 px-4 py-2 hover:bg-white hover:text-black transition-all disabled:opacity-50"
                                        >
                                            {isLoading ? "..." : "ADD"}
                                        </button>
                                    </div>
                                ))}
                            {allFilms.filter((f) => !films.find((cf) => cf.film.id === f.id)).length === 0 && (
                                <div className="py-20 text-center">
                                    <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-20">NO FILMS AVAILABLE</p>
                                </div>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="space-y-0 border-t border-white/10">
                {films.map((cf, index) => (
                    <div key={cf.id} className="grid grid-cols-1 md:grid-cols-4 gap-8 p-8 border-b border-white/10 group hover:bg-white/5 transition-colors items-center">
                        <div className="flex items-center gap-6">
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-20">{String(index + 1).padStart(2, '0')}</span>
                            <h3 className="text-xs font-black uppercase tracking-widest">{cf.film.title}</h3>
                        </div>
                        <div className="md:col-span-2">
                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">CATEGORY</span>
                            <p className="text-[10px] font-black uppercase mt-1">{cf.film.category}</p>
                        </div>
                        <div className="text-right">
                            <button
                                onClick={() => removeFilm(cf.id)}
                                className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                REMOVE
                            </button>
                        </div>
                    </div>
                ))}
                {films.length === 0 && (
                    <div className="py-32 text-center">
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-20">COLLECTION EMPTY</p>
                    </div>
                )}
            </div>
        </div>
    );
}
