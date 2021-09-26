// const helpers = require('../../_helpers')
// const express = require('express')
// const app = express()
// const http = require('http');
// const server = http.createServer(app);
// const { Server } = require("socket.io");
// const io = new Server(server, { cors: { origin: "*" } });
// const db = require('../../models')
// const Message = db.Message
// const User = db.User
// const { Op } = require("sequelize")
// const messageService = require('../../services/messageService.js')

// const messageController = {
//   getPrivateInbox: async (currentId, res, callback) => {
//     // const currentId = helpers.getUser(req).id
//     const currentUser = await User.findOne({
//       where: { id: currentId },
//       raw: true,
//       nest: true
//     })

//     const datas = await Message.findAll({
//       where: {
//         roomName: {
//           [Op.not]: null
//         }
//       },
//       //TODO:照時間到序排列
//       include: [
//         { model: User, attributes: ['id', 'avatar', 'name', 'account'] },
//         { model: User, as: 'toIdUser', attributes: ['id', 'avatar', 'name', 'account'] }
//       ],
//       group: ['roomName'],
//       raw: true,
//       nest: true
//     })

//     const data = await datas.map(d => ({
//       ...d,
//       content: d.content.length > 12 ? d.content.substring(0, 12) + '...' : d.content,
//       showUserName: d.toIdUser.id === currentId ? d.User.id : d.toIdUser.id,
//       showUserAccount: d.toIdUser.id === currentId ? d.User.account : d.toIdUser.account,
//       showUserAvatar: d.toIdUser.id === currentId ? d.User.avatar : d.toIdUser.avatar,
//     }))
//     console.log('整理前', data)
//     const msg = await data.filter(d => {
//       return (Number(d.toId) === Number(currentId) || Number(d.UserId) === Number(currentId))
//     })
//     console.log('整理後', msg)
//     return msg
//   }
// }

// module.exports = messageController