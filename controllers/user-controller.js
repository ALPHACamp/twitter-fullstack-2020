const { User, Tweet, Like, Reply, Followship } = require('../models')

const userController = {
  //  add controller action here
  getUser: (req, res, next) => {
    const id = req.params.userId
    return Promise.all([
      User.findByPk(id, {
        include: [
          { model: Tweet, include: Like },
          { model: Tweet, include: Reply },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      }),
      User.findAll({ include: [{ model: User, as: 'Followers' }] })
    ])
      .then(([user, users]) => {
        const topUsers = users
          .map(u => ({
            // 整理格式
            ...u.toJSON(),
            name: u.name.substring(0, 20),
            account: u.account.substring(0, 20),
            // 計算追蹤者人數
            followerCount: u.Followers.length,
            // 判斷目前登入使用者是否已追蹤該 user 物件
            isFollowed: req.user && req.user.Followings.some(f => f.id === u.id)
          }))
          .sort((a, b) => b.followerCount - a.followerCount)
        return res.render('users/tweets', { user: user.toJSON(), topUsers })
      })
      .catch(err => next(err))
  },
  getUserReplies: (req, res, next) => {
    const id = req.params.userId
    return Promise.all([
      User.findByPk(id, {
        include: [
          { model: Tweet, include: Like },
          { model: Tweet, include: Reply },
          { model: Reply, include: { model: Tweet, include: User } },
          {
            model: Like,
            include: [
              { model: Tweet, include: User },
              { model: Tweet, include: Reply },
              { model: Tweet, include: Like }
            ]
          },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      }),
      User.findAll({ include: [{ model: User, as: 'Followers' }] })
    ])
      .then(([user, users]) => {
        const topUsers = users
          .map(u => ({
            // 整理格式
            ...u.toJSON(),
            name: u.name.substring(0, 20),
            account: u.account.substring(0, 20),
            // 計算追蹤者人數
            followerCount: u.Followers.length,
            // 判斷目前登入使用者是否已追蹤該 user 物件
            isFollowed: req.user && req.user.Followings.some(f => f.id === u.id)
          }))
          .sort((a, b) => b.followerCount - a.followerCount)
        return res.render('users/replies', { user: user.toJSON(), topUsers })
      })
      .catch(err => next(err))
  },
  getUserLikes: (req, res, next) => {
    const id = req.params.userId
    return Promise.all([
      User.findByPk(id, {
        include: [
          { model: Tweet, include: Like },
          { model: Tweet, include: Reply },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      }),
      User.findAll({ include: [{ model: User, as: 'Followers' }] })
    ])
      .then(([user, users]) => {
        const topUsers = users
          .map(u => ({
            // 整理格式
            ...u.toJSON(),
            name: u.name.substring(0, 20),
            account: u.account.substring(0, 20),
            // 計算追蹤者人數
            followerCount: u.Followers.length,
            // 判斷目前登入使用者是否已追蹤該 user 物件
            isFollowed: req.user && req.user.Followings.some(f => f.id === u.id)
          }))
          .sort((a, b) => b.followerCount - a.followerCount)
        return res.render('users/likes', { user: user.toJSON(), topUsers })
      })
      .catch(err => next(err))
  },
  addFollowing: (req, res, next) => {
    const { userId } = req.params
    return Promise.all([
      User.findByPk(userId),
      Followship.findOne({
        where: {
          followerId: req.user.id,
          followingId: req.params.userId
        }
      })
    ])
      .then(([user, followship]) => {
        if (!user) throw new Error("User didn't exist!")
        if (user.id === req.user.id) throw new Error('You are not allowed to follow yourself!')
        if (followship) throw new Error('You are already following this user!')
        return Followship.create({
          followerId: req.user.id,
          followingId: userId
        })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  removeFollowing: (req, res, next) => {
    return Followship.findOne({
      where: {
        followerId: req.user.id,
        followingId: req.params.userId
      }
    })
      .then(followship => {
        if (!followship) throw new Error("You haven't followed this user!")
        return followship.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  }

}

module.exports = userController
