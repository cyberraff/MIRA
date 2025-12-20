import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminDashboard() {
    const filmCount = await prisma.film.count();
    const collectionCount = await prisma.collection.count();
    const userCount = await prisma.user.count();
    const totalViews = await prisma.film.aggregate({
        _sum: {
            views: true,
        },
    });

    return (
        <div className="space-y-32">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-widest opacity-40">TOTAL FILMS</h3>
                    <div className="text-6xl font-black uppercase tracking-tighter leading-none">{filmCount}</div>
                </div>
                <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-widest opacity-40">COLLECTIONS</h3>
                    <div className="text-6xl font-black uppercase tracking-tighter leading-none">{collectionCount}</div>
                </div>
                <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-widest opacity-40">TOTAL USERS</h3>
                    <div className="text-6xl font-black uppercase tracking-tighter leading-none">{userCount}</div>
                </div>
                <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-widest opacity-40">TOTAL VIEWS</h3>
                    <div className="text-6xl font-black uppercase tracking-tighter leading-none">{totalViews._sum.views || 0}</div>
                </div>
            </div>

            <div className="border border-white/5 p-20 flex flex-col items-center justify-center text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-20">SYSTEM OPERATIONAL</p>
                <div className="mt-8 flex gap-4">
                    <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
                    <div className="w-1 h-1 bg-white rounded-full animate-pulse delay-75" />
                    <div className="w-1 h-1 bg-white rounded-full animate-pulse delay-150" />
                </div>
            </div>
        </div>
    );
}
