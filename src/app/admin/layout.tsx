import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
        redirect("/");
    }

    return (
        <div className="min-h-screen bg-black pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-6 md:px-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                            ADMIN PANEL
                        </h1>
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40 mt-4">
                            MIRA CURATION TOOLS
                        </p>
                    </div>
                    <nav className="flex flex-wrap gap-8">
                        <Link
                            href="/admin"
                            className="text-xs font-black uppercase tracking-widest hover:opacity-50 transition-opacity"
                        >
                            DASHBOARD
                        </Link>
                        <Link
                            href="/admin/films"
                            className="text-xs font-black uppercase tracking-widest hover:opacity-50 transition-opacity"
                        >
                            FILMS
                        </Link>
                        <Link
                            href="/admin/collections"
                            className="text-xs font-black uppercase tracking-widest hover:opacity-50 transition-opacity"
                        >
                            COLLECTIONS
                        </Link>
                    </nav>
                </div>

                <main>
                    {children}
                </main>
            </div>
        </div>
    );
}
