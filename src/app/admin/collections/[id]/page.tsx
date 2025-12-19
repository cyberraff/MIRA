import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { CollectionManager } from "@/components/collection-manager";
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
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-4">
                        <Link href="/admin/collections" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                            ← Back to Collections
                        </Link>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight mt-2">{collection.title}</h1>
                    <p className="text-muted-foreground mt-2">{collection.description || "No description provided."}</p>
                </div>
                <Button variant="outline" asChild>
                    <Link href={`/admin/collections/${collection.id}/edit`}>Edit Details</Link>
                </Button>
            </div>

            <div className="border-t border-zinc-800 pt-8">
                <CollectionManager
                    collectionId={collection.id}
                    initialFilms={collection.films as any}
                    allFilms={allFilms as any}
                />
            </div>
        </div>
    );
}
