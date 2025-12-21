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
        trailerUrl?: string | null;
        trailerAssetId?: string | null;
        trailerThumbnailUrl?: string | null;
        trailerDuration?: string | null;
        btsUrl?: string | null;
        btsAssetId?: string | null;
        btsThumbnailUrl?: string | null;
        btsDuration?: string | null;
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
    const [trailerFile, setTrailerFile] = useState<File | null>(null);
    const [trailerUploadProgress, setTrailerUploadProgress] = useState(0);
    const [isTrailerUploading, setIsTrailerUploading] = useState(false);

    // BTS State
    const [btsFile, setBtsFile] = useState<File | null>(null);
    const [btsUploadProgress, setBtsUploadProgress] = useState(0);
    const [isBtsUploading, setIsBtsUploading] = useState(false);

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
        trailerUrl: initialData?.trailerUrl || "",
        trailerAssetId: initialData?.trailerAssetId || "",
        trailerThumbnailUrl: initialData?.trailerThumbnailUrl || "",
        trailerDuration: initialData?.trailerDuration || "",
        btsUrl: initialData?.btsUrl || "",
        btsAssetId: initialData?.btsAssetId || "",
        btsThumbnailUrl: initialData?.btsThumbnailUrl || "",
        btsDuration: initialData?.btsDuration || "",
    });

    const formatDuration = (seconds: number) => {
        const date = new Date(seconds * 1000);
        const hh = date.getUTCHours();
        const mm = date.getUTCMinutes();
        const ss = date.getUTCSeconds().toString().padStart(2, "0");
        if (hh) {
            return `${hh}:${mm.toString().padStart(2, "0")}:${ss}`;
        }
        return `${mm}:${ss}`;
    };

    const handleUpload = async () => {
        if (!videoFile) return;

        try {
            setIsUploading(true);
            setUploadProgress(0);

            // 1. Get upload URL
            const response = await fetch("/api/mux/upload", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: formData.title || "Untitled Film" }),
            });

            if (!response.ok) {
                const err = await response.text();
                throw new Error(err || "Failed to get upload URL");
            }

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
            const maxAttempts = 60; // Increased to 60 seconds

            const pollStatus = async () => {
                try {
                    const statusRes = await fetch(`/api/mux/upload/${uploadId}`);
                    if (!statusRes.ok) throw new Error("Status check failed");
                    const data = await statusRes.json();

                    if (data.status === "completed" && data.playbackId) {
                        setFormData(prev => ({
                            ...prev,
                            videoUrl: data.playbackId,
                            thumbnailUrl: `https://image.mux.com/${data.playbackId}/thumbnail.png`,
                            duration: data.duration ? formatDuration(data.duration) : prev.duration
                        }));
                        alert("Video processed! Playback ID, Thumbnail, and Duration have been automatically filled.");
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
                } catch (e) {
                    console.error("Poll error", e);
                    // Don't stop polling on transient network error, but here we might want to stop if it persists?
                    // For now, continue polling
                    if (attempts < maxAttempts) {
                        attempts++;
                        setTimeout(pollStatus, 2000);
                    } else {
                        setIsUploading(false);
                    }
                }
            };

            pollStatus();

        } catch (error: any) {
            console.error("Upload error:", error);
            alert(`Failed to upload video: ${error.message}`);
            setIsUploading(false);
        }
    };

    const handleTrailerUpload = async () => {
        if (!trailerFile) return;

        try {
            setIsTrailerUploading(true);
            setTrailerUploadProgress(0);

            // 1. Get upload URL
            const response = await fetch("/api/mux/upload", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: `${formData.title || "Untitled"} - Trailer` }),
            });

            if (!response.ok) {
                const err = await response.text();
                throw new Error(err || "Failed to get upload URL");
            }

            const { url, id: uploadId } = await response.json();

            // 2. Upload file to Mux
            const xhr = new XMLHttpRequest();
            xhr.open("PUT", url);
            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percentComplete = (event.loaded / event.total) * 100;
                    setTrailerUploadProgress(Math.round(percentComplete));
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

            xhr.send(trailerFile);
            await uploadPromise;

            // 3. Poll for Playback ID
            setTrailerUploadProgress(100);
            let attempts = 0;
            const maxAttempts = 60; // 60 seconds

            const pollStatus = async () => {
                try {
                    const statusRes = await fetch(`/api/mux/upload/${uploadId}`);
                    if (!statusRes.ok) throw new Error("Status check failed");
                    const data = await statusRes.json();

                    if (data.status === "completed" && data.playbackId) {
                        if (!data.duration && attempts < maxAttempts) {
                            // Wait for duration
                        } else {
                            setFormData(prev => ({
                                ...prev,
                                trailerUrl: data.playbackId,
                                trailerAssetId: data.assetId,
                                trailerThumbnailUrl: `https://image.mux.com/${data.playbackId}/thumbnail.png`,
                                trailerDuration: data.duration ? formatDuration(data.duration) : prev.trailerDuration
                            }));
                            alert("Trailer processed! Details have been automatically filled.");
                            setIsTrailerUploading(false);
                            return;
                        }
                    }

                    if (attempts < maxAttempts) {
                        attempts++;
                        setTimeout(pollStatus, 2000);
                    } else {
                        alert("Processing is taking longer than expected. You can find the Playback ID in your Mux dashboard later.");
                        setIsTrailerUploading(false);
                    }
                } catch (e) {
                    console.error("Poll error", e);
                    if (attempts < maxAttempts) {
                        attempts++;
                        setTimeout(pollStatus, 2000);
                    } else {
                        setIsTrailerUploading(false);
                    }
                }
            };

            pollStatus();

        } catch (error: any) {
            console.error("Upload error:", error);
            alert(`Failed to upload trailer: ${error.message}`);
            setIsTrailerUploading(false);
        }
    };

    const handleBTSUpload = async () => {
        if (!btsFile) return;

        try {
            setIsBtsUploading(true);
            setBtsUploadProgress(0);

            // 1. Get upload URL
            const response = await fetch("/api/mux/upload", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: `${formData.title || "Untitled"} - BTS` }),
            });

            if (!response.ok) {
                const err = await response.text();
                throw new Error(err || "Failed to get upload URL");
            }

            const { url, id: uploadId } = await response.json();

            // 2. Upload file to Mux
            const xhr = new XMLHttpRequest();
            xhr.open("PUT", url);
            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percentComplete = (event.loaded / event.total) * 100;
                    setBtsUploadProgress(Math.round(percentComplete));
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

            xhr.send(btsFile);
            await uploadPromise;

            // 3. Poll for Playback ID
            setBtsUploadProgress(100);
            let attempts = 0;
            const maxAttempts = 60; // 60 seconds

            const pollStatus = async () => {
                try {
                    const statusRes = await fetch(`/api/mux/upload/${uploadId}`);
                    if (!statusRes.ok) throw new Error("Status check failed");
                    const data = await statusRes.json();

                    if (data.status === "completed" && data.playbackId) {
                        if (!data.duration && attempts < maxAttempts) {
                            // wait for duration
                        } else {
                            setFormData(prev => ({
                                ...prev,
                                btsUrl: data.playbackId,
                                btsAssetId: data.assetId,
                                btsThumbnailUrl: `https://image.mux.com/${data.playbackId}/thumbnail.png`,
                                btsDuration: data.duration ? formatDuration(data.duration) : prev.btsDuration
                            }));
                            alert("BTS Video processed! Details have been automatically filled.");
                            setIsBtsUploading(false);
                            return;
                        }
                    }

                    if (attempts < maxAttempts) {
                        attempts++;
                        setTimeout(pollStatus, 2000);
                    } else {
                        alert("Processing is taking longer than expected. You can find the Playback ID in your Mux dashboard later.");
                        setIsBtsUploading(false);
                    }
                } catch (e) {
                    console.error("Poll error", e);
                    if (attempts < maxAttempts) {
                        attempts++;
                        setTimeout(pollStatus, 2000);
                    } else {
                        setIsBtsUploading(false);
                    }
                }
            };

            pollStatus();

        } catch (error: any) {
            console.error("Upload error:", error);
            alert(`Failed to upload BTS video: ${error.message}`);
            setIsBtsUploading(false);
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
                    // Ensure these are included and not filtered out by any destructuring if present elsewhere
                    btsUrl: formData.btsUrl,
                    btsAssetId: formData.btsAssetId,
                    btsThumbnailUrl: formData.btsThumbnailUrl,
                    btsDuration: formData.btsDuration,
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

                {/* TRAILER SECTION */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-40">TRAILER FILE (OPTIONAL)</label>
                        <div className="flex flex-col gap-4">
                            <Input
                                type="file"
                                accept="video/*"
                                onChange={(e) => setTrailerFile(e.target.files?.[0] || null)}
                                className="bg-transparent border-white/20 rounded-none h-14 text-xs uppercase font-bold tracking-widest focus:border-white transition-colors cursor-pointer file:bg-white file:text-black file:border-none file:mr-4 file:px-4 file:h-full file:text-[10px] file:font-black file:uppercase file:tracking-widest"
                            />
                            {trailerFile && !isTrailerUploading && (
                                <button
                                    type="button"
                                    onClick={handleTrailerUpload}
                                    className="bg-zinc-800 text-white px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-700 transition-colors self-start"
                                >
                                    START TRAILER UPLOAD
                                </button>
                            )}
                            {isTrailerUploading && (
                                <div className="space-y-2">
                                    <div className="h-1 bg-white/10 w-full">
                                        <div
                                            className="h-full bg-white transition-all duration-300"
                                            style={{ width: `${trailerUploadProgress}%` }}
                                        />
                                    </div>
                                    <p className="text-[8px] font-black uppercase tracking-widest opacity-40">
                                        UPLOADING TRAILER... {trailerUploadProgress}%
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-40">TRAILER PLAYBACK ID</label>
                        <Input
                            value={formData.trailerUrl || ""}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, trailerUrl: e.target.value })}
                            placeholder="TRAILER PLAYBACK ID"
                            className="bg-transparent border-white/20 rounded-none h-14 text-xs uppercase font-bold tracking-widest focus:border-white transition-colors"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-40">TRAILER THUMBNAIL URL</label>
                        <Input
                            value={formData.trailerThumbnailUrl || ""}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, trailerThumbnailUrl: e.target.value })}
                            placeholder="TRAILER THUMBNAIL URL"
                            className="bg-transparent border-white/20 rounded-none h-14 text-xs uppercase font-bold tracking-widest focus:border-white transition-colors"
                        />
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-40">TRAILER DURATION</label>
                        <Input
                            value={formData.trailerDuration || ""}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, trailerDuration: e.target.value })}
                            placeholder="00:00"
                            className="bg-transparent border-white/20 rounded-none h-14 text-xs uppercase font-bold tracking-widest focus:border-white transition-colors"
                        />
                    </div>
                </div>

                {/* BTS SECTION */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-40">BTS FILE (OPTIONAL)</label>
                        <div className="flex flex-col gap-4">
                            <Input
                                type="file"
                                accept="video/*"
                                onChange={(e) => setBtsFile(e.target.files?.[0] || null)}
                                className="bg-transparent border-white/20 rounded-none h-14 text-xs uppercase font-bold tracking-widest focus:border-white transition-colors cursor-pointer file:bg-white file:text-black file:border-none file:mr-4 file:px-4 file:h-full file:text-[10px] file:font-black file:uppercase file:tracking-widest"
                            />
                            {btsFile && !isBtsUploading && (
                                <button
                                    type="button"
                                    onClick={handleBTSUpload}
                                    className="bg-zinc-800 text-white px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-700 transition-colors self-start"
                                >
                                    START BTS UPLOAD
                                </button>
                            )}
                            {isBtsUploading && (
                                <div className="space-y-2">
                                    <div className="h-1 bg-white/10 w-full">
                                        <div
                                            className="h-full bg-white transition-all duration-300"
                                            style={{ width: `${btsUploadProgress}%` }}
                                        />
                                    </div>
                                    <p className="text-[8px] font-black uppercase tracking-widest opacity-40">
                                        UPLOADING BTS... {btsUploadProgress}%
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-40">BTS PLAYBACK ID</label>
                        <Input
                            value={formData.btsUrl || ""}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, btsUrl: e.target.value })}
                            placeholder="BTS PLAYBACK ID"
                            className="bg-transparent border-white/20 rounded-none h-14 text-xs uppercase font-bold tracking-widest focus:border-white transition-colors"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-40">BTS THUMBNAIL URL</label>
                        <Input
                            value={formData.btsThumbnailUrl || ""}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, btsThumbnailUrl: e.target.value })}
                            placeholder="BTS THUMBNAIL URL"
                            className="bg-transparent border-white/20 rounded-none h-14 text-xs uppercase font-bold tracking-widest focus:border-white transition-colors"
                        />
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-40">BTS DURATION</label>
                        <Input
                            value={formData.btsDuration || ""}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, btsDuration: e.target.value })}
                            placeholder="00:00"
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
