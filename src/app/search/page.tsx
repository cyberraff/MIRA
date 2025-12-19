import { prisma } from "@/lib/prisma";
import { FilmCard } from "@/components/film-card";

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>;
}) {
    const resolvedParams = await searchParams;
    const query = resolvedParams.q;

    if (!query) {
        return (
            <div className="flex flex-col items-center justify-center py-40 px-6 text-center">
                <h1 className="text-xs font-black uppercase tracking-[0.3em] mb-4">SEARCH</h1>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">ENTER A SEARCH TERM TO FIND FILMS</p>
            </div>
        );
    }

    const films = await prisma.film.findMany({
        where: {
            visibility: "PUBLIC",
            OR: [
                { title: { contains: query, mode: "insensitive" } },
                { description: { contains: query, mode: "insensitive" } },
                { category: { contains: query, mode: "insensitive" } },
                { tags: { has: query } },
            ],
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <div className="flex flex-col gap-20 pb-32 pt-32">
            <div className="max-w-7xl mx-auto w-full px-6 md:px-10">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                        RESULTS FOR "{query}"
                    </h1>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mt-4">
                        FOUND {films.length} {films.length === 1 ? "FILM" : "FILMS"}
                    </p>
                </div>

                {films.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-12">
                        {films.map((film: any) => (
                            <FilmCard key={film.id} {...film} thumbnail={film.thumbnailUrl} />
                        ))}
                    </div>
                ) : (
                    <div className="py-20 border border-white/10 flex items-center justify-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">NO FILMS FOUND</p>
                    </div>
                )}
            </div>
        </div>
    );
}
