import cors from "cors"
import express from "express";
import userRoute from "./routes/userRoute.js";
import urlRoute from "./routes/urlRoute.js";

const app = express();
app.use(express.json());

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://url-shortener-flame-nine.vercel.app']
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
}));

app.use("/api",userRoute);
app.use("/api",urlRoute)

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));