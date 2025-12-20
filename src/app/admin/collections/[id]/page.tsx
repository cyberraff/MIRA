import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { CollectionManager } from "@/components/admin/collection-manager";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function CollectionDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const collection = await prisma.collection.findUnique({
        where: { id },
        include: {
            films: {
                include: {
                    film: true,
                },
                orderBy: {
                    order: "asc",
                },
            },
        },
    });

    if (!collection) {
        notFound();
    }

    const allFilms = await prisma.film.findMany({
        where: { visibility: "PUBLIC" },
        select: {
            id: true,
            title: true,
            category: true,
        },
    });

    return (
        <div className="space-y-20">
            <div className="flex items-end justify-between border-b border-white/10 pb-12">
                <div>
                    <Link href="/admin/collections" className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 hover:opacity-100 transition-opacity">
                        ← BACK TO COLLECTIONS
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mt-8">{collection.title}</h1>
                    {collection.description && (
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mt-4 max-w-xl">
                            {collection.description}
                        </p>
                    )}
                </div>
                <button className="border border-white/20 px-8 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                    <Link href={`/admin/collections/${collection.id}/edit`}>EDIT DETAILS</Link>
                </button>
            </div>

            <div className="pt-8">
                <CollectionManager
                    collectionId={collection.id}
                    initialFilms={collection.films as any}
                    allFilms={allFilms as any}
                />
            </div>
        </div>
    );
}
