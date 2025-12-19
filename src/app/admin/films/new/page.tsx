import { FilmForm } from "@/components/film-form";

export default function NewFilmPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Add New Film</h1>
                <p className="text-muted-foreground mt-2">Enter the metadata and video details for the new film.</p>
            </div>

            <FilmForm />
        </div>
    );
}
