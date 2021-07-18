const { User, Publicmsg } = require('../models')
const moment = require('moment')

const messageController = {
  getPublic: async (req, res) => {
    req.io.on("connection", (socket) => {
      console.log("a user join!")
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

      socket.on("disconnect", () => {
        console.log("a user go out");
      })
    })
    try {
      const msg = await Publicmsg.findAll({
        include: [User],
        order: [['createdAt']],
        raw: true,
        nest: true
      })

      return res.render('public', { msg })
    } catch (error) {
      console.warn(error)
    }
  }
}

module.exports = messageController