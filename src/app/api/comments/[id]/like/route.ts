import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: commentId } = await params;
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const userId = (session.user as any).id;

        // Check if already liked
        const existingLike = await prisma.commentLike.findUnique({
            where: {
                userId_commentId: {
                    userId,
                    commentId,
                },
            },
        });

        if (existingLike) {
            // Unlike
            await prisma.commentLike.delete({
                where: {
                    id: existingLike.id,
                },
            });
            return NextResponse.json({ liked: false });
        } else {
            // Like
            await prisma.commentLike.create({
                data: {
                    userId,
                    commentId,
                },
            });
            return NextResponse.json({ liked: true });
        }
    } catch (error) {
        console.error("[COMMENT_LIKE_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
