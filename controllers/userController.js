const { User } = require("../models");
const checkPassword = require("../helpers/checkHashedPassword");
const mailgunloader = require("mailgun-js");
const { verifyToken, generateToken } = require("../helpers/jwt");
const errorHandler = require("../middlewares/errorHandler");
let mailgun = mailgunloader({
  apiKey: process.env.MAILGUN_KEY,
  domain: process.env.MAILGUN_DOMAIN,
});

class Controller {
  static async register(ctx, next) {
    const { email, password } = ctx.request.body;
    console.log(email, password);
    const token = generateToken({ email: email });
    console.log(token)
    try {
      const user = await User.create({ email: email, password: password });
      const token = generateToken({ email: user.email });
      const link = `http://localhost:3000/register/verify?token=${token}`;

      const emailVerifikasi = {
        from: "Blogpost <alafajakam@gmail.com>",
        to: `${user.email}`,
        subject: "Account Verification",
        text: "Verification link: " + link,
      };

      mailgun.messages().send(emailVerifikasi, (error, body) => {
        if (error) {
          console.log(error, "<<");
        } else {
          console.log(body, "<<<");
        }
      });
      ctx.response.status = 201;
      ctx.response.body = { message: "Registration Success" };
    } catch (error) {
      ctx.error = error;
      next(ctx);
    }
  }

  static async verify(ctx, next) {
    try {
      const { token } = ctx.request.query;
      console.log(token)
      const decoded = verifyToken(token);
      let user = await User.findOne({ where: { email: decoded.email } });
      if (user) {
        let verified = await User.update(
          {
            status: "Aktif",
          },
          {
            where: { email: decoded.email },
          }
        );
        ctx.response.status = 200;
        ctx.response.body = { message: "Verification Success" };
      } else {
        throw {
          name: "UserNotFound",
        };
      }
    } catch (error) {
      ctx.error = error;
      next(ctx);
    }
  }

  static async login(ctx, next) {
    const { email, password } = ctx.request.body;
    console.log(email, password);

    try {
      let user = await User.findOne({ where: { email: email } });
      if (user) {
        const isPasswordMatch = checkPassword(password, user.password);
        if (isPasswordMatch) {
          if (user.status === "Terdaftar") {
            ctx.error = {};
            ctx.error.name = "NotVerified";
            next(ctx);
          } else {
            const token = generateToken({ id: user.id, email: user.email });
            ctx.response.status = 200;
            ctx.response.body = { access_token: token };
          }
        } else {
          throw { name: "WrongAccount" };
        }
      } else {
        throw {
          name: "UserNotFound",
        };
      }
    } catch (err) {
      console.log(err);
      ctx.error = err;
      next(ctx);
    }
  }
}

module.exports = Controller;
