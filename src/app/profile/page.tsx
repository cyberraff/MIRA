import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { FilmCard } from "@/components/film-card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/");
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
            favorites: {
                include: {
                    film: true,
                },
            },
            watchProgress: {
                where: {
                    completed: false,
                },
                include: {
                    film: true,
                },
                orderBy: {
                    updatedAt: "desc",
                },
            },
        },
    });

    if (!user) {
        redirect("/");
    }

    return (
        <div className="container mx-auto px-4 py-12 md:px-8 max-w-6xl">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-12">
                <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary border border-primary/20">
                    {user.name?.[0] || user.email?.[0]?.toUpperCase()}
                </div>
                <div>
                    <h1 className="text-4xl font-bold tracking-tight">{user.name || "User"}</h1>
                    <p className="text-muted-foreground mt-1">{user.email}</p>
                    <div className="flex gap-2 mt-3">
                        <Badge variant="secondary">{user.role}</Badge>
                        <Badge variant="outline">{user.favorites.length} Saved Films</Badge>
                    </div>
                </div>
            </div>

            <div className="space-y-16">
                {/* Continue Watching */}
                {user.watchProgress.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-bold mb-6">Continue Watching</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {user.watchProgress.map((wp: any) => (
                                <FilmCard
                                    key={wp.film.id}
                                    {...wp.film}
                                    thumbnail={wp.film.thumbnailUrl}
                                />
                            ))}
                        </div>
                    </section>
                )}

                <Separator className="bg-zinc-800" />

                {/* Saved Films */}
                <section>
                    <h2 className="text-2xl font-bold mb-6">Saved Films</h2>
                    {user.favorites.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {user.favorites.map((fav: any) => (
                                <FilmCard
                                    key={fav.film.id}
                                    {...fav.film}
                                    thumbnail={fav.film.thumbnailUrl}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-zinc-900/50 rounded-2xl border border-dashed border-zinc-800">
                            <p className="text-muted-foreground">You haven't saved any films yet.</p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
