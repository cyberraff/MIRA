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
import { AdminFilmsActions } from "@/components/admin/admin-films-actions";

export default async function AdminFilmsPage() {
    const films = await prisma.film.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="space-y-20">
            <div className="flex items-end justify-between border-b border-white/10 pb-12">
                <div>
                    <h2 className="text-xs font-black uppercase tracking-[0.3em] opacity-40">DATABASE</h2>
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mt-4">FILM LIBRARY</h1>
                </div>
                <AdminFilmsActions />
            </div>

            <div className="space-y-0 border-t border-white/10">
                {films.map((film: any) => (
                    <div key={film.id} className="grid grid-cols-1 md:grid-cols-6 gap-8 p-8 border-b border-white/10 group hover:bg-white/5 transition-colors items-center">
                        <div className="md:col-span-2">
                            <h3 className="text-xs font-black uppercase tracking-widest">{film.title}</h3>
                        </div>
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">CATEGORY</span>
                            <p className="text-[10px] font-black uppercase mt-1">{film.category}</p>
                        </div>
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">STATUS</span>
                            <p className="text-[10px] font-black uppercase mt-1">{film.visibility}</p>
                        </div>
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">VIEWS</span>
                            <p className="text-[10px] font-black uppercase mt-1">{film.views}</p>
                        </div>
                        <div className="text-right">
                            <Link
                                href={`/admin/films/${film.id}`}
                                className="text-[10px] font-black uppercase tracking-widest border border-white/20 px-6 py-2 hover:bg-white hover:text-black transition-all"
                            >
                                EDIT
                            </Link>
                        </div>
                    </div>
                ))}
                {films.length === 0 && (
                    <div className="py-32 text-center">
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-20">LIBRARY EMPTY</p>
                    </div>
                )}
            </div>
        </div>
    );
}
