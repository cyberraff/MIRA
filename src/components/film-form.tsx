"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function FilmForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        thumbnailUrl: "",
        videoUrl: "", // Mux Playback ID
        duration: "",
        category: "Documentary",
        director: "",
        year: new Date().getFullYear().toString(),
        language: "English",
        tags: "",
        visibility: "PUBLIC",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch("/api/films", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    year: parseInt(formData.year),
                    tags: formData.tags.split(",").map((tag) => tag.trim()),
                }),
            });

            if (response.ok) {
                router.push("/admin/films");
                router.refresh();
            } else {
                console.error("Failed to create film");
            }
        } catch (error) {
            console.error("Error creating film:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
                <CardTitle>Film Details</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Title</label>
                            <Input
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Enter film title"
                                className="bg-zinc-800 border-zinc-700"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Category</label>
                            <Select
                                value={formData.category}
                                onValueChange={(value: string) => setFormData({ ...formData, category: value })}
                            >
                                <SelectTrigger className="bg-zinc-800 border-zinc-700">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-800 border-zinc-700">
                                    <SelectItem value="Documentary">Documentary</SelectItem>
                                    <SelectItem value="Experimental">Experimental</SelectItem>
                                    <SelectItem value="Culture">Culture</SelectItem>
                                    <SelectItem value="Society">Society</SelectItem>
                                    <SelectItem value="Short Film">Short Film</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <Textarea
                            required
                            value={formData.description}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Enter film description"
                            className="bg-zinc-800 border-zinc-700 min-h-[100px]"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Mux Playback ID</label>
                            <Input
                                required
                                value={formData.videoUrl}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, videoUrl: e.target.value })}
                                placeholder="Enter Mux playback ID"
                                className="bg-zinc-800 border-zinc-700"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Thumbnail URL</label>
                            <Input
                                required
                                value={formData.thumbnailUrl}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                                placeholder="Enter thumbnail image URL"
                                className="bg-zinc-800 border-zinc-700"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Duration (e.g., 12:45)</label>
                            <Input
                                required
                                value={formData.duration}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, duration: e.target.value })}
                                placeholder="00:00"
                                className="bg-zinc-800 border-zinc-700"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Director</label>
                            <Input
                                value={formData.director}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, director: e.target.value })}
                                placeholder="Director name"
                                className="bg-zinc-800 border-zinc-700"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Year</label>
                            <Input
                                type="number"
                                value={formData.year}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, year: e.target.value })}
                                className="bg-zinc-800 border-zinc-700"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Tags (comma separated)</label>
                            <Input
                                value={formData.tags}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, tags: e.target.value })}
                                placeholder="tag1, tag2, tag3"
                                className="bg-zinc-800 border-zinc-700"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Visibility</label>
                            <Select
                                value={formData.visibility}
                                onValueChange={(value: string) => setFormData({ ...formData, visibility: value })}
                            >
                                <SelectTrigger className="bg-zinc-800 border-zinc-700">
                                    <SelectValue placeholder="Select visibility" />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-800 border-zinc-700">
                                    <SelectItem value="PUBLIC">Public</SelectItem>
                                    <SelectItem value="PRIVATE">Private</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => router.back()}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Saving..." : "Create Film"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
