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
        <div className="flex flex-col gap-32 pb-32 pt-32">
            <div className="max-w-7xl mx-auto w-full px-6 md:px-10">
                <div className="flex flex-col md:flex-row items-start gap-12">
                    <div className="h-32 w-32 bg-white text-black flex items-center justify-center text-5xl font-black uppercase">
                        {user.name?.[0] || user.email?.[0]?.toUpperCase()}
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                            {user.name || "USER"}
                        </h1>
                        <p className="text-xs font-bold uppercase tracking-widest opacity-40">{user.email}</p>
                        <div className="flex gap-6 pt-4">
                            <span className="text-[10px] font-black uppercase tracking-widest">{user.role}</span>
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">{user.favorites.length} SAVED</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-32 mt-32">
                    {/* Continue Watching */}
                    {user.watchProgress.length > 0 && (
                        <section>
                            <div className="mb-12">
                                <h2 className="text-xs font-black uppercase tracking-[0.3em]">CONTINUE WATCHING</h2>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-12">
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

                    {/* Saved Films */}
                    <section>
                        <div className="mb-12">
                            <h2 className="text-xs font-black uppercase tracking-[0.3em]">SAVED FILMS</h2>
                        </div>
                        {user.favorites.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-12">
                                {user.favorites.map((fav: any) => (
                                    <FilmCard
                                        key={fav.film.id}
                                        {...fav.film}
                                        thumbnail={fav.film.thumbnailUrl}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="py-20 border border-white/10 flex items-center justify-center">
                                <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">NO SAVED FILMS</p>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}
