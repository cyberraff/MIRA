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
        <div className="space-y-20">
            <div className="flex items-end justify-between border-b border-white/10 pb-12">
                <div>
                    <h2 className="text-xs font-black uppercase tracking-[0.3em] opacity-40">CURATION</h2>
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mt-4">COLLECTIONS</h1>
                </div>
                <button className="bg-white text-black px-8 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-colors">
                    <Link href="/admin/collections/new">CREATE COLLECTION</Link>
                </button>
            </div>

            <div className="space-y-0 border-t border-white/10">
                {collections.map((collection: any) => (
                    <div key={collection.id} className="grid grid-cols-1 md:grid-cols-4 gap-8 p-8 border-b border-white/10 group hover:bg-white/5 transition-colors items-center">
                        <div className="md:col-span-2">
                            <h3 className="text-xs font-black uppercase tracking-widest">{collection.title}</h3>
                        </div>
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">FILMS</span>
                            <p className="text-[10px] font-black uppercase mt-1">{collection._count.films}</p>
                        </div>
                        <div className="text-right">
                            <Link
                                href={`/admin/collections/${collection.id}`}
                                className="text-[10px] font-black uppercase tracking-widest border border-white/20 px-6 py-2 hover:bg-white hover:text-black transition-all"
                            >
                                MANAGE
                            </Link>
                        </div>
                    </div>
                ))}
                {collections.length === 0 && (
                    <div className="py-32 text-center">
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-20">NO COLLECTIONS</p>
                    </div>
                )}
            </div>
        </div>
    );
}
