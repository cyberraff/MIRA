"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface FavoriteButtonProps {
    filmId: string;
}

export function FavoriteButton({ filmId }: FavoriteButtonProps) {
    const [isFavorited, setIsFavorited] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const checkFavorite = async () => {
            try {
                const response = await fetch(`/api/films/${filmId}/favorite`);
                const data = await response.json();
                setIsFavorited(data.favorited);
            } catch (error) {
                console.error("Failed to check favorite status", error);
            }
        };
        checkFavorite();
    }, [filmId]);

    const toggleFavorite = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/films/${filmId}/favorite`, {
                method: "POST",
            });
            const data = await response.json();
            setIsFavorited(data.favorited);
        } catch (error) {
            console.error("Failed to toggle favorite", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            variant={isFavorited ? "default" : "outline"}
            size="sm"
            onClick={toggleFavorite}
            disabled={isLoading}
            className="gap-2"
        >
            <Heart className={isFavorited ? "fill-current" : ""} size={16} />
            {isFavorited ? "Saved" : "Save"}
        </Button>
    );
}
