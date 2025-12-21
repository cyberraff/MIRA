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
            const assetId = upload.asset_id!;
            const asset = await muxVideo.assets.retrieve(assetId);

            // Sync passthrough title to meta if needed
            let title: string | undefined;
            if (asset.passthrough) {
                try {
                    const parsed = JSON.parse(asset.passthrough);
                    title = parsed.title;

                    // If we have a title but no meta.title, let's update it
                    // cast to any because typedefs might lag
                    if (title && !(asset as any).meta?.title) {
                        await muxVideo.assets.update(assetId, {
                            passthrough: asset.passthrough, // Mux requires this or it might clear it? better safe
                            meta: {
                                title: title,
                                type: parsed.type || "film"
                            }
                        } as any);
                    }
                } catch (e) {
                    // ignore
                }
            }

            return NextResponse.json({
                status: "completed",
                assetId: asset.id,
                playbackId: asset.playback_ids?.[0]?.id,
                duration: asset.duration,
                title,
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
