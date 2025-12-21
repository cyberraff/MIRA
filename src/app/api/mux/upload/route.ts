import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { muxVideo } from "@/lib/mux";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json().catch(() => ({}));
        const { title } = body;

        const upload = await muxVideo.uploads.create({
            cors_origin: "*", // In production, you might want to restrict this
            new_asset_settings: {
                playback_policy: ["public"],
                passthrough: JSON.stringify({
                    title: title || "Untitled Film",
                    type: "film",
                }),
            },
        });

        return NextResponse.json({
            url: upload.url,
            id: upload.id,
        });
    } catch (error) {
        console.error("[MUX_UPLOAD_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
