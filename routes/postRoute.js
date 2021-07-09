const PostController = require("../controllers/postController");
const CommentController = require("../controllers/commentController");
const LikeController = require("../controllers/likeController");

const authenticate = require("../middlewares/authentication");

const postRoute = (router) => {
  router.get("/post", PostController.findAll);
  router.post("/post", PostController.create);
  router.put("/post/:id", PostController.edit);
  router.get("/post/:id", PostController.getById);
  router.delete("/post/:id", PostController.delete);
  router.post("/post/:id/comment", CommentController.create);
  router.post("/post/comment/:id", CommentController.subcommentCreate);
  router.post("/post/:id/like", LikeController.create);
};

module.exports = postRoute;
