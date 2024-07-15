// src/routes/postRoutes.js
import express from "express";
import postController from "../controllers/postController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const postRouter = express.Router();

postRouter.post(
  "/create",
  authMiddleware,
  upload.single("picture"),
  postController.createPost
);
postRouter.get("/", authMiddleware, postController.getPosts);
postRouter.put(
  "/update/:postId",
  authMiddleware,
  upload.single("picture"),
  postController.updatePost
);
postRouter.delete("/delete/:postId", authMiddleware, postController.deletePost);
postRouter.post("/like", authMiddleware, postController.likePost);
postRouter.post("/unlike", authMiddleware, postController.unlikePost);
postRouter.post("/share", authMiddleware, postController.sharePost);

export default postRouter;
