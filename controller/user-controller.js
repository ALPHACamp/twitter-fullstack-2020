const { User, Tweet, Reply, Like, Followship } = require('../models')
const sequelize = require('sequelize')
const bcrypt = require('bcryptjs')
const helpers = require('../_helpers')

const userController = {
  signInPage: (req, res) => {
    res.render('signin')
  },
  //帳號密碼核對會在passport
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/tweets')
  },
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body
    // 使用req.flash會跳回signin
    // if (password !== checkPassword) req.flash('error_messages', '密碼不相符!ヽ(#`Д´)ﾉ')
    // if (name.length > 50) req.flash('error_messages', '字數超出上限ヽ(#`Д´)ﾉ')
    if (password !== checkPassword) throw new Error('密碼不相符!ヽ(#`Д´)ﾉ')
    if (name.length > 50) throw new Error('字數超出上限ヽ(#`Д´)ﾉ')
    //const { Op } = require('sequelize')
    //使用sequelize operator or，來選擇搜尋兩樣東西。
    return Promise.all([User.findOne({ where: { email } }), User.findOne({ where: { account } })])
      .then(([email, account]) => {
        if (email) throw new Error('Email already exists!')
        if (account) throw new Error('account already exists!')
        return bcrypt.hash(password, 10)
      })
      .then(hash => {
        User.create({
          account, name, email, password: hash
        })
      })
      .then(() => {
        req.flash('success_messages', '帳號註冊成功!')
        res.redirect('/signin')
      })
      .catch(err => next(err))
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },

  //註冊修改頁面
  getSetting: (req, res, next) => {
    return User.findByPk(req.params.id, { raw: true })
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        return res.render('setting', { user })
      })
      .catch(err => next(err))
  },
  //註冊修改頁面驗證
  putSetting: async (req, res, next) => {
    try {
      const { editAccount, editName, editEmail, editPassword, editCheckPassword } = req.body
      const { id, account, email } = helpers.getUser(req)

      if (editPassword !== editCheckPassword) {
        req.flash('error_messages', '密碼不相符!ヽ(#`Д´)ﾉ請重新輸入')
        return res.redirect('back')
      }
      if (editName.length > 50) {
        req.flash('error_messages', '字數超出上限ヽ(#`Д´)ﾉ字數要在50字以內')
        return res.redirect('back')
      }

      if (editAccount === account) {
        const exitAccount = await User.findOne({ where: { account } })
        if (exitAccount) {
          req.flash('error_messages', ' 帳號已重複註冊！')
          return res.redirect('back')
        }
      }
      if (editEmail === email) {
        const exitEmail = await User.findOne({ where: { email } })
        if (exitEmail) {
          req.flash('error_messages', 'Email已重複註冊！')
          return res.redirect('back')
        }
      }
      const editUser = await User.findByPk(id)
      await editUser.update({
        account: editAccount,
        name: editName,
        email: editEmail,
        password: await bcrypt.hash(editPassword, 10)
      })
      req.flash('success_messages', '成功更新！')
      res.redirect('/tweets')
    } catch (err) {
      next(err)
    }
  },
  getUserTweets: (req, res, next) => {
    const loginUserId = helpers.getUser(req).id
    const queryUserId = req.params.id
    return Promise.all([
      User.findByPk(queryUserId, {
        attributes: {
          include: [
            [sequelize.literal(`(SELECT COUNT(*) FROM Followships WHERE following_id = User.id)`), 'followerCount'],
            [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE follower_id = User.id)'), 'followingCount'],
            [sequelize.literal('(SELECT COUNT(*) FROM Tweets WHERE user_id = User.id)'), 'tweetsCount']
          ]
        },
        nest: true,
        raw: true
      }),
      Tweet.findAll({
        attributes: {
          include: [
            [sequelize.literal(`(SELECT COUNT(*) FROM Replies WHERE tweet_id = Tweet.id)`), 'repliesCount'],
            [sequelize.literal(`(SELECT COUNT(*) FROM Likes WHERE tweet_id = Tweet.id)`), 'likesCount'],
            [sequelize.literal(`(SELECT (COUNT(*)>0) FROM Likes WHERE user_id = ${loginUserId} AND tweet_id = Tweet.id)`), 'isliked']
          ]
        },
        where: { UserId: queryUserId },
        nest: true,
        raw: true
      })
    ])
      .then(([user, tweets]) => {
        res.render('user-tweets', { user, tweets })
      })
      .catch(err => next(err))
  },
  addFollowing: (req, res, next) => {
    const loginUserId = Number(helpers.getUser(req).id)
    const followingId = Number(req.body.id)
    if (loginUserId === followingId) {
      req.flash('error_messages', "You can't follow yourself!")
      return res.redirect(200, 'back')
    }
    Promise.all([
      User.findOne({ where: { id: followingId, role: 'user' } }),
      Followship.findOne({
        where: {
          followerId: loginUserId,
          followingId: followingId
        }
      })
    ])
      .then(([user, followship]) => {
        if (!user) throw new Error("User doesn't exist!")
        if (followship) throw new Error('You have already followed this user!')
        return Followship.create({
          followerId: loginUserId,
          followingId: followingId
        })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  removeFollowing: (req, res, next) => {
    const loginUserId = Number(helpers.getUser(req).id)
    const followingId = Number(req.params.id)
    Followship.findOne({
      where: {
        followerId: loginUserId,
        followingId: followingId
      }
    })
      .then(followship => {
        if (!followship) throw new Error("You haven't followed this user!")
        return followship.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  getUserReplies: (req, res, next) => {
    const loginUserId = helpers.getUser(req).id
    const queryUserId = req.params.id
    return Promise.all([
      User.findByPk(queryUserId, {
        attributes: {
          include: [
            [sequelize.literal(`(SELECT COUNT(*) FROM Followships WHERE following_id = User.id)`), 'followerCount'],
            [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE follower_id = User.id)'), 'followingCount'],
            [sequelize.literal('(SELECT COUNT(*) FROM Tweets WHERE user_id = User.id)'), 'tweetsCount']
          ]
        },
        nest: true,
        raw: true
      }),
      Reply.findAll({
        where: { UserId: queryUserId },
        include: [{ model: Tweet, include: [User] }],
        nest: true,
        raw: true
      })
    ])
      .then(([user, replies]) => {
        res.render('user-replies', { user, replies })
      })
  },
  getUserLikes: (req, res, next) => {
    const loginUserId = helpers.getUser(req).id
    const queryUserId = req.params.id
    return Promise.all([
      User.findByPk(queryUserId, {
        attributes: {
          include: [
            [sequelize.literal(`(SELECT COUNT(*) FROM Followships WHERE following_id = User.id)`), 'followerCount'],
            [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE follower_id = User.id)'), 'followingCount'],
            [sequelize.literal('(SELECT COUNT(*) FROM Tweets WHERE user_id = User.id)'), 'tweetsCount']
          ]
        },
        nest: true,
        raw: true
      }),
      Like.findAll({
        where: { UserId: queryUserId },
        include: [{
          model: Tweet,
          include: [User],
          attributes: {
            include: [
              [sequelize.literal(`(SELECT COUNT(*) FROM Replies WHERE tweet_id = Tweet.id)`), 'repliesCount'],
              [sequelize.literal(`(SELECT COUNT(*) FROM Likes WHERE tweet_id = Tweet.id)`), 'likesCount'],
              [sequelize.literal(`(SELECT (COUNT(*)>0) FROM Likes WHERE user_id = ${loginUserId} AND tweet_id = Tweet.id)`), 'isliked']
            ]
          }
        }],
        nest: true,
        raw: true
      })
    ])
      .then(([user, likes]) => {
        res.render('user-likes', { user, likes })
      })
  },
  getUserFollowing: (req, res, next) => {
    const loginUserId = helpers.getUser(req).id
    const queryUserId = req.params.id
    return Promise.all([
      User.findByPk(queryUserId, {
        attributes: ['id', 'name',
          [sequelize.literal('(SELECT COUNT(*) FROM Tweets WHERE user_id = User.id)'), 'tweetsCount']],
        nest: true,
        raw: true
      }),
      Followship.findAll({
        include: [{
          model: User,
          as: 'Followings',
          attributes: ['id', 'account', 'name', 'avatar', 'introduction',
            // [sequelize.literal(`(SELECT (COUNT(*) > 0) FROM Followships WHERE Followships.followerId = ${loginUserId} AND Followships.followingId=Followers.id)`), 'isFollowed']
          ]
        }],
        where: { followerId: queryUserId },
        order: [['createdAt', 'DESC']],
        nest: true,
        raw: true
      })
    ])
      .then(([user, followings]) =>
        res.render('following', { user, followings })
      )
      .catch(err => next(err))
  },
  getUserFollower: (req, res) => {
    const loginUserId = helpers.getUser(req).id
    const queryUserId = req.params.id
    return Promise.all([
      User.findByPk(queryUserId, {
        attributes: ['id', 'name',
          [sequelize.literal('(SELECT COUNT(*) FROM Tweets WHERE user_id = User.id)'), 'tweetsCount']],
        nest: true,
        raw: true
      }),
      Followship.findAll({
        include: [{
          model: User,
          as: 'Followers',
          attributes: ['id', 'account', 'name', 'avatar', 'introduction',
            // [sequelize.literal(`(SELECT (COUNT(*) > 0) FROM Followships WHERE Followships.followerId = ${loginUserId} AND Followships.followingId=Followers.id)`), 'isFollowed']
          ]
        }],
        where: { followingId: queryUserId },
        order: [['createdAt', 'DESC']],
        nest: true,
        raw: true
      })
    ])
      .then(([user, followers]) =>
        res.render('follower', { user, followers })
      )
      .catch(err => next(err))
  },
  // getUserAPI: (req, res, next) => {
  //   const loginUserId = helpers.getUser(req).id
  //   const editUserId = req.params.id
  //   if (editUserId !== loginUserId) {
  //     req.flash('error_messages', "You can't edit other's profile!")
  //     return res.redirect(200, 'back')
  //   }
  //   return User.findByPk(editUserId, {
  //     attributes: ['name', 'introduction', 'avatar', 'cover']
  //   })
  //     .then(user => res.json(user.toJSON()))
  //     .catch(err => next(err))
  // },
  // postUserAPI: (req, res, next) => {
  //   const loginUserId = helpers.getUser(req).id
  //   const editUserId = req.params.id
  //   if (editUserId !== loginUserId) throw new Error("You can't edit other's profile!")
  // }
}



module.exports = userController
