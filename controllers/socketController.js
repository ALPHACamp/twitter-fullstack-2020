const { User, Publicmsg } = require('../models')
const moment = require('moment')

module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('login', async (data) => {
      try {
        let onlineUsers = []
        let idFromSession = socket.request.session.passport
        let user = {}
        if (idFromSession) {
          user = await User.findAll({
            where: {
              id: idFromSession
            }
          })
        }
        onlineUsers.push({
          id: user.id,
          name: user.name,
          account: user.account,
          avatar: user.avatar
        })
        console.log(onlineUsers)
        io.emit('onlineUsers', onlineUsers)
      } catch (error) {
        console.error(error)
      }
    })


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
      console.log('a user disconnected');
    });
  })
}
