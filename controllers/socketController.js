const { User, Publicmsg } = require('../models')
const moment = require('moment')

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('a user connected')

    socket.on('checkaccount', async (data) => {
      try {
        const confirm = await User.findOne({ where: { account: data.input }, raw: true, nest: true, attributes: ['account'] })
        if (confirm) {
          socket.emit('checkno', { msg: '已有人使用！' })
        } else {
          socket.emit('checkyes', { msg: '可以使用！' })
        }
      } catch (error) {
        console.warn(error)
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
