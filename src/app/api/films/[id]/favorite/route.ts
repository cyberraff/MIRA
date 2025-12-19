import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const existingFavorite = await prisma.favorite.findUnique({
            where: {
                userId_filmId: {
                    userId: session.user.id,
                    filmId: id,
                },
            },
        });

        if (existingFavorite) {
            await prisma.favorite.delete({
                where: {
                    id: existingFavorite.id,
                },
            });
            return NextResponse.json({ favorited: false });
        } else {
            await prisma.favorite.create({
                data: {
                    userId: session.user.id,
                    filmId: id,
                },
            });
            return NextResponse.json({ favorited: true });
        }
    } catch (error) {
        console.error("[FAVORITE_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ favorited: false });
        }

        const favorite = await prisma.favorite.findUnique({
            where: {
                userId_filmId: {
                    userId: session.user.id,
                    filmId: id,
                },
            },
        });

        return NextResponse.json({ favorited: !!favorite });
    } catch (error) {
        console.error("[FAVORITE_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
