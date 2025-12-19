import { Hero } from "@/components/hero";
import { FilmCard } from "@/components/film-card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { prisma } from "@/lib/prisma";
import * as motion from "framer-motion/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Home() {
  const session = await getServerSession(authOptions);

  const trendingFilms = await prisma.film.findMany({
    where: { visibility: "PUBLIC" },
    take: 5,
    orderBy: { views: "desc" },
  });

  const newReleases = await prisma.film.findMany({
    where: { visibility: "PUBLIC" },
    take: 10,
    orderBy: { createdAt: "desc" },
  });

  let continueWatching: any[] = [];
  if (session?.user) {
    const progress = await prisma.watchProgress.findMany({
      where: {
        userId: session.user.id,
        completed: false,
      },
      include: {
        film: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 5,
    });
    continueWatching = progress.map((p: any) => p.film);
  }

  const collections = await prisma.collection.findMany({
    take: 3,
    include: {
      films: {
        include: {
          film: true,
        },
        take: 5,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-32 pb-32">
      <Hero />

      {continueWatching.length > 0 && (
        <section className="px-6 md:px-10">
          <div className="mb-12">
            <h2 className="text-xs font-black uppercase tracking-[0.3em]">CONTINUE WATCHING</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-12">
            {continueWatching.map((film: any) => (
              <FilmCard key={film.id} {...film} thumbnail={film.thumbnailUrl} />
            ))}
          </div>
        </section>
      )}

      <section className="px-6 md:px-10">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-xs font-black uppercase tracking-[0.3em]">TRENDING NOW</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-12">
          {trendingFilms.map((film: any) => (
            <FilmCard key={film.id} {...film} thumbnail={film.thumbnailUrl} />
          ))}
        </div>
      </section>

      {collections.map((collection: any) => (
        <section key={collection.id} className="px-6 md:px-10">
          <div className="mb-12">
            <h2 className="text-xs font-black uppercase tracking-[0.3em]">{collection.title}</h2>
            {collection.description && (
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mt-2 max-w-xl">
                {collection.description}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-12">
            {collection.films.map((cf: any) => (
              <FilmCard key={cf.film.id} {...cf.film} thumbnail={cf.film.thumbnailUrl} />
            ))}
          </div>
        </section>
      ))}

      <section className="px-6 md:px-10">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-xs font-black uppercase tracking-[0.3em]">NEW RELEASES</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-12">
          {newReleases.map((film: any) => (
            <FilmCard key={film.id} {...film} thumbnail={film.thumbnailUrl} />
          ))}
        </div>
      </section>
    </div>
  );
}
