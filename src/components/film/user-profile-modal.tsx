"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, Calendar, MessageSquare, Heart, Shield } from "lucide-react";

interface UserProfile {
    id: string;
    name: string;
    image: string;
    role: string;
    _count: {
        comments: number;
        commentLikes: number;
    };
}

interface UserProfileModalProps {
    userId: string;
    isOpen: boolean;
    onClose: () => void;
}

export function UserProfileModal({ userId, isOpen, onClose }: UserProfileModalProps) {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isOpen && userId) {
            setIsLoading(true);
            fetch(`/api/users/${userId}`)
                .then(res => res.json())
                .then(data => {
                    setUser(data);
                    setIsLoading(false);
                })
                .catch(err => {
                    console.error("Failed to fetch user:", err);
                    setIsLoading(false);
                });
        }
    }, [isOpen, userId]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md bg-black border border-white/10 text-white rounded-none p-0 overflow-hidden">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="h-8 w-8 animate-spin text-white/20" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/20">FETCHING PROFILE...</p>
                    </div>
                ) : user ? (
                    <div>
                        <div className="h-32 bg-zinc-900 border-b border-white/5 relative">
                            <div className="absolute -bottom-10 left-8 p-1 bg-black border border-white/10">
                                <Avatar className="h-24 w-24 rounded-none">
                                    <AvatarImage src={user.image} />
                                    <AvatarFallback className="bg-zinc-800 text-xl font-black">{user.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                            </div>
                        </div>

                        <div className="pt-16 pb-12 px-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-black uppercase tracking-wider">{user.name}</h2>
                                    <div className="flex items-center gap-2 mt-1">
                                        {user.role === "ADMIN" && (
                                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white text-black text-[8px] font-black uppercase tracking-widest">
                                                <Shield className="h-2.5 w-2.5" />
                                                ADMINISTRATOR
                                            </div>
                                        )}
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">USER ID: {user.id.substring(0, 8)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-10">
                                <div className="p-4 border border-white/5 bg-white/[0.02]">
                                    <div className="flex items-center gap-2 mb-2">
                                        <MessageSquare className="h-3 w-3 text-white/20" />
                                        <span className="text-[8px] font-black uppercase tracking-widest text-white/40">CONTRIBUTIONS</span>
                                    </div>
                                    <p className="text-xl font-black">{user._count.comments}</p>
                                    <p className="text-[8px] font-bold uppercase tracking-widest text-white/20 mt-1">TOTAL COMMENTS</p>
                                </div>
                                <div className="p-4 border border-white/5 bg-white/[0.02]">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Heart className="h-3 w-3 text-white/20" />
                                        <span className="text-[8px] font-black uppercase tracking-widest text-white/40">REACTIONS</span>
                                    </div>
                                    <p className="text-xl font-black">{user._count.commentLikes}</p>
                                    <p className="text-[8px] font-bold uppercase tracking-widest text-white/20 mt-1">LIKES RECEIVED</p>
                                </div>
                            </div>

                            <div className="mt-10 flex items-center gap-2 text-white/20">
                                <Calendar className="h-3 w-3" />
                                <span className="text-[8px] font-black uppercase tracking-widest">JOINED DECEMBER 2025</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-20 text-center">
                        <p className="text-[10px] font-black tracking-widest opacity-40">FAILED TO LOAD PROFILE</p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
