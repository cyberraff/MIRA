"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CommentForm } from "./comment-form";
import { UserProfileModal } from "./user-profile-modal";
import {
    Heart,
    Reply,
    MoreHorizontal,
    Trash2,
    Flag,
    ChevronDown,
    ChevronUp
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

interface CommentItemProps {
    comment: Comment;
    filmId: string;
    onUpdate: () => void;
    depth: number;
}

function formatRelativeTime(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return "JUST NOW";
    if (diff < 3600) return `${Math.floor(diff / 60)}M AGO`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}H AGO`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)}D AGO`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase();
}

export function CommentItem({ comment, filmId, onUpdate, depth }: CommentItemProps) {
    const { data: session } = useSession();
    const [isReplyFormOpen, setIsReplyFormOpen] = useState(false);
    const [isRepliesVisible, setIsRepliesVisible] = useState(depth < 1); // Auto-show first level of replies
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isLiking, setIsLiking] = useState(false);

    const isLiked = comment.likes?.some(l => l.userId === (session?.user as any)?.id) || false;
    const isAdmin = session?.user?.role === "ADMIN";
    const isOwner = comment.userId === (session?.user as any)?.id;

    const handleLike = async () => {
        if (!session || isLiking) return;
        setIsLiking(true);
        try {
            await fetch(`/api/comments/${comment.id}/like`, { method: "POST" });
            onUpdate();
        } catch (error) {
            console.error("Failed to like:", error);
        } finally {
            setIsLiking(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("ARE YOU SURE YOU WANT TO REMOVE THIS COMMENT?")) return;
        try {
            const res = await fetch(`/api/comments/${comment.id}`, { method: "DELETE" });
            if (res.ok) onUpdate();
        } catch (error) {
            console.error("Failed to delete:", error);
        }
    };

    const handleReport = async () => {
        const reason = prompt("WHY ARE YOU REPORTING THIS COMMENT (e.g., SPAM, HARASSMENT)?");
        if (!reason) return;
        try {
            const res = await fetch(`/api/comments/${comment.id}/report`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reason })
            });
            if (res.ok) alert("REPORT SUBMITTED. OUR MODERATORS WILL REVIEW IT.");
        } catch (error) {
            console.error("Failed to report:", error);
        }
    };

    return (
        <div className={`group ${depth > 0 ? 'mt-6 ml-12 border-l border-white/5 pl-6' : 'py-8 border-b border-white/5'}`}>
            <div className="flex gap-4">
                <button
                    onClick={() => setIsProfileModalOpen(true)}
                    className="h-10 w-10 shrink-0 border border-white/10 overflow-hidden hover:border-white/30 transition-colors"
                >
                    <Avatar className="h-full w-full rounded-none">
                        <AvatarImage src={comment.user.image} />
                        <AvatarFallback className="bg-zinc-900 text-[10px] font-black">{comment.user.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                </button>

                <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsProfileModalOpen(true)}
                                className="text-[10px] font-black uppercase tracking-widest hover:text-white/60 transition-colors"
                            >
                                {comment.user.name}
                            </button>
                            <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">
                                {formatRelativeTime(comment.createdAt)}
                            </span>
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-white/5">
                                <MoreHorizontal className="h-3 w-3 text-white/40" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-black border-white/10 rounded-none text-white min-w-[140px]">
                                {(isOwner || isAdmin) && (
                                    <DropdownMenuItem onClick={handleDelete} className="text-[8px] font-black tracking-widest uppercase text-red-500 focus:bg-red-500/10 focus:text-red-500 cursor-pointer p-3">
                                        <Trash2 className="h-3 w-3 mr-2" />
                                        DELETE COMMENT
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={handleReport} className="text-[8px] font-black tracking-widest uppercase focus:bg-white/10 focus:text-white cursor-pointer p-3">
                                    <Flag className="h-3 w-3 mr-2 text-white/40" />
                                    REPORT COMMENT
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <p className="text-[11px] font-medium leading-relaxed text-white/80 line-clamp-6 tracking-wide mb-6">
                        {comment.content}
                    </p>

                    <div className="flex items-center gap-6">
                        <button
                            onClick={handleLike}
                            className={`flex items-center gap-2 group/like ${isLiked ? 'text-white' : 'text-white/20'} hover:text-white transition-colors`}
                        >
                            <Heart className={`h-3 w-3 ${isLiked ? 'fill-white text-white' : ''} group-hover/like:scale-110 transition-transform`} />
                            <span className="text-[8px] font-black uppercase tracking-widest">{comment.likes?.length || 0}</span>
                        </button>

                        <button
                            onClick={() => setIsReplyFormOpen(!isReplyFormOpen)}
                            className="flex items-center gap-2 text-white/20 hover:text-white transition-colors"
                        >
                            <Reply className="h-3 w-3" />
                            <span className="text-[8px] font-black uppercase tracking-widest">REPLY</span>
                        </button>
                    </div>

                    {isReplyFormOpen && (
                        <div className="mt-6 border-l-2 border-white/10 pl-6 animate-in slide-in-from-left-2 duration-300">
                            <CommentForm
                                filmId={filmId}
                                parentId={comment.id}
                                placeholder={`REPLYING TO ${comment.user.name.toUpperCase()}...`}
                                onSuccess={() => {
                                    setIsReplyFormOpen(false);
                                    setIsRepliesVisible(true);
                                    onUpdate();
                                }}
                                onCancel={() => setIsReplyFormOpen(false)}
                            />
                        </div>
                    )}

                    {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-4">
                            {!isRepliesVisible ? (
                                <button
                                    onClick={() => setIsRepliesVisible(true)}
                                    className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.2em] text-white/30 hover:text-white/60 transition-all py-2"
                                >
                                    <ChevronDown className="h-3 w-3" />
                                    SHOW {comment.replies.length} REPLIES
                                </button>
                            ) : (
                                <>
                                    <div className="space-y-1">
                                        {comment.replies.map(reply => (
                                            <CommentItem
                                                key={reply.id}
                                                comment={reply}
                                                filmId={filmId}
                                                onUpdate={onUpdate}
                                                depth={depth + 1}
                                            />
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => setIsRepliesVisible(false)}
                                        className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.2em] text-white/30 hover:text-white/60 transition-all py-4 mt-2"
                                    >
                                        <ChevronUp className="h-3 w-3" />
                                        HIDE REPLIES
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <UserProfileModal
                userId={comment.userId}
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
            />
        </div>
    );
}
