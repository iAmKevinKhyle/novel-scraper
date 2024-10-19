import express from "express";
import cors from "cors";
import novelRouter from "./routes/novel-routes.js";
import genreRouter from "./routes/genre-routes.js";
import userRouter from "./routes/user-routes.js";

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());
app.use("/api/novel", novelRouter);
app.use("/api/genre", genreRouter);
app.use("/api/user", userRouter);
app.use("/", (req, res, next) => {
  res.send({ message: "Welcome to Novel Scrapper" });
});

app.listen(PORT, () => console.log("Server is running on port: " + PORT));
