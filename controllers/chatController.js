const helper = require('../_helpers')

const db = require('../models')
const User = db.User

// -----------------------------------------------------------------------------------

module.exports = {
  getPublicChat: async (req, res) => {
    // sample code for online users, may be removed later
    const currentUserId = helper.getUser(req).id
    const onlineUsers = await User.findAll({ raw: true, nest: true }).filter((user) => user.role !== "admin")

    // console.log('================================================== getpublic chat')
    // console.log(currentUserId)

    // fake user data, should be removed later
    let chattingUsers = await User.findAll({ raw: true, nest: true }).filter((user) => user.role !== "admin").map((user) => ({
      id: user.id,
      account: user.account,
      createdAt: user.createdAt,
      avatar: user.avatar,
      message: `Hello All, I am ${user.account}`,
      isMe: user.id === currentUserId,
      status: "chatting",
    }))
    // status should be among: 'online' 'chatting' 'offline'

    chattingUsers = [{ account: 'user1', status: 'online' },
    { account: 'user2', status: 'online' },
    ...chattingUsers,
    { account: 'user1', status: 'offline' },
    { account: 'user2', status: 'offline' }]
    // console.log(chattingUsers)

    return res.render('publicChats', {
      navPage: 'chatpublic',
      onlineUsers: onlineUsers,
      onlineUserLength: onlineUsers.length,
      chattingUsers: chattingUsers,
    })
  }
}