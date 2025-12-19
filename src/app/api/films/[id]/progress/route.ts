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
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const progress = await prisma.watchProgress.findUnique({
            where: {
                userId_filmId: {
                    userId: session.user.id,
                    filmId: id,
                },
            },
        });

        return NextResponse.json(progress || { lastTimestamp: 0, completed: false });
    } catch (error) {
        console.error("[PROGRESS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

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

        const body = await req.json();
        const { lastTimestamp, completed } = body;

        const progress = await prisma.watchProgress.upsert({
            where: {
                userId_filmId: {
                    userId: session.user.id,
                    filmId: id,
                },
            },
            update: {
                lastTimestamp,
                completed,
            },
            create: {
                userId: session.user.id,
                filmId: id,
                lastTimestamp,
                completed,
            },
        });

        return NextResponse.json(progress);
    } catch (error) {
        console.error("[PROGRESS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
