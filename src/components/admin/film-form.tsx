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

interface FilmFormProps {
    initialData?: {
        id: string;
        title: string;
        description: string;
        thumbnailUrl: string;
        videoUrl: string;
        duration: string;
        category: string;
        director?: string | null;
        year?: number | null;
        language?: string | null;
        tags: string[];
        visibility: string;
    };
}

import { useSearchParams } from "next/navigation";

export function FilmForm({ initialData }: FilmFormProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [videoFile, setVideoFile] = useState<File | null>(null);

    const isEdit = !!initialData;

    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        description: initialData?.description || "",
        thumbnailUrl: initialData?.thumbnailUrl || "",
        videoUrl: initialData?.videoUrl || searchParams.get("playbackId") || "",
        duration: initialData?.duration || "",
        category: initialData?.category || "Documentary",
        director: initialData?.director || "",
        year: initialData?.year?.toString() || new Date().getFullYear().toString(),
        language: initialData?.language || "English",
        tags: initialData?.tags.join(", ") || "",
        visibility: initialData?.visibility || "PUBLIC",
    });

    const handleUpload = async () => {
        if (!videoFile) return;

        try {
            setIsUploading(true);
            setUploadProgress(0);

            // 1. Get upload URL
            const response = await fetch("/api/mux/upload", { method: "POST" });
            const { url, id: uploadId } = await response.json();

            // 2. Upload file to Mux
            const xhr = new XMLHttpRequest();
            xhr.open("PUT", url);
            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percentComplete = (event.loaded / event.total) * 100;
                    setUploadProgress(Math.round(percentComplete));
                }
            };

            const uploadPromise = new Promise((resolve, reject) => {
                xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve(xhr.response);
                    } else {
                        reject(new Error("Upload failed"));
                    }
                };
                xhr.onerror = () => reject(new Error("Upload error"));
            });

            xhr.send(videoFile);
            await uploadPromise;

            // 3. Poll for Playback ID
            setUploadProgress(100);
            let attempts = 0;
            const maxAttempts = 30; // 30 seconds

            const pollStatus = async () => {
                const statusRes = await fetch(`/api/mux/upload/${uploadId}`);
                const data = await statusRes.json();

                if (data.status === "completed" && data.playbackId) {
                    setFormData(prev => ({
                        ...prev,
                        videoUrl: data.playbackId
                    }));
                    alert("Video processed! Playback ID has been automatically filled.");
                    setIsUploading(false);
                    return;
                }

                if (attempts < maxAttempts) {
                    attempts++;
                    setTimeout(pollStatus, 2000);
                } else {
                    alert("Processing is taking longer than expected. You can find the Playback ID in your Mux dashboard later.");
                    setIsUploading(false);
                }
            };

            pollStatus();

        } catch (error) {
            console.error("Upload error:", error);
            alert("Failed to upload video.");
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const url = isEdit ? `/api/films/${initialData.id}` : "/api/films";
            const method = isEdit ? "PATCH" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    year: parseInt(formData.year),
                    tags: formData.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
                }),
            });

            if (response.ok) {
                router.push("/admin/films");
                router.refresh();
            } else {
                console.error(`Failed to ${isEdit ? "update" : "create"} film`);
            }
        } catch (error) {
            console.error(`Error ${isEdit ? "updating" : "creating"} film:`, error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl">
            <div className="mb-20">
                <h2 className="text-xs font-black uppercase tracking-[0.3em] opacity-40">INPUT</h2>
                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mt-4">
                    {isEdit ? "EDIT FILM" : "FILM DETAILS"}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-40">TITLE</label>
                        <Input
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="FILM TITLE"
                            className="bg-transparent border-white/20 rounded-none h-14 text-xs uppercase font-bold tracking-widest focus:border-white transition-colors"
                        />
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-40">CATEGORY</label>
                        <Select
                            value={formData.category}
                            onValueChange={(value: string) => setFormData({ ...formData, category: value })}
                        >
                            <SelectTrigger className="bg-transparent border-white/20 rounded-none h-14 text-xs uppercase font-bold tracking-widest focus:border-white transition-colors">
                                <SelectValue placeholder="SELECT CATEGORY" />
                            </SelectTrigger>
                            <SelectContent className="bg-black border-white/20 rounded-none text-xs uppercase font-bold tracking-widest">
                                <SelectItem value="Documentary">Documentary</SelectItem>
                                <SelectItem value="Experimental">Experimental</SelectItem>
                                <SelectItem value="Culture">Culture</SelectItem>
                                <SelectItem value="Society">Society</SelectItem>
                                <SelectItem value="Short Film">Short Film</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40">DESCRIPTION</label>
                    <Textarea
                        required
                        value={formData.description}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="FILM DESCRIPTION"
                        className="bg-transparent border-white/20 rounded-none text-xs uppercase font-bold tracking-widest focus:border-white transition-colors min-h-[160px] resize-none"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-40">VIDEO FILE</label>
                        <div className="flex flex-col gap-4">
                            <Input
                                type="file"
                                accept="video/*"
                                onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                                className="bg-transparent border-white/20 rounded-none h-14 text-xs uppercase font-bold tracking-widest focus:border-white transition-colors cursor-pointer file:bg-white file:text-black file:border-none file:mr-4 file:px-4 file:h-full file:text-[10px] file:font-black file:uppercase file:tracking-widest"
                            />
                            {videoFile && !isUploading && (
                                <button
                                    type="button"
                                    onClick={handleUpload}
                                    className="bg-zinc-800 text-white px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-700 transition-colors self-start"
                                >
                                    START UPLOAD
                                </button>
                            )}
                            {isUploading && (
                                <div className="space-y-2">
                                    <div className="h-1 bg-white/10 w-full">
                                        <div
                                            className="h-full bg-white transition-all duration-300"
                                            style={{ width: `${uploadProgress}%` }}
                                        />
                                    </div>
                                    <p className="text-[8px] font-black uppercase tracking-widest opacity-40">
                                        UPLOADING... {uploadProgress}%
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-40">MUX PLAYBACK ID</label>
                        <Input
                            required
                            value={formData.videoUrl}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, videoUrl: e.target.value })}
                            placeholder="PLAYBACK ID"
                            className="bg-transparent border-white/20 rounded-none h-14 text-xs uppercase font-bold tracking-widest focus:border-white transition-colors"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40">THUMBNAIL URL</label>
                    <Input
                        required
                        value={formData.thumbnailUrl}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                        placeholder="IMAGE URL"
                        className="bg-transparent border-white/20 rounded-none h-14 text-xs uppercase font-bold tracking-widest focus:border-white transition-colors"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-40">DURATION</label>
                        <Input
                            required
                            value={formData.duration}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, duration: e.target.value })}
                            placeholder="00:00"
                            className="bg-transparent border-white/20 rounded-none h-14 text-xs uppercase font-bold tracking-widest focus:border-white transition-colors"
                        />
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-40">DIRECTOR</label>
                        <Input
                            value={formData.director}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, director: e.target.value })}
                            placeholder="NAME"
                            className="bg-transparent border-white/20 rounded-none h-14 text-xs uppercase font-bold tracking-widest focus:border-white transition-colors"
                        />
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-40">YEAR</label>
                        <Input
                            type="number"
                            value={formData.year}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, year: e.target.value })}
                            className="bg-transparent border-white/20 rounded-none h-14 text-xs uppercase font-bold tracking-widest focus:border-white transition-colors"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-40">TAGS</label>
                        <Input
                            value={formData.tags}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, tags: e.target.value })}
                            placeholder="TAG1, TAG2, TAG3"
                            className="bg-transparent border-white/20 rounded-none h-14 text-xs uppercase font-bold tracking-widest focus:border-white transition-colors"
                        />
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-40">VISIBILITY</label>
                        <Select
                            value={formData.visibility}
                            onValueChange={(value: string) => setFormData({ ...formData, visibility: value })}
                        >
                            <SelectTrigger className="bg-transparent border-white/20 rounded-none h-14 text-xs uppercase font-bold tracking-widest focus:border-white transition-colors">
                                <SelectValue placeholder="SELECT VISIBILITY" />
                            </SelectTrigger>
                            <SelectContent className="bg-black border-white/20 rounded-none text-xs uppercase font-bold tracking-widest">
                                <SelectItem value="PUBLIC">PUBLIC</SelectItem>
                                <SelectItem value="PRIVATE">PRIVATE</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex gap-8 pt-12 border-t border-white/10">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-white text-black px-12 py-4 text-xs font-black uppercase tracking-widest hover:bg-zinc-200 transition-colors disabled:opacity-50"
                    >
                        {isLoading ? "SAVING..." : isEdit ? "UPDATE FILM" : "CREATE FILM"}
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
