const PostController = require("../controllers/postController");
const CommentController = require('../controllers/commentController')
const LikeController = require('../controllers/likeController')


const authenticate = require("../middlewares/authentication");

const postRoute = (router) => {
  router.get("/post", PostController.findAll);

  router.post("/post", PostController.create);
  router.put("/post/:id", PostController.edit);
  router.get("/post/:id", PostController.getById);

  router.delete("/post/:id", PostController.delete);
  router.post('/post/:id/comment', CommentController.create)
  router.post('/post/comment/:id', CommentController.subcommentCreate)
  // router.get('/post/:title&:filter&:sortby', PostController.findPost)
  // // router.get('/post/:username&:filter', PostController.findByUsername)
  // router.get('/post/comment/:id', CommentController.fetchComment)
  router.post('/post/:id/like', LikeController.create)
  // router.get('/post/:title', PostController.findByTitle)
};

module.exports = postRoute;
