import express from "express";
import { PrismaClient } from "@prisma/client";

const port = 3000;
const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.get("/movies", async (req, res) => {
    const movies = await prisma.movie.findMany({
        orderBy: {
            title: "asc"
        },
        include: {
            genres: true,
            languages: true
        }
    });
    res.json(movies);
});

app.post("/movies", async (req, res) => {

    const { title, genre_id, language_id, oscar_count, release_date } = req.body;
    try {
        await prisma.movie.create({
            data: {
                title: title,
                genre_id: genre_id,
                language_id: language_id,
                oscar_count: oscar_count,
                release_date: new Date(release_date),
            },
        });
    } catch (error) {
        return res.status(500).send({message: "error message"});
    }
    res.status(201).send();
});

app.put("/movies/:id", async (req, res) => {
    const id = Number(req.params.id);

    try{
        const movie = await prisma.movie.findUnique({
            where: {
                id
            }
        });

        if (!movie) {
            return res.status(404).send({message: "Movie not found"});
        }

        const data = {...req.body};
        data.release_date = data.release_date ? new Date(data.release_date): undefined;

        await prisma.movie.update ({
            where: {
                id
            }, 
            data: data
        });
    } catch (error) {
        return res.status(500).send({message: "error when updating movie"});
    }
    res.status(200).send();
});
    

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});