const { User, Publicmsg } = require('../models')
const moment = require('moment')
let onlineUsers = []
let onlineCount = 0

module.exports = (io) => {
  io.on('connection', (socket) => {
    let onlineList = {}

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

    socket.on('login', async (data) => {
      try {
        const idFromSession = socket.request.session.passport.user
        const userFilter = onlineUsers.find((item) => { return item.id === idFromSession })
        if (!userFilter) {
          let user = await User.findAll({
            where: {
              id: idFromSession
            }
          })
          user = user.map(u => ({
            ...u.dataValues
          }))
          onlineUsers.push({
            id: user[0].id,
            name: user[0].name,
            account: user[0].account,
            avatar: user[0].avatar
          })
          onlineList = user[0]
          onlineCount = onlineUsers.length
        }
        io.emit('onlineUsers', onlineUsers)
        io.emit('onlineCount', onlineCount)
        io.emit('onlineList', onlineList)
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

    socket.on('disconnect', async () => {
      try {
        console.log('a user disconnected')
        const idFromSession = socket.request.session.passport.user
        onlineUsers = onlineUsers.filter((item) => item.id !== idFromSession)
        onlineCount = await onlineUsers.length
        io.emit('onlineCount', onlineCount)
        io.emit('onlineUsers', onlineUsers)
        io.emit('outlineList', onlineList)
      } catch (error) {
        console.warn(error)
      }
    })
  })
}
