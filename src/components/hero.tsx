import { Button } from "@/components/ui/button";

export function Hero() {
    return (
        <section className="relative h-screen w-full overflow-hidden bg-black flex items-center justify-center text-center">
            <div
                className="absolute inset-0 bg-cover bg-center opacity-40 grayscale"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop')" }}
            />
            <div className="relative z-20 max-w-4xl px-6">
                <h1 className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter uppercase leading-[0.8]">
                    CINEMATIC<br />STORIES
                </h1>
                <p className="mt-8 text-xs font-bold uppercase tracking-[0.3em] opacity-60">
                    SHORT FILMS FOR THE MODERN AGE
                </p>
                <div className="mt-12">
                    <button className="bg-white text-black px-12 py-4 text-xs font-black uppercase tracking-widest hover:bg-zinc-200 transition-colors">
                        WATCH NOW
                    </button>
                </div>
            </div>
        </section>
    );
}
