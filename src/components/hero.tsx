import { Button } from "@/components/ui/button";

export function Hero() {
    return (
        <section className="relative h-[70vh] w-full overflow-hidden bg-black">
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent z-10" />
            <div
                className="absolute inset-0 bg-cover bg-center opacity-60"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop')" }}
            />
            <div className="container relative z-20 flex h-full flex-col justify-center px-4 md:px-8">
                <div className="max-w-2xl space-y-6">
                    <h1 className="text-5xl font-extrabold tracking-tight text-white md:text-7xl">
                        Cinematic Stories, <span className="text-primary">Short & Sweet</span>
                    </h1>
                    <p className="text-lg text-zinc-300 md:text-xl">
                        Discover the world's best short films. From award-winning animations to gripping dramas, all in one place.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Button size="lg" className="h-12 px-8 text-base font-semibold">
                            Start Watching
                        </Button>
                        <Button size="lg" variant="outline" className="h-12 px-8 text-base font-semibold text-white border-white hover:bg-white/10">
                            Browse Categories
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
