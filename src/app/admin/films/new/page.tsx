import { FilmForm } from "@/components/admin/film-form";
import Link from "next/link";

export default function NewFilmPage() {
    return (
        <div className="space-y-12">
            <Link href="/admin/films" className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 hover:opacity-100 transition-opacity">
                ← BACK TO LIBRARY
            </Link>
            <FilmForm />
        </div>
    );
}
