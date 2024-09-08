import express from "express";
import {
  GENRES,
  GET_NOVEL_WITH_THIS_GENRE,
} from "../controllers/genre-controllers.js";

const genreRouter = express.Router();

genreRouter.get("/all", GENRES);
genreRouter.get("/:genre/:page", GET_NOVEL_WITH_THIS_GENRE);

export default genreRouter;
