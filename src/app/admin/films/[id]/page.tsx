import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { FilmForm } from "@/components/admin/film-form";
import Link from "next/link";

export default async function EditFilmPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const film = await prisma.film.findUnique({
        where: { id },
    });

    if (!film) {
        notFound();
    }

    return (
        <div className="space-y-12">
            <Link href="/admin/films" className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 hover:opacity-100 transition-opacity">
                ← BACK TO LIBRARY
            </Link>
            <FilmForm initialData={film as any} />
        </div>
    );
}
