const UserController = require("../controllers/userController");

const userRoute = (router) => {
  router.post("/register", UserController.register);
  router.get("/register/verify", UserController.verify);
  router.post("/login", UserController.login);
};

module.exports = userRoute;
