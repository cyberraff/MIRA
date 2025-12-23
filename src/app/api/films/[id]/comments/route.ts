import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: filmId } = await params;

        const comments = await prisma.comment.findMany({
            where: {
                filmId: filmId,
                parentId: null, // Get top-level comments first
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
                likes: true,
                replies: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                            },
                        },
                        likes: true,
                    }
                }
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(comments);
    } catch (error) {
        console.error("[COMMENTS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: filmId } = await params;
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { content, parentId } = body;

        if (!content) {
            return new NextResponse("Content is required", { status: 400 });
        }

        const comment = await prisma.comment.create({
            data: {
                content,
                filmId,
                userId: (session.user as any).id,
                parentId: parentId || null,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
                likes: true,
                replies: true,
            },
        });

        return NextResponse.json(comment);
    } catch (error) {
        console.error("[COMMENTS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
