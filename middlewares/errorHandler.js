function errorHandler(ctx){
  console.log(ctx.error)
  // console.log(err.name, err.message,'err handler',err)
    switch(ctx.error.name) {
        case 'SequelizeValidationError':
            const errorMessage = []
            if(err.errors.length > 0){
                err.errors.forEach(error => {
                    errorMessage.push(error.message)
                })
            }
            res.status(400).json({ error: errorMessage })
            break;
      /* istanbul ignore next */
        case 'Bad Request':
            res.status(400).json({ error: [err.message] })
            break;
      /* istanbul ignore next */
        case 'SequelizeDatabaseError': 
            res.status(400).json({ error: [err.message] })
            break;

        case 'JsonWebTokenError':
          ctx.response.status= 401
          ctx.response.body = {error:"Invalid Access Token"}
            break;

        case 'SequelizeUniqueConstraintError':
         
            ctx.response.status= 400
            ctx.response.body = {error:ctx.error.message}
            break;

        case 'Unauthorized':
          ctx.response.status= 401
          ctx.response.body = { error: "You cannot perform this action" }
      
          break;

        case 'UserNotFound':
          ctx.response.status= 404
          ctx.response.body = {error:"User not found"}
          break;

        case 'NotVerified':
          ctx.response.status= 401
          ctx.response.body = {error:"Please verify your account before login"}
          break;
        case "WrongAccount":
          ctx.response.status= 401
          ctx.response.body = {error:"Wrong email/password"}
          break;
          
        case 'PostNotFound':
          ctx.response.status= 404
          ctx.response.body = {error:"Post not found"}
          break;
          case 'CommentNotFound':
          ctx.response.status= 404
          ctx.response.body = {error:"Comment not found"}
          break;



        default:
            // const status = err.status || 500
            // const message = err.message || 'Internal Server Error'
            // ctx.status(status).json({ error: message })
    }
}

module.exports = errorHandler