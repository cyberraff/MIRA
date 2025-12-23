"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { CommentForm } from "./comment-form";
import { CommentItem } from "./comment-item";
import { Loader2, MessageSquare } from "lucide-react";

interface Comment {
    id: string;
    content: string;
    createdAt: string;
    userId: string;
    parentId: string | null;
    user: {
        id: string;
        name: string;
        image: string;
    };
    likes: { id: string; userId: string }[];
    replies: Comment[];
}

interface CommentSectionProps {
    filmId: string;
}

export function CommentSection({ filmId }: CommentSectionProps) {
    const { data: session } = useSession();
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchComments = async () => {
        try {
            const response = await fetch(`/api/films/${filmId}/comments`);
            const data = await response.json();
            setComments(data);
        } catch (error) {
            console.error("Failed to fetch comments:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [filmId]);

    const handleCommentAdded = (newComment: Comment) => {
        if (newComment.parentId) {
            // It's a reply, update the parent's replies list
            setComments(prev => prev.map(c => {
                if (c.id === newComment.parentId) {
                    return { ...c, replies: [{ ...newComment, likes: newComment.likes || [], replies: newComment.replies || [] }, ...(c.replies || [])] };
                }
                return c;
            }));
        } else {
            // It's a top-level comment
            setComments(prev => [{ ...newComment, likes: newComment.likes || [], replies: newComment.replies || [] }, ...prev]);
        }
    };

    return (
        <div className="mt-16 max-w-4xl mx-auto px-4 pb-20">
            <div className="flex items-center gap-4 mb-10">
                <div className="h-px flex-1 bg-white/5" />
                <div className="flex items-center gap-3">
                    <MessageSquare className="h-4 w-4 text-white/40" />
                    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">
                        COMMUNITY DISCUSSIONS
                    </h2>
                </div>
                <div className="h-px flex-1 bg-white/5" />
            </div>

            <div className="mb-12">
                <CommentForm filmId={filmId} onSuccess={handleCommentAdded} />
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="h-6 w-6 animate-spin text-white/20" />
                </div>
            ) : (
                <div className="space-y-1">
                    {comments.length === 0 ? (
                        <div className="text-center py-20 border border-white/5 bg-white/2">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-white/20">
                                BE THE FIRST TO START THE CONVERSATION
                            </p>
                        </div>
                    ) : (
                        comments.map(comment => (
                            <CommentItem
                                key={comment.id}
                                comment={comment}
                                filmId={filmId}
                                onUpdate={fetchComments}
                                depth={0}
                            />
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
