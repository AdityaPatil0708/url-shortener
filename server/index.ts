import cors from "cors"
import express from "express";
import userRoute from "./routes/userRoute.js";
import urlRoute from "./routes/urlRoute.js";
const app = express();
app.use(express.json());
app.use(cors());

app.use("/api",userRoute);
app.use("/api",urlRoute)

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
