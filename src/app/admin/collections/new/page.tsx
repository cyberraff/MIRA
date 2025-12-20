import { CollectionForm } from "@/components/admin/collection-form";
import Link from "next/link";

export default function NewCollectionPage() {
    return (
        <div className="space-y-12">
            <Link href="/admin/collections" className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 hover:opacity-100 transition-opacity">
                ← BACK TO COLLECTIONS
            </Link>
            <CollectionForm />
        </div>
    );
}
