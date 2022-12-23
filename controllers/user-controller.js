const bcrypt = require('bcryptjs')
const { Followship, Like, Reply, Tweet, User } = require('../models')
const helpers = require('../_helpers')
const { Op } = require('sequelize')

const userController = {
  signUpPage: (req, res, next) => {
    res.render('signup')
  },
  signUp: async (req, res, next) => {
    try {
      const { account, name, email, password, checkPassword } = req.body
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(password, salt)

      if (!account.trim() || !name.trim() || !email.trim() || !password.trim() || !checkPassword.trim()) {
        throw new Error('所有資料都是必填!')
      } else if (name.length >= 50) {
        throw new Error('姓名不得超過50字!')
      } else if (password !== checkPassword) {
        throw new Error('密碼和確認密碼不一致!')
      } else {
        const userAccount = await User.findOne({ where: { account } })
        if (userAccount) throw new Error('account 已重複註冊！')
        const userEmail = await User.findOne({ where: { email } })
        if (userEmail) throw new Error('email 已重複註冊！')
        await User.create({
          account,
          name,
          email,
          avatar: 'https://i.imgur.com/cB7ZT9k.jpg',
          cover: 'https://i.imgur.com/lswsX4e.png',
          password: hash
        })
        req.flash('success_messages', '成功註冊帳號！')
        res.redirect('/signin')
      }
    } catch (err) { next(err) }
  },
  signInPage: (req, res, next) => {
    res.render('signin')
  },
  signIn: (req, res, next) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/tweets')
  },
  logout: (req, res, next) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },
  getSetting: (req, res, next) => {
    return User.findByPk(helpers.getUser(req).id)
      .then(currentUser => {
        currentUser = currentUser.toJSON()
        const { account, name, email } = currentUser
        return res.render('settings', { account, name, email })
      })
  },
  putSetting: async (req, res, next) => {
    try {
      const { account, name, email, password, checkPassword } = req.body
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(password, salt)
      if (!account || !name || !email || !password || !checkPassword) {
        throw new Error('所有資料都是必填!')
      } else if (name.length >= 50) {
        throw new Error('姓名不得超過50字!')
      } else if (password !== checkPassword) {
        throw new Error('密碼和確認密碼不一致!')
      }
      const theUser = helpers.getUser(req)
      const userAccount = await User.findOne({
        where: {
          [Op.and]: [
            { account },
            { account: { [Op.notLike]: theUser.account } }
          ]
        }
      })
      if (userAccount) throw new Error('account 已重複註冊！')
      const userEmail = await User.findOne({
        where: {
          [Op.and]: [
            { email },
            { email: { [Op.notLike]: theUser.email } }
          ]
        }
      })
      if (userEmail) throw new Error('email 已重複註冊！')
      const user = await User.findByPk(theUser.id)
      await user.update({
        account,
        name,
        email,
        password: hash
      })
      req.flash('success_messages', '成功修改帳戶設定！')
      res.redirect('/tweets')
    } catch (err) { next(err) }
  },
  getUserTweets: (req, res, next) => {
    const currentUser = helpers.getUser(req)
    return Promise.all([
      User.findByPk(req.params.id, {
        include: [
          { model: Tweet, include: [Like, Reply] },
          { model: Reply },
          { model: Like },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ],
        order: [[Tweet, 'createdAt', 'desc'], [Reply, 'createdAt', 'desc'], [Like, 'createdAt', 'desc'], [Tweet, 'id', 'desc']]
      }),
      User.findAll({
        include: [{ model: User, as: 'Followers' }],
        where: { role: 'user' }
      }),
      Like.findAll({
        attributes: ['id', 'UserId', 'TweetId'],
        raw: true,
        nest: true
      })
    ])
      .then(([user, users, likes]) => {
        if (!user) throw new Error("User doesn't exist!")
        const userProfile = user.toJSON()
        const result = users
          .map(user => ({
            ...user.toJSON(),
            followerCount: user.Followers.length,
            isFollowed: user.Followers.some(follower => follower.id === currentUser.id),
            isCurrentUser: user.id === currentUser.id
          }))
          .sort((a, b) => b.followerCount - a.followerCount)
        userProfile.Tweets.forEach(tweet => {
          tweet.isLiked = likes.some(l => (l.UserId === helpers.getUser(req).id) && (l.TweetId === tweet.id))
        })
        userProfile.isCurrentUser = userProfile.id === currentUser.id
        userProfile.isFollowed = userProfile.Followers.map(follower => Object.values(follower)[0]).some(id => id === currentUser.id)
        res.render('usertweets', { userProfile, currentUser, users: result.slice(0, 10) })
      }
      )
  },
  getUserReplies: (req, res, next) => {
    const currentUser = helpers.getUser(req)
    return Promise.all([
      User.findByPk(req.params.id, {
        include: [
          { model: Tweet },
          { model: Reply, include: { model: Tweet, include: User } },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ],
        order: [[Reply, 'createdAt', 'desc']]
      }),
      User.findAll({
        include: [{ model: User, as: 'Followers' }],
        where: { role: 'user' }
      })
    ])
      .then(([user, users]) => {
        if (!user) throw new Error("User doesn't exist!")
        const userProfile = user.toJSON()
        const result = users
          .map(user => ({
            ...user.toJSON(),
            followerCount: user.Followers.length,
            isFollowed: user.Followers.some(follower => follower.id === currentUser.id),
            isCurrentUser: user.id === currentUser.id
          }))
          .sort((a, b) => b.followerCount - a.followerCount)
        userProfile.isCurrentUser = userProfile.id === currentUser.id
        userProfile.isFollowed = userProfile.Followers.map(follower => Object.values(follower)[0]).some(id => id === currentUser.id)
        res.render('userreplies', { userProfile, users: result.slice(0, 10) })
      }
      )
  },
  getUserLikes: (req, res, next) => {
    const currentUser = helpers.getUser(req)
    return Promise.all([
      User.findByPk(req.params.id, {
        include: [
          { model: Tweet },
          { model: Like, include: { model: Tweet, include: [User, Reply, Like] } },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ],
        order: [[Like, 'createdAt', 'desc']]
      }),
      User.findAll({
        include: [{ model: User, as: 'Followers' }],
        where: { role: 'user' }
      })
    ])
      .then(([user, users]) => {
        if (!user) throw new Error("User doesn't exist!")
        const userProfile = user.toJSON()
        const result = users
          .map(user => ({
            ...user.toJSON(),
            followerCount: user.Followers.length,
            isFollowed: user.Followers.some(follower => follower.id === currentUser.id),
            isCurrentUser: user.id === currentUser.id
          }))
          .sort((a, b) => b.followerCount - a.followerCount)
        userProfile.Likes.forEach(like => {
          like.Tweet.isLiked = like.Tweet.Likes.some(l => (l.UserId === currentUser.id))
        })
        userProfile.isCurrentUser = userProfile.id === currentUser.id
        userProfile.isFollowed = userProfile.Followers.map(follower => Object.values(follower)[0]).some(id => id === currentUser.id)
        res.render('userlikes', { userProfile, users: result.slice(0, 10), currentUser })
      }
      )
  },
  getUserFollowings: (req, res, next) => {
    const currentUser = helpers.getUser(req)
    return Promise.all([
      User.findByPk(req.params.id, {
        include: [
          { model: Tweet },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ],
        order: [['Followings', Followship, 'createdAt', 'desc'], ['Followers', Followship, 'createdAt', 'desc']]
      }),
      User.findAll({
        include: [{ model: User, as: 'Followers' }],
        where: { role: 'user' }
      }),
      Followship.findAll({ where: { followerId: currentUser.id }, attributes: ['followingId'], raw: true, nest: true })
    ])
      .then(([user, users, Followed]) => {
        if (!user) throw new Error("User doesn't exist!")
        const userProfile = user.toJSON()
        const result = users
          .map(user => ({
            ...user.toJSON(),
            followerCount: user.Followers.length,
            isFollowed: user.Followers.some(follower => follower.id === currentUser.id),
            isCurrentUser: user.id === currentUser.id
          }))
          .sort((a, b) => b.followerCount - a.followerCount)
        const followList = Followed.map(e => Object.values(e)[0])
        userProfile.Followings.forEach(following => { following.isFollowed = followList.some(i => i === following.id) })
        res.render('userfollowings', { userProfile, users: result.slice(0, 10) })
      }
      )
  },
  getUserFollowers: (req, res, next) => {
    const currentUser = helpers.getUser(req)
    return Promise.all([
      User.findByPk(req.params.id, {
        include: [
          { model: Tweet },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ],
        order: [['Followers', Followship, 'createdAt', 'desc'], ['Followings', Followship, 'createdAt', 'desc']]
      }),
      User.findAll({
        include: [{ model: User, as: 'Followers' }],
        where: { role: 'user' }
      }),
      Followship.findAll({ where: { followerId: currentUser.id }, attributes: ['followingId'], raw: true, nest: true })
    ])
      .then(([user, users, Followed]) => {
        if (!user) throw new Error("User doesn't exist!")
        const userProfile = user.toJSON()
        const result = users
          .map(user => ({
            ...user.toJSON(),
            followerCount: user.Followers.length,
            isFollowed: user.Followers.some(follower => follower.id === currentUser.id),
            isCurrentUser: user.id === currentUser.id
          }))
          .sort((a, b) => b.followerCount - a.followerCount)
        const followList = Followed.map(e => Object.values(e)[0])
        userProfile.Followers.forEach(follower => { follower.isFollowed = followList.some(i => i === follower.id) })
        res.render('userfollowers', { userProfile, users: result.slice(0, 10) })
      }
      )
  },
  postUserInfo: (req, res, next) => {
  }
}

module.exports = userController
