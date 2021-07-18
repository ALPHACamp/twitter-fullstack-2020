const { User, Publicmsg } = require('../models')
const moment = require('moment')

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('message', async (data) => {
      try {
        await Publicmsg.create({
          UserId: data.id,
          chat: data.msg
        })
        data.time = moment().fromNow()
        io.emit('message', data)
      } catch (error) {
        console.warn(error)
      }
    })

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  })
}
