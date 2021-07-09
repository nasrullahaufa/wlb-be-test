const { User, Post, Comment } = require("../models");
const authenticate = require("../middlewares/authentication");
const authorize = require("../middlewares/authorization");
const { verifyToken } = require("../helpers/jwt");
const mailgunloader = require("mailgun-js");
let mailgun = mailgunloader({
  apiKey: process.env.MAILGUN_KEY,
  domain: process.env.MAILGUN_DOMAIN,
});
class Controller {
  static async create(ctx, next) {
    const { content } = ctx.request.body;
    try {
      if (!ctx.request.headers.access_token) {
        throw {
          name: "JsonWebTokenError",
        };
      }
      let decoded = verifyToken(ctx.request.headers.access_token);
      console.log(decoded);
      let checkedUser = await User.findOne({
        where: { id: decoded.id, email: decoded.email },
      });
      if (checkedUser) {
        const PostId = ctx.request.params.id;
        const post = await Post.findOne({
          where: { id: PostId },
          include: "User",
        });
        if (post) {
          const newComment = await Comment.create({
            PostId,
            content,
            UserId: checkedUser.id,
          });
          const originalPoster = post.User.dataValues;
          if (checkedUser.id !== originalPoster.id) {
            const emailNotifikasi = {
              from: "Blogpost <nasrullahaufa@gmail.com>",
              to: `${originalPoster.email}`,
              subject: "Notifikasi komentar",
              text: `Postingan anda yang berjudul ${post.title} dikomentari oleh ${checkedUser.email}`,
            };

            mailgun.messages().send(emailNotifikasi, (error, body) => {
              if (error) {
                console.log(error, "<<");
              } else {
                console.log(body, "<<<");
              }
            });
          }
          ctx.response.status = 201;
          ctx.response.body = { message: "Comment Success", newComment };
        } else {
          throw {
            name: "PostNotFound",
          };
        }
      } else {
        throw {
          name: "JsonWebTokenError",
        };
      }
    } catch (err) {
      console.log(err);
      ctx.error = err;
      next(err);
    }
  }

  static async subcommentCreate(ctx, next) {
    const { content } = ctx.request.body;
    try {
      if (!ctx.request.headers.access_token) {
        throw {
          name: "JsonWebTokenError",
        };
      }
      let decoded = verifyToken(ctx.request.headers.access_token);
      console.log(decoded);
      let checkedUser = await User.findOne({
        where: { id: decoded.id, email: decoded.email },
      });
      if (checkedUser) {
        const CommentId = ctx.request.params.id;
        console.log(CommentId);
        const comment = await Comment.findOne({
          where: { id: CommentId },
          include: {
          all:true
            
          },
        });
        console.log(comment);
        if (comment) {
          const originalCommentPoster = comment.User.dataValues;
          const post = comment.Post.dataValues;
          const subComment = await Comment.create({
            CommentId,
            content,
            UserId:checkedUser.id,
            PostId:post.id
          });
          if (checkedUser.id !== originalCommentPoster.id) {
            const emailNotifikasi = {
              from: "Blogpost <nasrullahaufa@gmail.com>",
              to: `${originalCommentPoster.email}`,
              subject: "Notifikasi komentar",
              text: `komentar anda pada postingan  yang berjudul ${post.title} dikomentari oleh ${checkedUser.email}`,
            };

            mailgun.messages().send(emailNotifikasi, (error, body) => {
              if (error) {
                console.log(error, "<<");
              } else {
                console.log(body, "<<<");
              }
            });
          }
          ctx.response.status = 201;
          ctx.response.body = { message: "Comment Success", subComment };
        } else {
          throw {
            name: "CommentNotFound",
          };
        }
      } else {
        throw {
          name: "JsonWebTokenError",
        };
      }
    } catch (err) {
      console.log(err);
      ctx.error = {};
      ctx.error = err;
      next(ctx);
    }
  }
}

module.exports = Controller;
