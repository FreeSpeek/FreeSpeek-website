import Post from "../models/postModel.js";

const postController = {
  createPost: async (req, res) => {
    const { title, content } = req.body;
    const picture = req.file ? req.file.path : null;

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    try {
      const post = new Post({
        user: req.user.id,
        title,
        content,
        picture,
      });

      await post.save();
      res.json({ message: "Post created successfully", post });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Server error", error });
    }
  },

  getPosts: async (req, res) => {
    try {
      const posts = await Post.find().populate("user", ["name"]);
      res.json(posts);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Server error", error });
    }
  },

  updatePost: async (req, res) => {
    const { title, content } = req.body;
    const { postId } = req.params;
    const picture = req.file ? req.file.path : null;

    if (!title && !content && !picture) {
      return res.status(400).json({ message: "Title or content is required" });
    }

    try {
      const post = await Post.findById(postId);

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      if (post.user.toString() !== req.user.id) {
        return res.status(403).json({ message: "User not authorized" });
      }

      post.title = title || post.title;
      post.content = content || post.content;
      if (picture) post.picture = picture;

      await post.save();
      res.json({ message: "Post updated successfully", post });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Server error", error });
    }
  },

  deletePost: async (req, res) => {
    const { postId } = req.params;

    try {
      const post = await Post.findById(postId);

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      if (post.user.toString() !== req.user.id) {
        return res.status(403).json({ message: "User not authorized" });
      }

      await post.remove();
      res.json({ message: "Post deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Server error", error });
    }
  },
  likePost: async (req, res) => {
    const { postId } = req.body;

    try {
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      if (post.like.includes(req.user._id)) {
        return res
          .status(400)
          .json({ message: "You have already liked this post" });
      }

      post.like.push(req.user._id);
      await post.save();

      res.status(200).json({ message: "Post liked successfully", post });
    } catch (error) {
      console.error("Error liking post:", error);
      res.status(500).send({ message: "Server error", error });
    }
  },
  unlikePost: async (req, res) => {
    const { postId } = req.body;

    try {
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      const likeIndex = post.like.indexOf(req.user._id);
      if (likeIndex === -1) {
        return res
          .status(400)
          .json({ message: "You have not liked this post" });
      }

      post.like.splice(likeIndex, 1);
      await post.save();

      res.status(200).json({ message: "Post unliked successfully", post });
    } catch (error) {
      console.error("Error unliking post:", error);
      res.status(500).send({ message: "Server error", error });
    }
  },
  sharePost: async (req, res) => {
    const { postId } = req.body;

    try {
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      const sharedPost = new Post({
        user: req.user._id,
        title: post.title,
        content: post.content,
        picture: post.picture,
        date: Date.now(),
        isShared: true,
        originalPost: post._id,
      });

      await sharedPost.save();
      res.status(201).json({ message: "Post shared successfully", sharedPost });
    } catch (error) {
      console.error("Error sharing post:", error);
      res.status(500).send({ message: "Server error", error });
    }
  },
};

export default postController;
