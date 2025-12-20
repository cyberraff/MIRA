import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { CollectionForm } from "@/components/admin/collection-form";
import Link from "next/link";

export default async function EditCollectionPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const collection = await prisma.collection.findUnique({
        where: { id },
    });

    if (!collection) {
        notFound();
    }

    return (
        <div className="space-y-12">
            <Link href={`/admin/collections/${id}`} className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 hover:opacity-100 transition-opacity">
                ← BACK TO COLLECTION
            </Link>
            <CollectionForm initialData={collection as any} />
        </div>
    );
}
