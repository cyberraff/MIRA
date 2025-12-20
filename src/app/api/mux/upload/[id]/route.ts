import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { muxVideo } from "@/lib/mux";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: uploadId } = await params;
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const upload = await muxVideo.uploads.retrieve(uploadId);

        if (upload.status === "asset_created") {
            const asset = await muxVideo.assets.retrieve(upload.asset_id!);
            return NextResponse.json({
                status: "completed",
                assetId: asset.id,
                playbackId: asset.playback_ids?.[0]?.id,
            });
        }

        return NextResponse.json({
            status: upload.status,
        });
    } catch (error) {
        console.error("[MUX_UPLOAD_STATUS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
