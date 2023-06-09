const { User } = require('../models')

const userServices = {
  getTopUsers: async (loginUserId) => {
    const topUsers = await User.findAll({
      attributes: ['name', 'account', 'avatar', 'id', 'role'],
      include: { model: User, as: 'Followers' },
    })
    data = topUsers
      .map(i => {
        i = i.toJSON()
        return {
          ...i,
          isFollow: i.Followers.some(j => j.id === loginUserId)
        }
      })
      .filter(i => i.role === 'user' && i.id !== loginUserId)
      .sort((a, b) => b.Followers.length - a.Followers.length)
      .slice(0, 10)
    return data
  }
}

module.exports = userServices