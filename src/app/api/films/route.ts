import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const films = await prisma.film.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
        return NextResponse.json(films);
    } catch (error) {
        console.error("[FILMS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, description, thumbnailUrl, videoUrl, duration, category, tags, director, year, language } = body;

        const film = await prisma.film.create({
            data: {
                title,
                description,
                thumbnailUrl,
                videoUrl,
                duration,
                category,
                tags,
                director,
                year,
                language,
            },
        });

        return NextResponse.json(film);
    } catch (error) {
        console.error("[FILMS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
