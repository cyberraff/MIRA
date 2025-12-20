"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search } from "lucide-react"; // Assuming Search icon is from lucide-react

export function Navbar() {
    const { data: session } = useSession();
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <nav className="fixed top-0 z-50 w-full bg-transparent p-6 md:p-10">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-12">
                    <Link href="/" className="text-3xl font-black tracking-tighter uppercase">
                        MIRA
                    </Link>
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/" className="text-xs font-bold uppercase tracking-widest hover:opacity-50 transition-opacity">
                            Home
                        </Link>
                        <Link href="/browse" className="text-xs font-bold uppercase tracking-widest hover:opacity-50 transition-opacity">
                            Browse
                        </Link>
                        <Link href="/collections" className="text-xs font-bold uppercase tracking-widest hover:opacity-50 transition-opacity">
                            Collections
                        </Link>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <form onSubmit={handleSearch} className="relative hidden sm:block">
                        <Input
                            type="search"
                            placeholder="SEARCH"
                            className="h-auto border-none bg-transparent p-0 text-xs font-bold uppercase tracking-widest placeholder:text-zinc-500 focus-visible:ring-0 focus-visible:ring-offset-0 w-[120px] lg:w-[200px]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>

                    {session ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="text-xs font-bold uppercase tracking-widest hover:opacity-50 transition-opacity">
                                    {session.user?.name || "ACCOUNT"}
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-black border border-white/10 rounded-none min-w-[200px]" align="end">
                                <DropdownMenuItem asChild className="focus:bg-white focus:text-black rounded-none cursor-pointer uppercase text-xs font-bold tracking-widest p-3">
                                    <Link href="/profile">Profile</Link>
                                </DropdownMenuItem>
                                {session.user?.role === "ADMIN" && (
                                    <DropdownMenuItem asChild className="focus:bg-white focus:text-black rounded-none cursor-pointer uppercase text-xs font-bold tracking-widest p-3">
                                        <Link href="/admin">Admin</Link>
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator className="bg-white/10" />
                                <DropdownMenuItem onClick={() => signOut()} className="focus:bg-white focus:text-black rounded-none cursor-pointer uppercase text-xs font-bold tracking-widest p-3">
                                    Sign out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="flex items-center gap-6">
                            <button className="text-xs font-bold uppercase tracking-widest hover:opacity-50 transition-opacity" onClick={() => signIn()}>
                                Sign In
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
