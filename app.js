if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config();
}



const koa = require("koa");
const app = new koa();
const bodyParser = require("koa-bodyparser");
const cors = require("kcors");
const Router = require("koa-router");
const route = new Router();
const routing = require("./routes/index");
const port = process.env.PORT || 3000;
const errorHandler = require("./middlewares/errorHandler");

app
  .use(cors())
  .use(bodyParser())
  .use(route.routes())
  .use(route.allowedMethods())
  

routing(route);
app.use((ctx)=>{
  errorHandler(ctx)
})

app.listen(port, function () {
  console.log("Server running on https://localhost:3000");
});
