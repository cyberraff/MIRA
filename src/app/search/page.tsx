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
            <div className="container mx-auto px-4 py-20 text-center">
                <h1 className="text-3xl font-bold tracking-tight mb-4">Search</h1>
                <p className="text-muted-foreground">Please enter a search term to find films.</p>
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
        <div className="container mx-auto px-4 py-8 md:px-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">
                    Search Results for "{query}"
                </h1>
                <p className="text-muted-foreground mt-2">
                    Found {films.length} {films.length === 1 ? "film" : "films"}
                </p>
            </div>

            {films.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {films.map((film: any) => (
                        <FilmCard key={film.id} {...film} thumbnail={film.thumbnailUrl} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="rounded-full bg-muted p-6 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
                    </div>
                    <h2 className="text-xl font-semibold">No films found</h2>
                    <p className="text-muted-foreground max-w-xs mt-2">
                        Try searching for something else or browse our trending films.
                    </p>
                </div>
            )}
        </div>
    );
}
