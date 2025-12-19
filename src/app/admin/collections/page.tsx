import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default async function AdminCollectionsPage() {
    const collections = await prisma.collection.findMany({
        include: {
            _count: {
                select: { films: true },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Collections</h1>
                    <p className="text-muted-foreground mt-2">Create and manage curated groups of films.</p>
                </div>
                <Button asChild>
                    <Link href="/admin/collections/new">Create Collection</Link>
                </Button>
            </div>

            <div className="rounded-md border border-zinc-800 bg-zinc-900/50">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-zinc-800">
                            <TableHead className="w-[300px]">Title</TableHead>
                            <TableHead>Films Count</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {collections.map((collection: any) => (
                            <TableRow key={collection.id} className="border-zinc-800 hover:bg-zinc-800/50">
                                <TableCell className="font-medium">{collection.title}</TableCell>
                                <TableCell>{collection._count.films}</TableCell>
                                <TableCell>{new Date(collection.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link href={`/admin/collections/${collection.id}`}>Manage Films</Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {collections.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                    No collections found. Create your first curated collection.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
