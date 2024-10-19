import express from "express";
import {
  CreateUserAccount,
  DeleteUserBookmark,
  DeleteUserReadingHistory,
  GetAllUsernames,
  GetChapterListPageOnBookmark,
  GetOneUser,
  LogInUserAccount,
  UpdateUserBookmark,
  UpdateUserReading,
  UpdateUserReadingHistory,
} from "../controllers/user-controllers.js";

const userRouter = express.Router();

userRouter.post("/create", CreateUserAccount);
userRouter.post("/login", LogInUserAccount);
userRouter.post("/bookmark", UpdateUserBookmark);
userRouter.delete("/bookmark/delete", DeleteUserBookmark);
userRouter.post("/bookmark/page", GetChapterListPageOnBookmark);
userRouter.post("/reading", UpdateUserReading);
userRouter.post("/reading/history", UpdateUserReadingHistory);
userRouter.delete("/reading/history/delete", DeleteUserReadingHistory);
userRouter.get("/all", GetAllUsernames);
userRouter.get("/:id", GetOneUser);

export default userRouter;
