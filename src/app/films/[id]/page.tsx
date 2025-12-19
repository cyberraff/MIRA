import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { FilmPlayer } from "@/components/film-player";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { FavoriteButton } from "@/components/favorite-button";
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
        <div className="container mx-auto px-4 py-8 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content: Video Player & Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="lg:col-span-2 space-y-6"
                >
                    <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-2xl">
                        <FilmPlayer
                            filmId={film.id}
                            playbackId={film.videoUrl}
                            title={film.title}
                            initialTime={initialTime}
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{film.title}</h1>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm">Share</Button>
                                {session?.user && <FavoriteButton filmId={film.id} />}
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <Badge variant="secondary">{film.category}</Badge>
                            <span>{film.duration}</span>
                            <span>{film.views} views</span>
                            {film.director && <span>Directed by {film.director}</span>}
                            {film.year && <span>{film.year}</span>}
                        </div>

                        <p className="text-lg leading-relaxed text-zinc-300">
                            {film.description}
                        </p>

                        <div className="flex flex-wrap gap-2 pt-2">
                            {film.tags.map((tag: string) => (
                                <Badge key={tag} variant="outline">#{tag}</Badge>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Sidebar: Related Content */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="space-y-6"
                >
                    <h2 className="text-xl font-semibold">Up Next</h2>
                    <div className="flex flex-col gap-6">
                        {relatedFilms.map((f: any) => (
                            <Link key={f.id} href={`/films/${f.id}`}>
                                <div className="flex gap-4 group cursor-pointer">
                                    <div className="relative aspect-video w-40 flex-shrink-0 overflow-hidden rounded-lg">
                                        <img
                                            src={f.thumbnailUrl}
                                            alt={f.title}
                                            className="h-full w-full object-cover transition-transform group-hover:scale-110"
                                        />
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <h3 className="font-medium leading-tight group-hover:text-primary transition-colors">{f.title}</h3>
                                        <p className="text-xs text-muted-foreground mt-1">{f.category} • {f.duration}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
