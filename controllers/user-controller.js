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
        // where: { userId: id }
      }),
      User.findAll({ include: [{ model: User, as: 'Followers' }] })
    ])
      .then(([user, users]) => {
        // const followerCount = { followerCount: user.Followers.length }
        // const followingCount = { followerCount: user.Followings.length }
        // user.push(followerCount, followingCount)
        const topUsers = users
          .map(u => ({
            // 整理格式
            ...u.toJSON(),
            name: u.name.substring(0, 20),
            account: u.account.substring(0, 20),
            // 計算追蹤者人數
            followerCount: user.Followers.length,
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
    return User.findByPk(id, {
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
        }
      ]
      // where: { userId: id }
    })
      .then(user => res.render('users/replies', { user: user.toJSON() })
      )
  },
  getUserLikes: (req, res, next) => {
    const id = req.params.userId
    return User.findByPk(id, {
      include: [
        { model: Tweet, include: Like },
        { model: Tweet, include: Reply }
      ]
      // where: { userId: id }
    })
      .then(user => res.render('users/likes', { user: user.toJSON() })
      )
  },
  addFollowing: (req, res, next) => {
    const { userId } = req.params
    Promise.all([
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
    Followship.findOne({
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
