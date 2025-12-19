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
import { Badge } from "@/components/ui/badge";

export default async function AdminFilmsPage() {
    const films = await prisma.film.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Film Library</h1>
                    <p className="text-muted-foreground mt-2">Manage your curated short films and documentaries.</p>
                </div>
                <Button asChild>
                    <Link href="/admin/films/new">Add New Film</Link>
                </Button>
            </div>

            <div className="rounded-md border border-zinc-800 bg-zinc-900/50">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-zinc-800">
                            <TableHead className="w-[300px]">Title</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Visibility</TableHead>
                            <TableHead>Views</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {films.map((film: any) => (
                            <TableRow key={film.id} className="border-zinc-800 hover:bg-zinc-800/50">
                                <TableCell className="font-medium">{film.title}</TableCell>
                                <TableCell>{film.category}</TableCell>
                                <TableCell>
                                    <Badge variant={film.visibility === "PUBLIC" ? "default" : "secondary"}>
                                        {film.visibility}
                                    </Badge>
                                </TableCell>
                                <TableCell>{film.views}</TableCell>
                                <TableCell>{new Date(film.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link href={`/admin/films/${film.id}`}>Edit</Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {films.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    No films found. Start by adding your first film.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
