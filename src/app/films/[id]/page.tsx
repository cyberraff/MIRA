import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { FilmPlayer } from "@/components/film/film-player";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { FavoriteButton } from "@/components/shared/favorite-button";
import { FilmCard } from "@/components/shared/film-card";
import * as motion from "framer-motion/client";

export default async function FilmDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    const film = await prisma.film.findUnique({
        where: { id },
    });

    if (!film || film.visibility === "PRIVATE") {
        notFound();
    }

    let initialTime = 0;
    if (session?.user) {
        const progress = await prisma.watchProgress.findUnique({
            where: {
                userId_filmId: {
                    userId: session.user.id,
                    filmId: film.id,
                },
            },
        });
        initialTime = progress?.lastTimestamp || 0;
    }

    const relatedFilms = await prisma.film.findMany({
        where: {
            category: film.category,
            NOT: { id: film.id },
            visibility: "PUBLIC",
        },
        take: 3,
    });

    return (
        <div className="flex flex-col gap-20 pb-32 pt-32">
            <div className="max-w-7xl mx-auto w-full">
                {/* Main Content: Video Player */}
                <section className="px-6 md:px-10">
                    <div className="aspect-video w-full bg-zinc-900 overflow-hidden relative group">
                        {session?.user ? (
                            <FilmPlayer
                                filmId={film.id}
                                playbackId={film.videoUrl}
                                title={film.title}
                                initialTime={initialTime}
                            />
                        ) : (
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
                                        Sign in to stream this film and unlock the full library.
                                    </p>
                                    <Button asChild className="bg-white text-black hover:bg-zinc-200 font-black tracking-widest text-[10px] px-8 py-6 rounded-none uppercase">
                                        <Link href="/api/auth/signin">Sign In to Watch</Link>
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-12 flex flex-col md:flex-row md:items-start justify-between gap-12">
                        <div className="max-w-3xl space-y-8">
                            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                                {film.title}
                            </h1>
                            <p className="text-xs font-bold uppercase tracking-[0.2em] leading-relaxed opacity-60 max-w-2xl">
                                {film.description}
                            </p>
                        </div>

                        <div className="flex flex-col gap-8 min-w-[200px]">
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black uppercase tracking-widest opacity-40">DETAILS</h3>
                                <div className="flex flex-col gap-2 text-[10px] font-bold uppercase tracking-widest">
                                    <span>CATEGORY: {film.category}</span>
                                    <span>DURATION: {film.duration}</span>
                                    <span>VIEWS: {film.views}</span>
                                    {film.director && <span>DIRECTOR: {film.director}</span>}
                                    {film.year && <span>YEAR: {film.year}</span>}
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {film.tags.map((tag: string) => (
                                    <span key={tag} className="text-[10px] font-bold uppercase tracking-widest opacity-40">#{tag}</span>
                                ))}
                            </div>

                            <div className="pt-4">
                                {session?.user && <FavoriteButton filmId={film.id} />}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Related Content */}
                {relatedFilms.length > 0 && (
                    <section className="px-6 md:px-10 mt-20">
                        <div className="mb-12">
                            <h2 className="text-xs font-black uppercase tracking-[0.3em]">UP NEXT</h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-12">
                            {relatedFilms.map((f: any) => (
                                <FilmCard key={f.id} {...f} thumbnail={f.thumbnailUrl} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
