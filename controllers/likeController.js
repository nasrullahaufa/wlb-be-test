const { User, Post, Comment, Like } = require("../models");
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
          include: "Likes",
        });
        //   console.log(post.Likes[0].Like)

        if (post) {
          let isAlreadyLike = post.Likes.filter((like, i) => {
            return like.dataValues.UserId == checkedUser.id;
          });
          if (isAlreadyLike.length !== 0) {
            throw {
              name: "AlreadyLiked",
            };
          } else {
            const newLike = await Like.create({
              PostId,
              UserId: checkedUser.id,
            });
            const originalPoster = post.User.dataValues;
            if (checkedUser.id !== originalPoster.id) {
              const emailNotifikasi = {
                from: "Blogpost <nasrullahaufa@gmail.com>",
                to: `${originalPoster.email}`,
                subject: "Notifikasi Like",
                text: `Postingan anda yang berjudul ${post.title} disukai oleh ${checkedUser.email}`,
              };

              mailgun.messages().send(emailNotifikasi, (error, body) => {
                if (error) {
                  console.log(error, "<<");
                } else {
                  console.log(body, "<<<");
                }
              });
            }
          }
          ctx.response.status = 201;
          ctx.response.body = { message: "Like Success", newComment };
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
}

module.exports = Controller;
