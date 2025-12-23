"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, Send } from "lucide-react";

interface CommentFormProps {
    filmId: string;
    parentId?: string;
    onSuccess: (comment: any) => void;
    onCancel?: () => void;
    placeholder?: string;
}

export function CommentForm({
    filmId,
    parentId,
    onSuccess,
    onCancel,
    placeholder = "SHARE YOUR THOUGHTS..."
}: CommentFormProps) {
    const { data: session } = useSession();
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const response = await fetch(`/api/films/${filmId}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content, parentId }),
            });

            if (response.ok) {
                const newComment = await response.json();
                onSuccess(newComment);
                setContent("");
                if (onCancel) onCancel();
            }
        } catch (error) {
            console.error("Failed to post comment:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!session) {
        return (
            <div className="p-8 border border-white/5 bg-white/[0.02] text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">
                    PLEASE SIGN IN TO JOIN THE DISCUSSION
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-4">
                <Avatar className="h-10 w-10 rounded-none border border-white/10">
                    <AvatarImage src={session.user?.image || ""} />
                    <AvatarFallback className="bg-zinc-900 text-[10px] font-black">{session.user?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 relative">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder={placeholder}
                        className="w-full bg-transparent border border-white/5 p-4 text-[11px] font-medium tracking-wide placeholder:text-white/10 focus:outline-none focus:border-white/20 transition-all min-h-[100px] resize-none"
                    />
                    <div className="absolute bottom-4 right-4 flex gap-2">
                        {onCancel && (
                            <button
                                type="button"
                                onClick={onCancel}
                                className="px-4 py-2 text-[8px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors"
                            >
                                CANCEL
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={!content.trim() || isSubmitting}
                            className="bg-white text-black px-6 py-2 text-[8px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isSubmitting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
                            POST
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}
