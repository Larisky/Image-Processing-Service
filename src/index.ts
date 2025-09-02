import "dotenv/config";
import express from "express";
import cors from 'cors';
import imageRoutes from "./routes/imagesRoute";
import authRoutes from "./routes/authRoute";

const app = express();

app.use(cors());
app.use(express.json({limit: "1mb"}));

app.get("/health", (_req,res) => {
    res.status(200).json ({ status: "ok"});
});


app.use("/images", imageRoutes);

app.use("/auth", authRoutes);      

app.use((_req, res) => {
    res.status(400).json({error: "Not found"});
});

const PORT = process.env.PORT || 4000;
app.listen (PORT, () => {
    console.log(`API running on http://localhost:${PORT} `);
});