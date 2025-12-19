import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const film = await prisma.film.findUnique({
            where: {
                id,
            },
        });

        if (!film) {
            return new NextResponse("Not Found", { status: 404 });
        }

        return NextResponse.json(film);
    } catch (error) {
        console.error("[FILM_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
