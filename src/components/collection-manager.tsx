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
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Films in Collection</h2>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button size="sm">Add Film</Button>
                    </DialogTrigger>
                    <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                        <DialogHeader>
                            <DialogTitle>Add Film to Collection</DialogTitle>
                        </DialogHeader>
                        <div className="max-h-[400px] overflow-auto space-y-2 mt-4">
                            {allFilms
                                .filter((f) => !films.find((cf) => cf.film.id === f.id))
                                .map((film) => (
                                    <div
                                        key={film.id}
                                        className="flex items-center justify-between p-3 rounded-md bg-zinc-800 hover:bg-zinc-700 transition-colors"
                                    >
                                        <div>
                                            <p className="font-medium">{film.title}</p>
                                            <p className="text-xs text-muted-foreground">{film.category}</p>
                                        </div>
                                        <Button
                                            size="sm"
                                            onClick={() => addFilm(film.id)}
                                            disabled={isLoading}
                                        >
                                            Add
                                        </Button>
                                    </div>
                                ))}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="rounded-md border border-zinc-800 bg-zinc-900/50">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-zinc-800">
                            <TableHead className="w-12">Order</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {films.map((cf, index) => (
                            <TableRow key={cf.id} className="border-zinc-800 hover:bg-zinc-800/50">
                                <TableCell>{index + 1}</TableCell>
                                <TableCell className="font-medium">{cf.film.title}</TableCell>
                                <TableCell>{cf.film.category}</TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                        onClick={() => removeFilm(cf.id)}
                                    >
                                        Remove
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {films.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                    No films in this collection yet.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
