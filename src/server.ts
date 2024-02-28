import express from "express";

const port = 3000;

const app = express();

app.get("/movies", (req, res) => {
    res.send("Movies List");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});