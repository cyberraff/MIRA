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
    <div className="flex flex-col gap-16 pb-20">
      <Hero />

      {continueWatching.length > 0 && (
        <section className="container px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-8"
          >
            <h2 className="text-3xl font-bold tracking-tight">Continue Watching</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {continueWatching.map((film: any, index: number) => (
              <motion.div
                key={film.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <FilmCard {...film} thumbnail={film.thumbnailUrl} />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      <section className="container px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-8"
        >
          <h2 className="text-3xl font-bold tracking-tight">Trending Now</h2>
          <button className="text-sm font-medium text-primary hover:underline">View All</button>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {trendingFilms.map((film: any, index: number) => (
            <motion.div
              key={film.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <FilmCard {...film} thumbnail={film.thumbnailUrl} />
            </motion.div>
          ))}
        </div>
      </section>

      {collections.map((collection: any, cIndex: number) => (
        <section key={collection.id} className="container px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold tracking-tight">{collection.title}</h2>
            {collection.description && (
              <p className="text-muted-foreground mt-2 max-w-2xl">{collection.description}</p>
            )}
          </motion.div>
          <ScrollArea className="w-full whitespace-nowrap rounded-md">
            <div className="flex w-max space-x-8 p-1">
              {collection.films.map((cf: any, index: number) => (
                <motion.div
                  key={cf.film.id}
                  className="w-[300px]"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <FilmCard {...cf.film} thumbnail={cf.film.thumbnailUrl} />
                </motion.div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </section>
      ))}

      <section className="container px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-8"
        >
          <h2 className="text-3xl font-bold tracking-tight">New Releases</h2>
          <button className="text-sm font-medium text-primary hover:underline">View All</button>
        </motion.div>
        <ScrollArea className="w-full whitespace-nowrap rounded-md">
          <div className="flex w-max space-x-8 p-1">
            {newReleases.map((film: any, index: number) => (
              <motion.div
                key={film.id}
                className="w-[280px]"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <FilmCard {...film} thumbnail={film.thumbnailUrl} />
              </motion.div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </section>
    </div>
  );
}
