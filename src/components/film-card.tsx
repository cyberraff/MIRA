import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface FilmCardProps {
    id: string;
    title: string;
    duration: string;
    category: string;
    thumbnail: string;
}

export function FilmCard({ id, title, duration, category, thumbnail }: FilmCardProps) {
    return (
        <Link href={`/films/${id}`} className="group block">
            <div className="relative aspect-video overflow-hidden bg-zinc-900">
                <img
                    src={thumbnail}
                    alt={title}
                    className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                />
            </div>
            <div className="mt-3 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-black uppercase tracking-widest">{title}</h3>
                    <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">{duration}</span>
                </div>
                <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">{category}</span>
            </div>
        </Link>
    );
}
