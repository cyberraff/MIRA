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
        const collection = await prisma.collection.findUnique({
            where: { id },
            include: {
                films: {
                    include: {
                        film: true,
                    },
                    orderBy: {
                        order: "asc",
                    },
                },
            },
        });

        if (!collection) {
            return new NextResponse("Not Found", { status: 404 });
        }

        return NextResponse.json(collection);
    } catch (error) {
        console.error("[COLLECTION_GET]", error);
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
        const { title, description } = body;

        const collection = await prisma.collection.update({
            where: { id },
            data: {
                title,
                description,
            },
        });

        return NextResponse.json(collection);
    } catch (error) {
        console.error("[COLLECTION_PATCH]", error);
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

        if (!session || session.user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { filmId, order } = body;

        const collectionFilm = await prisma.collectionFilm.create({
            data: {
                collectionId: id,
                filmId,
                order: order || 0,
            },
        });

        return NextResponse.json(collectionFilm);
    } catch (error) {
        console.error("[COLLECTION_FILM_POST]", error);
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

        await prisma.collection.delete({
            where: { id },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("[COLLECTION_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
