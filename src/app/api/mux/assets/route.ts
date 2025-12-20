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

        const formattedAssets = assets.data.map(asset => ({
            id: asset.id,
            playbackId: asset.playback_ids?.[0]?.id,
            status: asset.status,
            createdAt: asset.created_at,
            duration: asset.duration,
            isImported: existingAssetIds.has(asset.id)
        }));

        return NextResponse.json(formattedAssets);
    } catch (error) {
        console.error("[MUX_ASSETS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
