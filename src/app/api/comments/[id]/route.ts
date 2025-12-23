import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: commentId } = await params;
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const comment = await prisma.comment.findUnique({
            where: { id: commentId },
        });

        if (!comment) {
            return new NextResponse("Not Found", { status: 404 });
        }

        // Only owner or admin can delete
        const isOwner = comment.userId === (session.user as any).id;
        const isAdmin = session.user.role === "ADMIN";

        if (!isOwner && !isAdmin) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        await prisma.comment.delete({
            where: { id: commentId },
        });

        return new NextResponse("Deleted", { status: 200 });
    } catch (error) {
        console.error("[COMMENT_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
