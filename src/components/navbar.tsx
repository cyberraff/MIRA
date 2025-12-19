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
        <nav className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-black/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
                <div className="flex items-center gap-8">
                    <Link href="/" className="text-2xl font-bold tracking-tighter text-primary">
                        MIRA
                    </Link>
                    <div className="hidden md:flex items-center gap-6">
                        <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
                            Home
                        </Link>
                        <Link href="/browse" className="text-sm font-medium transition-colors hover:text-primary">
                            Browse
                        </Link>
                        <Link href="/collections" className="text-sm font-medium transition-colors hover:text-primary">
                            Collections
                        </Link>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <form onSubmit={handleSearch} className="relative hidden sm:block">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search films..."
                            className="w-[200px] lg:w-[300px] bg-zinc-900 border-zinc-800 pl-9 focus:ring-primary"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>

                    {session ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                                        <AvatarFallback>{session.user?.name?.[0] || "U"}</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56 bg-zinc-900 border-zinc-800 text-zinc-100" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{session.user?.name}</p>
                                        <p className="text-xs leading-none text-muted-foreground">{session.user?.email}</p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-zinc-800" />
                                <DropdownMenuItem asChild>
                                    <Link href="/profile">Profile</Link>
                                </DropdownMenuItem>
                                {session.user?.role === "ADMIN" && (
                                    <DropdownMenuItem asChild>
                                        <Link href="/admin">Admin Dashboard</Link>
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator className="bg-zinc-800" />
                                <DropdownMenuItem onClick={() => signOut()}>
                                    Sign out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => signIn()}>
                                Sign In
                            </Button>
                            <Button size="sm" onClick={() => signIn()}>
                                Get Started
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
