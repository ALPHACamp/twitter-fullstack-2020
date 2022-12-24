const { User, Tweet, Reply, Like, Followship } = require('../models')
const sequelize = require('sequelize')
const bcrypt = require('bcryptjs')
const helpers = require('../_helpers')
const { Op } = require('sequelize')
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
    if (!account.trim() || !name.trim() || !email.trim() || !password.trim() || !checkPassword.trim()) throw new Error('輸入項目不完整!')
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
  putSetting: (req, res, next) => {
    const loginUser = helpers.getUser(req)
    const editUserId = req.params.id
    const { editAccount, editName, editEmail, editPassword, editCheckPassword } = req.body

    if (loginUser.id.toString() !== editUserId.toString()) {
      console.log(loginUser.id, editUserId)
      req.flash('error_messages', '不可以改別人的資料!')
      return res.redirect('back')
    }
    if (!editAccount.trim() || !editName.trim() || !editEmail.trim() || !editPassword.trim() || !editCheckPassword.trim()) {
      req.flash('error_messages', '輸入項目不完整!')
      return res.redirect('back')
    }
    if (editPassword !== editCheckPassword) {
      req.flash('error_messages', '密碼不相符!ヽ(#`Д´)ﾉ請重新輸入')
      return res.redirect('back')
    }
    if (editName.length > 50) {
      req.flash('error_messages', '字數超出上限ヽ(#`Д´)ﾉ字數要在50字以內')
      return res.redirect('back')
    }

    Promise.all([
      User.findOne({
        where: {
          [Op.and]: [{ account: editAccount }, { account: { [Op.notLike]: loginUser.account } }]
        }
      }),
      User.findOne({
        where: {
          [Op.and]: [{ email: editEmail }, { email: { [Op.notLike]: loginUser.email } }]
        }
      }),
      User.findByPk(editUserId)
    ])
      .then(([checkAccount, checkEmail, user]) => {
        if (checkAccount) throw new Error("account 已重複註冊！")
        if (checkEmail) throw new Error("email 已重複註冊！")
        const hash = bcrypt.hashSync(editPassword, 10)
        user.update({
          account: editAccount,
          name: editName,
          email: editEmail,
          password: hash
        })
        req.flash('success_messages', '成功更新！')
        res.redirect('/tweets')
      })
      .catch(err => next(err))
  },
  getUserTweets: (req, res, next) => {
    const loginUserId = helpers.getUser(req).id
    const queryUserId = req.params.id
    // [Category, { model: Comment, include: User }, { model: User, as: 'FavoritedUsers' }, { model: User, as: 'LikedUsers' }],
    return Promise.all([
      User.findByPk(queryUserId, {
        attributes: {
          include: [
            [sequelize.literal(`(SELECT COUNT(*) FROM Followships WHERE following_id = User.id)`), 'followerCount'],
            [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE follower_id = User.id)'), 'followingCount'],
            [sequelize.literal('(SELECT COUNT(*) FROM Tweets WHERE user_id = User.id)'), 'tweetsCount'],
            [sequelize.literal(`(SELECT (COUNT(*) > 0) FROM Followships WHERE following_id = ${queryUserId} AND follower_id=${loginUserId})`), 'isFollowed']
          ]
        },
        nest: true,
        raw: true
      }),
      Tweet.findAll({
        include: Like,
        attributes: {
          include: [
            [sequelize.literal(`(SELECT COUNT(*) FROM Replies WHERE tweet_id = Tweet.id)`), 'repliesCount'],
            [sequelize.literal(`(SELECT COUNT(*) FROM Likes WHERE tweet_id = Tweet.id)`), 'likesCount'],
            [sequelize.literal(`(SELECT (COUNT(*)>0) FROM Likes WHERE user_id = ${loginUserId} AND tweet_id = Tweet.id)`), 'isliked']
          ]
        },
        where: { UserId: queryUserId },
        order: [['createdAt', 'DESC']],
        nest: true,
        raw: true
      }),
      User.findAll({
        where: { role: 'user' },
        include: [{ model: User, as: 'Followers' }]
      }),
    ])
      .then(([user, tweets, users]) => {
        const currentUser = helpers.getUser(req)
        const result = users
          .map(user => ({
            ...user.toJSON(),
            followCount: user.Followers.length,
            isFollowed: helpers.getUser(req).Followings.some(f => f.id === user.id)
          }))
          .sort((a, b) => b.followCount - a.followCount)
        res.render('user-tweets', { user, tweets, result: result.slice(0, 10), currentUser })
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
            [sequelize.literal('(SELECT COUNT(*) FROM Tweets WHERE user_id = User.id)'), 'tweetsCount'],
            [sequelize.literal(`(SELECT (COUNT(*) > 0) FROM Followships WHERE following_id = ${queryUserId} AND follower_id=${loginUserId})`), 'isFollowed']
          ]
        },
        nest: true,
        raw: true
      }),
      Reply.findAll({
        where: { UserId: queryUserId },
        include: [{ model: Tweet, include: [User] }],
        order: [['createdAt', 'DESC']],
        nest: true,
        raw: true
      }),
      User.findAll({
        where: { role: 'user' },
        include: [{ model: User, as: 'Followers' }]
      })
    ])
      .then(([user, replies, users]) => {
        const currentUser = helpers.getUser(req)
        const result = users
          .map(user => ({
            ...user.toJSON(),
            followCount: user.Followers.length,
            isFollowed: helpers.getUser(req).Followings.some(f => f.id === user.id)
          }))
          .sort((a, b) => b.followCount - a.followCount)
        res.render('user-replies', { user, replies, result: result.slice(0, 10), currentUser })
      })
      .catch(err => next(err))
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
            [sequelize.literal('(SELECT COUNT(*) FROM Tweets WHERE user_id = User.id)'), 'tweetsCount'],
            [sequelize.literal(`(SELECT (COUNT(*) > 0) FROM Followships WHERE following_id = ${queryUserId} AND follower_id=${loginUserId})`), 'isFollowed']
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
        }], order: [['createdAt', 'DESC']],
        nest: true,
        raw: true
      }),
      User.findAll({
        where: { role: 'user' },
        include: [{ model: User, as: 'Followers' }]
      })
    ])
      .then(([user, likes, users]) => {
        const currentUser = helpers.getUser(req)
        const result = users
          .map(user => ({
            ...user.toJSON(),
            followCount: user.Followers.length,
            isFollowed: helpers.getUser(req).Followings.some(f => f.id === user.id)
          }))
          .sort((a, b) => b.followCount - a.followCount)
        res.render('user-likes', { user, likes, result: result.slice(0, 10), currentUser })
      })
      .catch(err => next(err))
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
      }),
      User.findAll({
        where: { role: 'user' },
        include: [{ model: User, as: 'Followers' }]
      })
    ])
      .then(([user, followings, users]) => {
        const results = followings.map(f => ({
          ...f,
          isFollowed: true
        }))
        const result = users
          .map(user => ({
            ...user.toJSON(),
            followCount: user.Followers.length,
            isFollowed: helpers.getUser(req).Followings.some(f => f.id === user.id)
          }))
          .sort((a, b) => b.followCount - a.followCount)
        res.render('following', { user, followings: results, result: result.slice(0, 10) })
      })
      .catch(err => next(err))
  },
  getUserFollower: (req, res, next) => {
    const loginUserId = helpers.getUser(req).id
    const queryUserId = req.params.id
    return Promise.all([
      User.findByPk(queryUserId, {
        attributes: ['id', 'name',
          [sequelize.literal('(SELECT COUNT(*) FROM Tweets WHERE user_id = User.id)'), 'tweetsCount']],
        include: [{ model: User, as: 'Followers' }],
        nest: true,
        raw: true
      }),
      Followship.findAll({
        attributes: ['followingId'],
        where: {
          [Op.or]: [
            { followingId: queryUserId },
            { followerId: queryUserId }
          ]
        },
        include: [{
          model: User,
          as: 'Followers',
          attributes: ['id', 'account', 'name', 'avatar', 'introduction',
            // [sequelize.literal(`(SELECT (COUNT(*) > 0) FROM Followships WHERE Followships.followerId = ${loginUserId} AND Followships.followingId=Followers.id)`), 'isFollowed']
          ]
        }],
        order: [['createdAt', 'DESC']],
        nest: true,
        raw: true
      }),
      User.findAll({
        where: { role: 'user' },
        include: [{ model: User, as: 'Followers' }]
      })
    ])
      .then(([user, followers, users]) => {
        if (!user) throw new Error("User doesn't exist!")
        const followerUser = (req.user && req.user.Followings.map(fr => fr.id)) || []
        const followingUser = followers.filter(follower => follower.followingId === loginUserId)
        const results = followingUser.map(follower => ({
          ...follower,
          isFollowed: followerUser.includes(follower.Followers.id)
        }))
        const result = users
          .map(user => ({
            ...user.toJSON(),
            followCount: user.Followers.length,
            isFollowed: helpers.getUser(req).Followings.some(f => f.id === user.id)
          }))
          .sort((a, b) => b.followCount - a.followCount)
        res.render('follower', { user, followers: results, result: result.slice(0, 10) })
      }
      )
      .catch(err => next(err))
  },
}



module.exports = userController