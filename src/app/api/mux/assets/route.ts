import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { muxVideo } from "@/lib/mux";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // 1. Get assets from Mux
        const assets = await muxVideo.assets.list();

        // 2. Get existing film asset IDs from database to mark them
        const existingFilms = await prisma.film.findMany({
            select: { videoAssetId: true }
        });
        const existingAssetIds = new Set(existingFilms.map(f => f.videoAssetId).filter(Boolean));

        const formattedAssets = assets.data.map(asset => {
            let title: string | undefined;

            // 1. Try parsing JSON from passthrough (new uploads)
            if (asset.passthrough) {
                try {
                    const parsed = JSON.parse(asset.passthrough);
                    title = parsed.title;
                } catch (e) {
                    // unexpected passthrough format
                }
            }

            // 2. Fallback to meta field (legacy/manual uploads)
            if (!title && (asset as any).meta?.title) {
                title = (asset as any).meta.title;
            }

            // 3. Last resort fallback (optional, or let UI handle it)
            // if (!title) title = asset.passthrough || asset.id;

            return {
                id: asset.id,
                playbackId: asset.playback_ids?.[0]?.id,
                status: asset.status,
                createdAt: asset.created_at,
                duration: asset.duration,
                resolution_tier: asset.resolution_tier,
                max_resolution: asset.max_stored_resolution,
                aspect_ratio: asset.aspect_ratio,
                title: title, // This can be undefined, UI handles fallback
                isImported: existingAssetIds.has(asset.id)
            };
        });

        return NextResponse.json(formattedAssets);
    } catch (error) {
        console.error("[MUX_ASSETS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }



}

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const assetId = searchParams.get("id");

        if (!assetId) {
            return new NextResponse("Asset ID required", { status: 400 });
        }

        await muxVideo.assets.delete(assetId);

        return new NextResponse("Deleted", { status: 200 });
    } catch (error) {
        console.error("[MUX_ASSET_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
