"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "lucide-react";

interface CollectionFormProps {
    initialData?: {
        id: string;
        title: string;
        description?: string | null;
    };
}

export function CollectionForm({ initialData }: CollectionFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        description: initialData?.description || "",
    });

    const isEdit = !!initialData;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const url = isEdit ? `/api/collections/${initialData.id}` : "/api/collections";
            const method = isEdit ? "PATCH" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                router.push("/admin/collections");
                router.refresh();
            } else {
                console.error(`Failed to ${isEdit ? "update" : "create"} collection`);
            }
        } catch (error) {
            console.error(`Error ${isEdit ? "updating" : "creating"} collection:`, error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl">
            <div className="mb-20">
                <h2 className="text-xs font-black uppercase tracking-[0.3em] opacity-40">INPUT</h2>
                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mt-4">
                    {isEdit ? "EDIT COLLECTION" : "COLLECTION DETAILS"}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-16">
                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40">TITLE</label>
                    <Input
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="COLLECTION TITLE"
                        className="bg-transparent border-white/20 rounded-none h-14 text-xs uppercase font-bold tracking-widest focus:border-white transition-colors"
                    />
                </div>

                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40">DESCRIPTION</label>
                    <Textarea
                        value={formData.description}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="COLLECTION DESCRIPTION (OPTIONAL)"
                        className="bg-transparent border-white/20 rounded-none text-xs uppercase font-bold tracking-widest focus:border-white transition-colors min-h-[160px] resize-none"
                    />
                </div>

                <div className="flex gap-8 pt-12 border-t border-white/10">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-white text-black px-12 py-4 text-xs font-black uppercase tracking-widest hover:bg-zinc-200 transition-colors disabled:opacity-50"
                    >
                        {isLoading ? "SAVING..." : isEdit ? "UPDATE COLLECTION" : "CREATE COLLECTION"}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        disabled={isLoading}
                        className="border border-white/20 px-12 py-4 text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all disabled:opacity-50"
                    >
                        CANCEL
                    </button>
                </div>
            </form>
        </div>
    );
}
