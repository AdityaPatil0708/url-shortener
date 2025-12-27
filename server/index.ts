import cors from "cors"
import express from "express";
import userRoute from "./routes/userRoute.js";
import urlRoute from "./routes/urlRoute.js";

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://url-shortener-flame-nine.vercel.app/',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

app.use("/api", userRoute);
app.use("/api", urlRoute);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));