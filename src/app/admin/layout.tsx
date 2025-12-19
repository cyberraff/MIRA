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
        <div className="flex min-h-screen bg-zinc-950">
            {/* Admin Sidebar */}
            <aside className="w-64 border-r border-zinc-800 bg-zinc-900/50 p-6">
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-primary">Admin Panel</h2>
                    <p className="text-xs text-muted-foreground mt-1">MIRA Curation Tools</p>
                </div>
                <nav className="space-y-2">
                    <Link
                        href="/admin"
                        className="block px-4 py-2 rounded-md text-sm font-medium hover:bg-zinc-800 transition-colors"
                    >
                        Dashboard
                    </Link>
                    <Link
                        href="/admin/films"
                        className="block px-4 py-2 rounded-md text-sm font-medium hover:bg-zinc-800 transition-colors"
                    >
                        Manage Films
                    </Link>
                    <Link
                        href="/admin/collections"
                        className="block px-4 py-2 rounded-md text-sm font-medium hover:bg-zinc-800 transition-colors"
                    >
                        Manage Collections
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-auto">
                {children}
            </main>
        </div>
    );
}
