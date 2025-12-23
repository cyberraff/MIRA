import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const reports = await prisma.report.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
                comment: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                image: true,
                            },
                        },
                        film: {
                            select: {
                                id: true,
                                title: true,
                            }
                        }
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(reports);
    } catch (error) {
        console.error("[ADMIN_REPORTS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
