import express from "express";
import {
  COMPLETED_NOVELS,
  GET_ALL_COMPLETED_NOVELS,
  GET_ALL_HOT_NOVELS,
  GET_ALL_LATEST_NOVELS,
  GET_CHAPTER_CONTENTS,
  GET_NOVEL_BY_KEYWORDS,
  GET_NOVEL_DESC,
  GET_PREV_NEXT_CHAPTER,
  GET_THIRTY_CHAPTERS,
  HOT_NOVELS,
  LATEST_NOVELS,
} from "../controllers/novel-controllers.js";

const novelRouter = express.Router();

novelRouter.get("/hot", HOT_NOVELS);
novelRouter.get("/latest", LATEST_NOVELS);
novelRouter.get("/completed", COMPLETED_NOVELS);
novelRouter.get("/search/:key/:page", GET_NOVEL_BY_KEYWORDS);
novelRouter.post("/description", GET_NOVEL_DESC);
novelRouter.post("/navigate", GET_PREV_NEXT_CHAPTER);
novelRouter.post("/chapters", GET_THIRTY_CHAPTERS);
novelRouter.post("/content", GET_CHAPTER_CONTENTS);
novelRouter.get("/hot/all/:page", GET_ALL_HOT_NOVELS);
novelRouter.get("/latest/all/:page", GET_ALL_LATEST_NOVELS);
novelRouter.get("/completed/all/:page", GET_ALL_COMPLETED_NOVELS);

export default novelRouter;
