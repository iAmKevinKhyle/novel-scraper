import { databases } from "../utils/client.js";
import { ID, Query } from "appwrite";
import bcrypt from "bcrypt";

export const CreateUserAccount = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const saltRounds = 15;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const response = await databases.createDocument(
      "NovelJunkyard",
      "670f3ba700265fff73af",
      ID.unique(),
      {
        username,
        password: hashedPassword,
      }
    );

    res
      .status(201)
      .json(
        `User (${response.username}) registered successfully, \nYou can now Login.`
      );
  } catch (error) {
    res.status(error.code).json(error);
  }
};

export const LogInUserAccount = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const response = await databases.listDocuments(
      "NovelJunkyard",
      "670f3ba700265fff73af",
      [Query.equal("username", username)]
    );

    if (response.total > 0) {
      const user = {
        id: response.documents[0].$id,
        username: response.documents[0].username,
        password: response.documents[0].password,
      };

      const equalPassword = await bcrypt.compare(password, user.password);

      if (equalPassword) {
        return res.status(200).json({
          id: user.id,
        });
      }

      return res.status(201).json("Username and Password do not match!");
    }

    res.status(404).json(`User (${username}) cannot be found.`);
  } catch (error) {
    res.status(error.code).json(error);
  }
};

export const UpdateUserBookmark = async (req, res, next) => {
  const { user_id, novel_title, data } = req.body;

  try {
    const response = await databases.listDocuments(
      "NovelJunkyard",
      "670f5d430007ba3ca90d",
      [Query.equal("user", user_id), Query.contains("title", novel_title)]
    );

    if (response.total === 0) {
      // ? if response.total is === 0 create it instead

      if (data[1] === 2) {
        return res
          .status(404)
          .json({ text: `No Bookmark (${novel_title}) Found!` });
      }

      const create = await databases.createDocument(
        "NovelJunkyard",
        "670f5d430007ba3ca90d",
        ID.unique(),
        {
          ...data,
          user: user_id,
        }
      );

      return res.status(201).json({
        id: create.$id,
        text: create.title + " has been Bookmarked Successfully!",
      });
    }

    const bookmark_id = response.documents[0].$id;

    await databases.updateDocument(
      "NovelJunkyard",
      "670f5d430007ba3ca90d",
      bookmark_id,
      data[0]
    );

    res.status(200).json({ text: "Bookmark Updated Successfully!" });
  } catch (error) {
    res.status(error.code).json(error);
  }
};

export const DeleteUserBookmark = async (req, res, next) => {
  const { bookmark_id } = req.body;

  try {
    const response = await databases.deleteDocument(
      "NovelJunkyard",
      "670f5d430007ba3ca90d",
      bookmark_id
    );

    res.status(200).json({ text: "Bookmark Successfully Deleted!" });
  } catch (error) {
    res.status(error.code).json(error);
  }
};

export const GetChapterListPageOnBookmark = async (req, res, next) => {
  const { user_id, novel_title } = req.body;

  try {
    const response = await databases.listDocuments(
      "NovelJunkyard",
      "670f5d430007ba3ca90d",
      [Query.equal("user", user_id), Query.contains("title", novel_title)]
    );

    if (response.total > 0) {
      return res.status(200).json({ page: response.documents[0].page });
    }

    res
      .status(404)
      .json({ page: 1, text: `No Bookmark (${novel_title}) Found!` });
  } catch (error) {
    console.log(error);

    res.status(error.code).json(error);
  }
};

export const UpdateUserReading = async (req, res, next) => {
  const { user_id, novel_title, data } = req.body;

  try {
    const response = await databases.listDocuments(
      "NovelJunkyard",
      "670f5ba60023916b8ad9",
      [Query.equal("user", user_id), Query.contains("title", novel_title)]
    );

    if (response.total === 0) {
      // ? if response.total is === 0 create it instead

      const created = await databases.createDocument(
        "NovelJunkyard",
        "670f5ba60023916b8ad9",
        ID.unique(),
        {
          ...data,
          user: user_id,
        }
      );

      return res.status(201).json({
        id: created.$id,
        text: "Created!",
      });
    }

    const reading_id = response.documents[0].$id;

    await databases.updateDocument(
      "NovelJunkyard",
      "670f5ba60023916b8ad9",
      reading_id,
      data
    );

    res.status(200).json({ id: reading_id, text: "Updated!" });
  } catch (error) {
    res.status(error.code).json(error);
  }
};

export const UpdateUserReadingHistory = async (req, res, next) => {
  const { reading_id, history } = req.body;

  try {
    const reading = await databases.listDocuments(
      "NovelJunkyard",
      "670f953800359d6d6c55",
      [Query.equal("reading", reading_id)]
    );

    if (reading.total > 0) {
      const chapter = reading.documents[reading.total - 1].chapter;

      // ? if greater than 5, delete history after that
      if (reading.total >= 5) {
        reading.documents.forEach(async (item, i) => {
          const max = reading.documents.length - 5;

          if (i + 1 <= max) {
            const id = item.$id;

            await databases.deleteDocument(
              "NovelJunkyard",
              "670f953800359d6d6c55",
              id
            );
          }
        });
      }

      if (history.chapter !== chapter) {
        await databases.createDocument(
          "NovelJunkyard",
          "670f953800359d6d6c55",
          ID.unique(),
          {
            ...history,
            reading: reading_id,
          }
        );

        return res.status(201).json("Updated!");
      }
      return res.status(400).json("Already Updated!");
    }

    await databases.createDocument(
      "NovelJunkyard",
      "670f953800359d6d6c55",
      ID.unique(),
      {
        ...history,
        reading: reading_id,
      }
    );

    return res.status(201).json("Updated!");
  } catch (error) {
    console.log(error);
    res.status(error.code).json(error);
  }
};

export const DeleteUserReadingHistory = async (req, res, next) => {
  const { reading_id } = req.body;

  try {
    await databases.deleteDocument(
      "NovelJunkyard",
      "670f5ba60023916b8ad9",
      reading_id
    );

    res.status(200).json({ text: "Reading History Successfully Deleted!" });
  } catch (error) {
    res.status(error.code).json(error);
  }
};

export const GetOneUser = async (req, res, next) => {
  const id = req.params.id;

  try {
    const response = await databases.getDocument(
      "NovelJunkyard",
      "670f3ba700265fff73af",
      id
    );

    const user = {
      id: response.$id,
      username: response.username,
      bookmark: response.bookmark,
      reading: response.reading,
    };

    res.status(200).json(user);
  } catch (error) {
    res.status(error.code).json(error);
  }
};

export const GetAllUsernames = async (req, res, next) => {
  try {
    let names = [];

    const list = await databases.listDocuments(
      "NovelJunkyard",
      "670f3ba700265fff73af"
    );

    list.documents.forEach((item) => names.push(item.username));

    if (list.total > 0) {
      return res.status(200).json(names);
    }
    return res.status(200).json(names);
  } catch (error) {
    res.status(error.code).json(error);
  }
};

// ? FUTURE UPDATE
// ? log out user / delete session id
export const LogOutUserAccount = (req, res, next) => {
  res.json("Hello World!");
};
// ? delete user in the future
export const DeleteUserAccount = (req, res, next) => {
  res.json("Delete Account");
};
