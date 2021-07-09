/* istanbul ignore file */
function allowConnection(socket, next) {
  const username = socket.handshake.auth.username
  socket.username = username
  next()
}

module.exports = allowConnection