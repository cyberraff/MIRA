import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
    try {
        const collections = await prisma.collection.findMany({
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
            orderBy: {
                createdAt: "desc",
            },
        });
        return NextResponse.json(collections);
    } catch (error) {
        console.error("[COLLECTIONS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { title, description } = body;

        const collection = await prisma.collection.create({
            data: {
                title,
                description,
            },
        });

        return NextResponse.json(collection);
    } catch (error) {
        console.error("[COLLECTIONS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
