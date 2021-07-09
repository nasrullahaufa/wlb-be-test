
const userRoute = require('./userRoute')
const postRoute = require('./postRoute')

const routing = (router) => {
    userRoute(router)
    postRoute(router)
}

module.exports = routing