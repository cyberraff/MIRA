const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    // Clear existing data
    await prisma.watchProgress.deleteMany();
    await prisma.favorite.deleteMany();
    await prisma.collectionFilm.deleteMany();
    await prisma.collection.deleteMany();
    await prisma.film.deleteMany();
    await prisma.user.deleteMany();

    // Create an admin user
    const admin = await prisma.user.create({
        data: {
            name: "Admin User",
            email: "admin@mira.com",
            role: "ADMIN",
        },
    });

    // Create some films
    // const films = await Promise.all([
    //     prisma.film.create({
    //         data: {
    //             title: "The Silent Forest",
    //             description: "A journey through the untouched wilderness of the Pacific Northwest.",
    //             thumbnailUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=800",
    //             videoUrl: "dQw4w9WgXcQ", // Placeholder
    //             duration: "12:45",
    //             category: "Documentary",
    //             tags: ["nature", "forest", "wilderness"],
    //             visibility: "PUBLIC",
    //             views: 1200,
    //             likes: 450,
    //         },
    //     }),
    //     prisma.film.create({
    //         data: {
    //             title: "Neon Dreams",
    //             description: "An experimental exploration of light and sound in the heart of Tokyo.",
    //             thumbnailUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=800",
    //             videoUrl: "dQw4w9WgXcQ",
    //             duration: "08:30",
    //             category: "Experimental",
    //             tags: ["tokyo", "neon", "light", "sound"],
    //             visibility: "PUBLIC",
    //             views: 800,
    //             likes: 320,
    //         },
    //     }),
    // prisma.film.create({
    //     data: {
    //         title: "The Last Artisan",
    //         description: "A portrait of a master woodworker preserving ancient traditions.",
    //         thumbnailUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
    //         videoUrl: "dQw4w9WgXcQ",
    //         duration: "15:20",
    //         category: "Culture",
    //         tags: ["craft", "tradition", "artisan"],
    //         visibility: "PUBLIC",
    //         views: 2500,
    //         likes: 980,
    //     },
    // }),
    // ]);

    // Create a collection
    const collection = await prisma.collection.create({
        data: {
            title: "Nature & Serenity",
            description: "A curated selection of films that explore the beauty of the natural world.",
        },
    });

    // Add films to collection
    await prisma.collectionFilm.create({
        data: {
            collectionId: collection.id,
            filmId: films[0].id,
            order: 0,
        },
    });

    console.log("Database seeded successfully!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
