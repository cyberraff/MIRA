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
        <Link href={`/films/${id}`}>
            <Card className="overflow-hidden border-none bg-zinc-900/50 transition-all hover:bg-zinc-900 hover:ring-1 hover:ring-primary/50 group cursor-pointer">
                <div className="relative aspect-video overflow-hidden">
                    <img
                        src={thumbnail}
                        alt={title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                    <div className="absolute bottom-2 right-2">
                        <Badge variant="secondary" className="bg-black/60 text-white border-none backdrop-blur-md">
                            {duration}
                        </Badge>
                    </div>
                </div>
                <CardContent className="p-4">
                    <div className="flex flex-col gap-1">
                        <span className="text-xs font-medium text-primary uppercase tracking-wider">{category}</span>
                        <h3 className="font-semibold text-zinc-100 line-clamp-1 group-hover:text-primary transition-colors">{title}</h3>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
