const { verifyToken } = require("../helpers/jwt");
const { User } = require("../models");
const errorHandler = require("./errorHandler");

async function authenticate(ctx, next) {
  console.log(ctx.request.headers.access_token, "<<");
  try {
    if (ctx.request.header.access_token === undefined) {
      ctx.error = {};
      ctx.error = { name: "JsonWebTokenError" };
      errorHandler(ctx);
    } else {
      let decoded = verifyToken(ctx.request.headers.access_token);
      console.log(decoded, "dekod");
      ctx.user = {
        id: decoded.id,
        email: decoded.email,
      };
      console.log(ctx.user);

      let checkedUser = await User.findOne({
        where: {
          id: ctx.user.id,
          email: ctx.user.email,
        },
      });

      if (checkedUser) {
        return;
      } else {
        throw {
          name: "JsonWebTokenError",
        };
      }
    }
  } catch (err) {
    console.log(err.name);
    ctx.error = err;
    errorHandler(ctx);
  }
}

module.exports = authenticate;
