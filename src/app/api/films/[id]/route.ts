import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

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

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const {
            title,
            description,
            thumbnailUrl,
            videoUrl,
            duration,
            category,
            director,
            year,
            language,
            tags,
            visibility,
            trailerUrl,
            trailerAssetId,
            trailerThumbnailUrl,
            trailerDuration,
            btsUrl,
            btsAssetId,
            btsThumbnailUrl,
            btsDuration,
        } = body;

        const film = await prisma.film.update({
            where: { id },
            data: {
                title,
                description,
                thumbnailUrl,
                videoUrl,
                duration,
                category,
                director,
                year,
                language,
                tags,
                visibility,
                trailerUrl,
                trailerAssetId,
                trailerThumbnailUrl,
                trailerDuration,
                btsUrl,
                btsAssetId,
                btsThumbnailUrl,
                btsDuration,
            },
        });

        return NextResponse.json(film);
    } catch (error) {
        console.error("[FILM_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        await prisma.film.delete({
            where: { id },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("[FILM_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
