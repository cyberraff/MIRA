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

        const body = await req.json();
        const { reason } = body;

        if (!reason) {
            return new NextResponse("Reason is required", { status: 400 });
        }

        const report = await prisma.report.create({
            data: {
                commentId,
                userId: (session.user as any).id,
                reason,
            },
        });

        return NextResponse.json(report);
    } catch (error) {
        console.error("[COMMENT_REPORT_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
