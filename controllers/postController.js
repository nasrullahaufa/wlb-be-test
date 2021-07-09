const { User, Post } = require("../models");
const authenticate = require("../middlewares/authentication");
const authorize = require("../middlewares/authorization");
class Controller {
  static async create(ctx, next) {
    await authenticate(ctx, next);

    const { title, content, moderated } = ctx.request.body;
    try {
      const newPost = await Post.create({
        title,
        content,
        UserId: ctx.user.id,
        moderated,
      });

      ctx.response.status = 201;
      ctx.response.body = { message: "Post Success", newPost };
    } catch (err) {
      ctx.error = err;
    }
  }

  static async findAll(ctx) {
    try {
      const posts = await Post.findAll({include:"Comments"});

      ctx.response.status = 200;
      ctx.response.body = { posts: posts };
    } catch (err) {}
  }
  static async getById(ctx){
      try {
          const postId = ctx.request.params.id
          const post = await Post.findByPk(postId,{include:"Comments"})
          console.log(post)
          ctx.response.status = 200;
      ctx.response.body = {
        
        post
      };

      }catch (err) {
        console.log(err);
      }
  }
  static async edit(ctx, next) {
    authenticate(ctx, next);

    authorize(ctx, next);
    const { title, content, moderated } = ctx.request.body;
    try {
      const editedPost = await Post.update(
        {
          title,
          content,
          UserId: ctx.user.id,
          moderated,
        },
        {
          where: { id: ctx.request.params.id },
          returning: true,
        }
      );
      //   console.log(editedPost[1][0].dataValues, "<<,");
      ctx.response.status = 200;
      ctx.response.body = {
        message: "Edit post success",
        editedPost: editedPost[1][0].dataValues,
      };
    } catch (err) {
      ctx.error = err;
      next(ctx);
    }
  }

  static async delete(ctx, next) {
    authenticate(ctx, next);
    authorize(ctx, next);
    try {
      const id = ctx.request.params.id;
      console.log("xx");
      const deleted = await Post.destroy({
        where: { id },
      });

      ctx.response.status = 200;
      ctx.response.body = {
        message: "Delete Post success",
      };
    } catch (err) {
      console.log(err);
      ctx.error = err;
      next(ctx);
    }
  }
}

module.exports = Controller;
