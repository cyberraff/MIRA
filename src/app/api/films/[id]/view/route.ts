import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        await prisma.film.update({
            where: { id },
            data: {
                views: {
                    increment: 1
                }
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[FILM_VIEW_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
