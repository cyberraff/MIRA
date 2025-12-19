import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get("q");

        if (!query) {
            return new NextResponse("Query parameter 'q' is required", { status: 400 });
        }

        const films = await prisma.film.findMany({
            where: {
                OR: [
                    { title: { contains: query, mode: "insensitive" } },
                    { description: { contains: query, mode: "insensitive" } },
                    { category: { contains: query, mode: "insensitive" } },
                    { tags: { has: query } },
                ],
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(films);
    } catch (error) {
        console.error("[SEARCH_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
