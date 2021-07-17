
const socketio = require('socket.io')


module.exports = (app) => {
  const io = socketio(app)
  //run  when user connect..,
  io.on('connection', socket => {
    console.log('New Ws connection....')
  })

}
