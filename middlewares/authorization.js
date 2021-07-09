const { Post } = require("../models");
const errorHandler = require("./errorHandler");
async function authorize(ctx, next) {
  try {
    const postId = ctx.request.params.id;
    const post = await Post.findOne({ where: { id: postId } });
    if (post) {
      if (post.UserId !== ctx.user.id) {
        throw { name: "Unauthorized" };
      } else {
        next(ctx);
      }
    } else {
      throw { name: "PostNotFound" };
    }
  } catch (err) {
    ctx.error = err;
    console.log(ctx.error)
   errorHandler(ctx);
  }
}

module.exports = authorize;
