"use client";

import { MuxLibrary } from "@/components/admin/mux-library";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function AdminFilmsActions() {
    const router = useRouter();

    return (
        <div className="flex gap-4">
            <MuxLibrary onImport={(asset) => {
                router.push(`/admin/films/new?assetId=${asset.id}&playbackId=${asset.playbackId}`);
            }} />
            <button className="bg-white text-black px-8 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-colors">
                <Link href="/admin/films/new">ADD NEW FILM</Link>
            </button>
        </div>
    );
}
